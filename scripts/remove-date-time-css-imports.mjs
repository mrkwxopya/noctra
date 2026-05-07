import { existsSync, readFileSync, writeFileSync } from "node:fs";

const removedCssNames = [
  "date-input",
  "date-time-input",
  "datetime-input",
  "month-input",
  "time-input",
  "week-input",
  "year-input",
  "time-picker",
  "calendar",
  "date-picker",
  "date-time-picker",
  "datetime-picker",
  "date-range-picker"
];

const files = [
  "packages/styles/src/components.css",
  "apps/docs/src/noctra-style-bridge.css"
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const changed = [];
const removedLines = [];
const remainingProblems = [];

for (const file of files) {
  if (!existsSync(file)) continue;

  const before = readText(file);
  const lines = before.split(/\r?\n/g);

  const keptLines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const shouldRemove = removedCssNames.some((name) => lower.includes(name));

    if (shouldRemove) {
      removedLines.push(`${file}: ${line.trim()}`);
      continue;
    }

    keptLines.push(line);
  }

  const after = keptLines.join("\n").replace(/\n{3,}/g, "\n\n");

  if (after !== before) {
    writeText(file, after);
    changed.push(file);
  }

  const finalText = readText(file).toLowerCase();

  for (const name of removedCssNames) {
    if (finalText.includes(name)) {
      remainingProblems.push(`${file}: ${name}`);
    }
  }
}

const report = [
  "# Date/Time CSS Import Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed files: ${changed.length}`,
  `Removed lines: ${removedLines.length}`,
  `Remaining problems: ${remainingProblems.length}`,
  "",
  "## Changed files",
  "",
  ...(changed.length > 0 ? changed.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Removed lines",
  "",
  ...(removedLines.length > 0 ? removedLines.map((line) => `- ${line}`) : ["- None"]),
  "",
  "## Remaining problems",
  "",
  ...(remainingProblems.length > 0 ? remainingProblems.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("date-time-css-import-cleanup-report.md", `${report}\n`, "utf8");

console.log(`Date/time CSS import cleanup completed. Changed files: ${changed.length}. Removed lines: ${removedLines.length}. Remaining problems: ${remainingProblems.length}. Report: date-time-css-import-cleanup-report.md`);

if (remainingProblems.length > 0) {
  console.error(report);
  throw new Error("Date/time CSS import cleanup still has remaining problems.");
}