import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

const requiredExports = [
  "buildInteractiveDemoProps",
  "componentSupports",
  "getInteractiveDemoCode",
  "getInteractiveDemoPreset",
  "getComponentInteractiveDemoCode",
  "buildComponentInteractiveDemoProps"
];

for (const exportName of requiredExports) {
  if (!text.includes(`export function ${exportName}`)) {
    problems.push(`Missing export function ${exportName}`);
  }
}

if (!text.includes("component: string | { name: string }") && !text.includes("component: string | DemoComponentLike")) {
  problems.push("Preset API must accept both string and component-like objects.");
}

const removedPresetKeys = [
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

for (const key of removedPresetKeys) {
  const keyPattern = new RegExp(`(^|\\n)\\s*${key}\\s*:`, "m");

  if (keyPattern.test(text)) {
    problems.push(`Removed component still exists as preset key: ${key}`);
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
  "# Interactive Demo Preset API Compatibility Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("interactive-demo-preset-api-compat-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo preset API compatibility audit completed. Problems: ${problems.length}. Report: interactive-demo-preset-api-compat-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo preset API compatibility audit failed.");
}