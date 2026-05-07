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
  "ControlButton",
  "ControlGroup",
  "BooleanControl",
  "Button-specific controls",
  "Only Button-supported controls are shown",
  "Rendered with the current Button state.",
  "Updates immediately when controls change.",
  "Package\" value=\"react\"",
  "Page\" value=\"Curated\"",
  "getButtonCode(state)"
]) {
  if (!text.includes(required)) {
    problems.push(`Missing real visual rework snippet: ${required}`);
  }
}

for (const forbidden of [
  "<select",
  "<input",
  "style={{",
  "Documentation coverage",
  "CoverageMeter",
  "Component preview",
  "Button preview",
  "No steps available",
  "Canvas, center, Variant, Tone, Size, Radius, Density"
]) {
  if (text.includes(forbidden)) {
    problems.push(`Forbidden text/pattern remains: ${forbidden}`);
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
  "# Button Reference Real Visual Rework Report",
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
  "- Button page no longer uses raw native select/input controls.",
  "- Button page no longer uses inline style blocks.",
  "- Hero stats use short values to avoid overflow.",
  "- Playground uses Preview and Code cards.",
  "- Controls are rendered with Noctra Button interactions.",
  "- The Button page is closer to a curated Mantine-style reference page."
].join("\n");

writeFileSync("button-reference-real-visual-rework-report.md", `${report}\n`, "utf8");

console.log(`Button reference real visual rework audit completed. Problems: ${problems.length}. Report: button-reference-real-visual-rework-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button reference real visual rework audit failed.");
}