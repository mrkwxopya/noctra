import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const reportPath = "interactive-demo-presets-never-includes-typefix-report.md";
const beforeLogPath = "interactive-demo-presets-never-includes-before.log";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function runTypecheck() {
  try {
    execSync("pnpm --filter @noctra/docs typecheck", {
      encoding: "utf8",
      stdio: "pipe",
      shell: true
    });

    return "";
  } catch (error) {
    return `${error.stdout || ""}\n${error.stderr || ""}`;
  }
}

function patchIncludesLine(line) {
  if (!line.includes(".includes(")) return line;
  if (line.includes("as readonly unknown[]")) return line;

  return line.replace(
    /([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\.includes\(/g,
    "($1 as readonly unknown[]).includes("
  );
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeTypecheck = runTypecheck();
writeText(beforeLogPath, beforeTypecheck);

const targetLines = new Set();

for (const match of beforeTypecheck.matchAll(/src\/data\/interactiveDemoPresets\.ts\((\d+),(\d+)\): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'/g)) {
  targetLines.add(Number(match[1]));
}

const lines = text.split(/\r?\n/);
const patchedLines = [];

if (targetLines.size > 0) {
  for (const lineNumber of targetLines) {
    const index = lineNumber - 1;

    if (index >= 0 && index < lines.length) {
      const beforeLine = lines[index];
      const afterLine = patchIncludesLine(beforeLine);

      if (beforeLine !== afterLine) {
        lines[index] = afterLine;
        patchedLines.push(`${lineNumber}: ${beforeLine.trim()} -> ${afterLine.trim()}`);
      }
    }
  }
}

if (patchedLines.length === 0) {
  for (let index = 0; index < lines.length; index++) {
    const beforeLine = lines[index];

    if (
      beforeLine.includes(".includes(") &&
      beforeLine.includes("component") &&
      !beforeLine.includes("as readonly unknown[]")
    ) {
      const afterLine = patchIncludesLine(beforeLine);

      if (beforeLine !== afterLine) {
        lines[index] = afterLine;
        patchedLines.push(`${index + 1}: ${beforeLine.trim()} -> ${afterLine.trim()}`);
      }
    }
  }
}

text = lines.join("\n");
writeText(file, text);

const problems = [];

const transpileResult = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of transpileResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

if (patchedLines.length === 0 && beforeTypecheck.includes("not assignable to parameter of type 'never'")) {
  problems.push("Typecheck reported never includes error, but no .includes line was patched.");
}

const afterHits = [
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
].filter((name) => new RegExp(`\\b${name}\\b`).test(text));

if (afterHits.length > 0) {
  problems.push(`Removed date/time component names still remain in interactiveDemoPresets.ts: ${afterHits.join(", ")}`);
}

const report = [
  "# Interactive Demo Presets never includes Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Target TS2345 lines found: ${targetLines.size}`,
  `Patched includes lines: ${patchedLines.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Patched lines",
  "",
  ...(patchedLines.length ? patchedLines.map((line) => `- ${line}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Interactive demo presets never includes typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo presets never includes typefix failed.");
}
