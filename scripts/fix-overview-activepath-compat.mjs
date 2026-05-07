import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const filePath = "apps/docs/src/pages/NoctraStaticDocsPage.tsx";
const reportPath = "overview-activepath-compat-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(filePath);
let source = before;

if (!source.includes("activePath?: string;")) {
  source = source.replace(
    "description?: ReactNode;",
    `description?: ReactNode;
  activePath?: string;`
  );
}

if (!source.includes('activePath = "/overview/"')) {
  source = source.replace(
    /export function NoctraStaticDocsPage\(\{\s*page = "overview",\s*title,\s*description\s*\}: NoctraStaticDocsPageProps\) \{/,
    `export function NoctraStaticDocsPage({
  page = "overview",
  title,
  description,
  activePath = "/overview/"
}: NoctraStaticDocsPageProps) {`
  );
}

if (!source.includes("normalizedActivePath")) {
  source = source.replace(
    "const pageDescription = getPageDescription(page, description);",
    `const pageDescription = getPageDescription(page, description);
  const normalizedActivePath = activePath.endsWith("/") ? activePath : \`\${activePath}/\`;`
  );
}

source = source.replace(
  'data-active={item.href.includes("/overview") ? "true" : undefined}',
  'data-active={item.href === normalizedActivePath ? "true" : undefined}'
);

writeText(filePath, source);

const after = readText(filePath);
const problems = [];

for (const marker of [
  "activePath?: string;",
  'activePath = "/overview/"',
  "normalizedActivePath",
  'data-active={item.href === normalizedActivePath ? "true" : undefined}',
  "export function NoctraStaticDocsPage"
]) {
  if (!after.includes(marker)) {
    problems.push(`Missing marker: ${marker}`);
  }
}

const sourceFile = ts.createSourceFile(
  filePath,
  after,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = sourceFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${filePath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Overview activePath Compatibility Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraStaticDocsPage changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added activePath?: string back to NoctraStaticDocsPageProps.",
  "- Added activePath default value for existing page wrappers.",
  "- Kept Overview as the only visible Docs left-menu item.",
  "- Preserved the new Overview shell layout from STEP 326."
].join("\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
