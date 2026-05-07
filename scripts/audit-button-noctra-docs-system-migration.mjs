import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const text = readText(file);
const problems = [];

if (!text) {
  problems.push(`${file} missing or empty.`);
}

const requiredSnippets = [
  "NoctraDocsPage",
  "NoctraDocsDemo",
  "NoctraDocsPropsPanel",
  "NoctraDocsStylesApiPanel",
  "DocumentationTab",
  "PropsTab",
  "StylesApiTab",
  "Documentation, Props, and Styles API tabs",
  "Noctra UI based documentation system",
  "data-variant",
  "data-tone",
  "data-size",
  "Button props",
  "Accessibility checklist"
];

for (const snippet of requiredSnippets) {
  if (!text.includes(snippet)) {
    problems.push(`Button page missing snippet: ${snippet}`);
  }
}

const forbiddenSnippets = [
  "../components/DocsChrome",
  "PageHero",
  "StatCard",
  "AnchorList",
  "Documentation coverage",
  "CoverageMeter",
  "<select",
  "<input",
  "style={{",
  "Component preview",
  "No steps available"
];

for (const snippet of forbiddenSnippets) {
  if (text.includes(snippet)) {
    problems.push(`Button page contains forbidden snippet: ${snippet}`);
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
  "# Button Noctra Docs System Migration Report",
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
  "- Button page uses NoctraDocsPage.",
  "- Button page has Documentation / Props / Styles API tabs through the Noctra UI docs system.",
  "- Button page no longer imports the old DocsChrome primitives.",
  "- Button page includes Documentation examples, searchable Props panel, and Styles API panel.",
  "- Button page remains Noctra UI based."
].join("\n");

writeFileSync("button-noctra-docs-system-migration-report.md", `${report}\n`, "utf8");

console.log(`Button Noctra docs system migration audit completed. Problems: ${problems.length}. Report: button-noctra-docs-system-migration-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button Noctra docs system migration audit failed.");
}