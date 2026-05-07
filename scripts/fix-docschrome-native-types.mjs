import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
const mainPath = "apps/docs/src/main.tsx";
const reportPath = "docschrome-native-typefix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let chrome = readText(chromePath);
let main = readText(mainPath);

if (!chrome) throw new Error(`${chromePath} missing or empty.`);
if (!main) throw new Error(`${mainPath} missing or empty.`);

const beforeChrome = chrome;
const beforeMain = main;

if (!chrome.includes("function optionalNode(")) {
  chrome = chrome.replace(
`function renderUnknown(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";`,
`function optionalNode(value: unknown): ReactNode | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return renderUnknown(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function optionalStyle(value: unknown): CSSProperties | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as CSSProperties : undefined;
}

function optionalClassName(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function renderUnknown(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";`
  );
}

chrome = chrome
  .replace(/cx\(([^)]*?), className\)/g, "cx($1, optionalClassName(className))")
  .replace(/style=\{style\}/g, "style={optionalStyle(style)}");

chrome = chrome.replace(
`          {stats.map((stat, index) => (
            <StatCard key={index} {...(typeof stat === "object" && stat !== null ? stat as Record<string, unknown> : { value: stat })} />
          ))}`,
`          {stats.map((stat, index) => {
            const record = typeof stat === "object" && stat !== null ? stat as Record<string, unknown> : { value: stat };

            return (
              <StatCard
                key={index}
                label={optionalNode(record.label ?? record.title)}
                value={optionalNode(record.value ?? record.count ?? record.total ?? stat)}
                description={optionalNode(record.description ?? record.summary)}
              />
            );
          })}`
);

chrome = chrome.replace(
`          <DocCard
            key={index}
            title={renderUnknown(record.title ?? record.label ?? item)}
            description={renderUnknown(record.description ?? record.summary ?? "")}
            href={typeof record.href === "string" ? record.href : undefined}
          />`,
`          <DocCard
            key={index}
            title={renderUnknown(record.title ?? record.label ?? item)}
            description={optionalNode(record.description ?? record.summary)}
            {...(typeof record.href === "string" ? { href: record.href } : {})}
          />`
);

chrome = chrome.replace(
`export type DocCardProps = LooseProps & {
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  tone?: string;
};`,
`export type DocCardProps = LooseProps & {
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  href?: string | undefined;
  tone?: string;
};`
);

chrome = chrome.replace(
`export type StatCardProps = LooseProps & {
  label?: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
};`,
`export type StatCardProps = LooseProps & {
  label?: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
};`
);

main = main
  .replace(/:\s*DocsRoute\b/g, ": typeof DocsRoute")
  .replace(/<DocsRoute>/g, "<typeof DocsRoute>")
  .replace(/as\s+DocsRoute\b/g, "as typeof DocsRoute");

writeText(chromePath, chrome);
writeText(mainPath, main);

const afterChrome = readText(chromePath);
const afterMain = readText(mainPath);
const problems = [];

if (afterChrome.includes("@noctra/react")) {
  problems.push("DocsChrome still imports @noctra/react.");
}

if (!afterChrome.includes("optionalStyle")) {
  problems.push("DocsChrome missing optionalStyle helper.");
}

if (!afterChrome.includes("optionalClassName")) {
  problems.push("DocsChrome missing optionalClassName helper.");
}

if (afterMain.match(/:\s*DocsRoute\b/)) {
  problems.push("main.tsx still uses DocsRoute as a type without typeof.");
}

for (const [file, source] of [
  [chromePath, afterChrome],
  [mainPath, afterMain]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: file.endsWith(".tsx") ? ts.JsxEmit.ReactJSX : ts.JsxEmit.Preserve
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# DocsChrome Native Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Chrome changed: ${beforeChrome === afterChrome ? "no" : "yes"}`,
  `Main changed: ${beforeMain === afterMain ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added optionalNode, optionalString, optionalStyle and optionalClassName helpers.",
  "- Sanitized unknown className/style values before passing to DOM.",
  "- Avoided href={undefined} under exactOptionalPropertyTypes.",
  "- Replaced DocsRoute type usage in main.tsx with typeof DocsRoute.",
  "- Kept DocsChrome native and decoupled from @noctra/react."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`DocsChrome native typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("DocsChrome native typefix failed.");
}
