import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

if (!text) {
  problems.push(`Missing or empty ${file}`);
}

const removedNames = [
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
];

for (const name of removedNames) {
  const unsafeObjectKey = new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m");

  if (unsafeObjectKey.test(text)) {
    problems.push(`Removed component still exists as preset key: ${name}`);
  }
}

if (!text.includes("export const interactiveDemoPresets")) {
  problems.push("Missing interactiveDemoPresets export.");
}

if (!text.includes("getInteractiveDemoPreset")) {
  problems.push("Missing getInteractiveDemoPreset export.");
}

const transpile = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of transpile.diagnostics ?? []) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  problems.push(`TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Interactive Demo Presets Repair Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("interactive-demo-presets-repair-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo presets syntax audit completed. Problems: ${problems.length}. Report: interactive-demo-presets-repair-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo presets syntax audit failed.");
}