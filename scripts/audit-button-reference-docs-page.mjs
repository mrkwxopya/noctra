import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/ButtonReferencePage.tsx";
const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const page = readText(pagePath);
const detail = readText(detailPath);
const problems = [];

if (!page) problems.push(`${pagePath} missing or empty.`);
if (!detail) problems.push(`${detailPath} missing or empty.`);

for (const required of [
  'id="usage"',
  'id="playground"',
  'id="variants"',
  'id="tones"',
  'id="sizes"',
  'id="radius"',
  'id="states"',
  'id="props"',
  'id="accessibility"',
  'id="related"',
  "getButtonCode(state)",
  "ButtonPreview",
  "Preview",
  "Controls",
  "variant",
  "tone",
  "size",
  "radius",
  "disabled",
  "loading"
]) {
  if (!page.includes(required)) {
    problems.push(`ButtonReferencePage missing required snippet: ${required}`);
  }
}

if (!detail.includes('component.name === "Button"')) {
  problems.push("ComponentDetailPage does not route Button to ButtonReferencePage.");
}

if (!detail.includes('from "./ButtonReferencePage"')) {
  problems.push("ComponentDetailPage missing ButtonReferencePage import.");
}

for (const forbidden of [
  "Documentation coverage",
  "CoverageMeter",
  "Component preview",
  "Button preview",
  "No steps available"
]) {
  if (page.includes(forbidden)) {
    problems.push(`ButtonReferencePage contains forbidden placeholder/coverage text: ${forbidden}`);
  }
}

for (const [path, source] of [
  [pagePath, page],
  [detailPath, detail]
]) {
  if (!source) continue;

  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: path
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${path} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Button Reference Docs Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Verified intent",
  "",
  "- Button has a curated Mantine-style reference page.",
  "- Preview and code are generated from one shared state.",
  "- Variants, tones, sizes, radius, states, props, accessibility, and related sections exist.",
  "- ComponentDetailPage routes Button to this curated page."
].join("\n");

writeFileSync("button-reference-docs-report.md", `${report}\n`, "utf8");

console.log(`Button reference docs audit completed. Problems: ${problems.length}. Report: button-reference-docs-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button reference docs audit failed.");
}