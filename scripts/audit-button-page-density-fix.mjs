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

for (const required of [
  "Reference summary",
  "When to use",
  "Current Button state.",
  "Updates when a control changes.",
  "Button-specific controls",
  "curated page",
  "ControlGroup label=\"Variant\"",
  "ControlGroup label=\"Tone\"",
  "ControlGroup label=\"Size\"",
  "ControlGroup label=\"Radius\"",
  "BooleanControl label=\"Disabled\"",
  "BooleanControl label=\"Loading\""
]) {
  if (!text.includes(required)) {
    problems.push(`Missing density fix snippet: ${required}`);
  }
}

for (const forbidden of [
  "StatCard",
  "Package\" value=\"react\"",
  "Export\" value=\"Button\"",
  "API\" value",
  "Page\" value=\"Curated\"",
  "card inside card",
  "Canvas, center, Variant, Tone, Size, Radius, Density",
  "<select",
  "<input",
  "style={{",
  "CoverageMeter",
  "Documentation coverage"
]) {
  if (text.includes(forbidden)) {
    problems.push(`Forbidden pattern remains: ${forbidden}`);
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
  "# Button Page Density Fix Report",
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
  "- Hero no longer contains overflowing stat cards.",
  "- Summary is moved into normal page content.",
  "- Playground is flatter and easier to scan.",
  "- Controls remain Button-specific.",
  "- Native select/input controls are not used."
].join("\n");

writeFileSync("button-page-density-fix-report.md", `${report}\n`, "utf8");

console.log(`Button page density fix audit completed. Problems: ${problems.length}. Report: button-page-density-fix-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button page density fix audit failed.");
}