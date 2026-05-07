import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const text = readText(file);
const problems = [];

if (!text) {
  problems.push(`${file} missing or empty.`);
}

const required = [
  "function DocsBox",
  "function DocsCard",
  "function DocsStack",
  "function DocsGrid",
  "function DocsTwoGrid",
  "const BoxRuntime",
  "const ButtonRuntime",
  "NoctraDocsPage",
  "NoctraDocsTabs",
  "NoctraDocsDemo",
  "NoctraDocsPropsPanel",
  "NoctraDocsStylesApiPanel",
  "NoctraDocsSimpleNativeTable",
  "data-noctra-docs-system=\"code-block\""
];

for (const snippet of required) {
  if (!text.includes(snippet)) {
    problems.push(`Missing stabilized layout snippet: ${snippet}`);
  }
}

const forbidden = [
  "const Card =",
  "const Stack =",
  "const Group =",
  "const TableRuntime",
  "CodeBlockRuntime",
  "hasRuntimeTable",
  "<TableRuntime",
  "<CodeBlockRuntime",
  "from \"@mantine",
  "MantineProvider",
  "CoverageMeter",
  "Documentation coverage",
  "Component preview",
  "No steps available"
];

for (const snippet of forbidden) {
  if (text.includes(snippet)) {
    problems.push(`Forbidden unstable snippet remains: ${snippet}`);
  }
}

const result = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Noctra Docs Layout Primitives Stabilize Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Verified",
  "",
  "- Docs foundation uses stable Box-based layout wrappers.",
  "- Runtime Card / Stack / Group are not used as docs layout primitives.",
  "- Runtime Table / CodeBlock are not used directly in docs system.",
  "- Button controls remain Noctra Button based.",
  "- Props and Styles API tables use stable native table markup.",
  "- Code blocks use stable pre/code markup."
].join("\n");

writeFileSync("noctra-docs-layout-primitives-stabilize-report.md", `${report}\n`, "utf8");

console.log(`Noctra docs layout primitives stabilize audit completed. Problems: ${problems.length}. Report: noctra-docs-layout-primitives-stabilize-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Noctra docs layout primitives stabilize audit failed.");
}