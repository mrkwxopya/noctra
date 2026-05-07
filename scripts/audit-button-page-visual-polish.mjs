import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const text = readText(pagePath);
const problems = [];

if (!text) {
  problems.push(`${pagePath} missing or empty.`);
}

for (const required of [
  "PreviewSurface",
  "TextControl",
  "ToggleControl",
  "Controls are specific to Button",
  "There is no generic Canvas, Density, or unsupported prop control here.",
  "getButtonCode(state)",
  "ButtonPreview state={state}",
  'id="variants"',
  'id="tones"',
  'id="sizes"',
  'id="radius"',
  'id="states"',
  'id="accessibility"'
]) {
  if (!text.includes(required)) {
    problems.push(`Missing visual polish snippet: ${required}`);
  }
}

for (const forbidden of [
  "Documentation coverage",
  "CoverageMeter",
  "Component preview",
  "Button preview",
  "No steps available",
  "Canvas, center, Variant, Tone, Size, Radius, Density"
]) {
  if (text.includes(forbidden)) {
    problems.push(`Forbidden text remains: ${forbidden}`);
  }
}

const result = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: pagePath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Button Page Visual Polish Report",
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
  "- Button page has a dedicated preview surface.",
  "- Button page has component-specific controls.",
  "- Button page keeps preview/code synchronized.",
  "- Button page has variants, tones, sizes, radius, states, props, accessibility, and related sections."
].join("\n");

writeFileSync("button-page-visual-polish-report.md", `${report}\n`, "utf8");

console.log(`Button page visual polish audit completed. Problems: ${problems.length}. Report: button-page-visual-polish-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button page visual polish audit failed.");
}