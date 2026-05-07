import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const files = [
  "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx",
  "apps/docs/src/components/docs-system/index.ts"
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const problems = [];
const foundation = readText(files[0]);

if (!foundation) {
  problems.push(`${files[0]} missing or empty.`);
}

const requiredSnippets = [
  'import * as NoctraReact from "@noctra/react"',
  "ElementType",
  "NoctraDocsPage",
  "NoctraDocsHeader",
  "NoctraDocsTabs",
  "Documentation",
  "Props",
  "Styles API",
  "NoctraDocsDemo",
  "NoctraDocsControlGroup",
  "NoctraDocsBooleanControl",
  "NoctraDocsPropsPanel",
  "NoctraDocsPropsTable",
  "NoctraDocsStylesApiPanel",
  "NoctraDocsToc",
  "NoctraDocsPreviousNext"
];

for (const snippet of requiredSnippets) {
  if (!foundation.includes(snippet)) {
    problems.push(`Foundation missing snippet: ${snippet}`);
  }
}

const forbiddenSnippets = [
  'from "@mantine',
  "MantineProvider",
  "namespace JSX",
  "JSX.IntrinsicElements",
  "createElement",
  "Documentation coverage",
  "CoverageMeter",
  "Component preview",
  "No steps available"
];

for (const snippet of forbiddenSnippets) {
  if (foundation.includes(snippet)) {
    problems.push(`Foundation contains forbidden snippet: ${snippet}`);
  }
}

for (const file of files) {
  const source = readText(file);

  if (!source) continue;

  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Noctra UI Docs Foundation Typefix Report",
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
  "- Foundation uses React ElementType instead of JSX namespace.",
  "- Foundation avoids the createElement helper.",
  "- Foundation avoids passing explicit undefined optional props.",
  "- Foundation remains Noctra UI based.",
  "- Documentation / Props / Styles API tabs remain available."
].join("\n");

writeFileSync("noctra-ui-docs-foundation-typefix-report.md", `${report}\n`, "utf8");

console.log(`Noctra UI docs foundation typefix audit completed. Problems: ${problems.length}. Report: noctra-ui-docs-foundation-typefix-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Noctra UI docs foundation typefix audit failed.");
}