import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const reportPath = "docs-foundation-runtime-decouple-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const problems = [];

text = text
  .replace(/import\s+\*\s+as\s+NoctraReact\s+from\s+["']@noctra\/react["'];\n?/g, "")
  .replace(/type RuntimeComponent = ElementType<any>;\n?/g, "")
  .replace(/type AnyProps = Record<string, any>;\n?/g, "")
  .replace(/const runtime = NoctraReact as AnyProps;\n?/g, "")
  .replace(/const ButtonRuntime = \(runtime\.Button \?\? "button"\) as RuntimeComponent;\n?/g, "")
  .replace(/const TextInputRuntime = \(runtime\.TextInput \?\? "input"\) as RuntimeComponent;\n?/g, "")
  .replace(/const InlineCodeRuntime = \(runtime\.InlineCode \?\? "code"\) as RuntimeComponent;\n?/g, "")
  .replace(/\s*type ElementType,\n/g, "");

text = text.replace(
  /const ValueWrapper = \(link\.href \? "a" : "span"\) as RuntimeComponent;\s*/g,
  ""
);

text = text.replace(
`                  <ValueWrapper {...(link.href ? { href: link.href } : {})}>
                    {link.value}
                  </ValueWrapper>`,
`                  {link.href ? (
                    <a href={link.href}>{link.value}</a>
                  ) : (
                    <span>{link.value}</span>
                  )}`
);

text = text
  .replace(/<ButtonRuntime\b/g, "<button")
  .replace(/<\/ButtonRuntime>/g, "</button>")
  .replace(/<TextInputRuntime\b/g, "<input")
  .replace(/<\/TextInputRuntime>/g, "</input>")
  .replace(/<InlineCodeRuntime\b/g, "<code")
  .replace(/<\/InlineCodeRuntime>/g, "</code>");

text = text.replace(
  /variant=\{active === tab\.value \? "filled" : "outline"\}\s*tone=\{active === tab\.value \? "primary" : "neutral"\}\s*size="sm"\s*radius="md"/g,
  'className={active === tab.value ? "ncd2-tab-button is-active" : "ncd2-tab-button"}'
);

text = text.replace(
  /variant=\{value === option \? "filled" : "subtle"\}\s*tone=\{value === option \? "primary" : "neutral"\}\s*size="sm"\s*radius="md"/g,
  'className={value === option ? "ncd2-control-button is-active" : "ncd2-control-button"}'
);

text = text.replace(
  /variant=\{!checked \? "filled" : "subtle"\}\s*tone=\{!checked \? "primary" : "neutral"\}\s*size="sm"\s*radius="md"/g,
  'className={!checked ? "ncd2-control-button is-active" : "ncd2-control-button"}'
);

text = text.replace(
  /variant=\{checked \? "filled" : "subtle"\}\s*tone=\{checked \? "primary" : "neutral"\}\s*size="sm"\s*radius="md"/g,
  'className={checked ? "ncd2-control-button is-active" : "ncd2-control-button"}'
);

text = text.replace(
  /<input\s+value=\{query\}\s+placeholder="Search props"\s+onChange=\{\(event: \{ currentTarget: \{ value: string \} \}\) => setQuery\(event\.currentTarget\.value\)\}\s+\/>/,
  `<input
        className="ncd2-search-input"
        value={query}
        placeholder="Search props"
        onChange={(event) => setQuery(event.currentTarget.value)}
      />`
);

writeText(file, text);

const after = readText(file);

if (after.includes("@noctra/react")) {
  problems.push("NoctraMantineDocs.tsx still imports @noctra/react.");
}

if (after.includes("NoctraReact")) {
  problems.push("NoctraMantineDocs.tsx still references NoctraReact.");
}

if (after.includes("ButtonRuntime") || after.includes("TextInputRuntime") || after.includes("InlineCodeRuntime")) {
  problems.push("NoctraMantineDocs.tsx still references runtime component adapters.");
}

if (!after.includes("ncd2-left-rail")) {
  problems.push("NoctraMantineDocs.tsx missing left rail.");
}

if (!after.includes("docsSidebarLinks")) {
  problems.push("NoctraMantineDocs.tsx missing lightweight sidebar links import.");
}

const syntaxResult = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of syntaxResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Docs Foundation Runtime Decouple Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Removed @noctra/react import from docs foundation shell.",
  "- Replaced ButtonRuntime with native semantic button in docs controls.",
  "- Replaced TextInputRuntime with native input for props search.",
  "- Replaced InlineCodeRuntime with native code.",
  "- Kept actual component demos outside foundation untouched.",
  "- Preserved ncd2 shell, left rail, right TOC, and lightweight sidebar links."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Docs foundation runtime decouple completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs foundation runtime decouple failed.");
}
