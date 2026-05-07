import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/pages/ComponentDetailPage.tsx";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

const requiredSections = [
  'id="usage"',
  'id="playground"',
  'id="examples"',
  'id="controlled"',
  'id="compound"',
  'id="props"',
  'id="accessibility"',
  'id="related"'
];

for (const section of requiredSections) {
  if (!text.includes(section)) {
    problems.push(`Missing Mantine-style section: ${section}`);
  }
}

const requiredTerms = [
  "InteractiveComponentDemo",
  "MantineStyleComponentDocs",
  "Props API",
  "Accessibility",
  "Controlled usage",
  "Compound usage",
  "docsHref(`/components/${item.kebab}`)"
];

for (const term of requiredTerms) {
  if (!text.includes(term)) {
    problems.push(`Missing required term: ${term}`);
  }
}

for (const forbidden of [
  "Documentation coverage",
  "CoverageMeter",
  "apiCoverageMax",
  "apiCoverageValue",
  "Integration status",
  "Source and package integration"
]) {
  if (text.includes(forbidden)) {
    problems.push(`Forbidden old docs section still exists: ${forbidden}`);
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
  "# Component Detail Mantine Flow Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Verified flow",
  "",
  "- Usage",
  "- Interactive playground",
  "- Examples",
  "- Controlled usage",
  "- Compound usage",
  "- Props",
  "- Accessibility",
  "- Related components"
].join("\n");

writeFileSync("component-detail-mantine-flow-report.md", `${report}\n`, "utf8");

console.log(`Component detail Mantine flow audit completed. Problems: ${problems.length}. Report: component-detail-mantine-flow-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component detail Mantine flow audit failed.");
}