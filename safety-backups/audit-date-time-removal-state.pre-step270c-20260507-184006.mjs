import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

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

const removedKebabs = [
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

const removedDirNames = new Set([
  ...removedNames.map((name) => name.toLowerCase()),
  ...removedKebabs.map((name) => name.toLowerCase())
]);

const allowedFiles = new Set([
  "scripts/safe-remove-date-time-components.mjs",
  "scripts/audit-removed-date-time-components.mjs",
  "scripts/audit-date-time-removal-state.mjs",
  "scripts/clean-date-time-exports-targeted.mjs",
  "scripts/audit-component-runtime-smoke.mjs",
  "scripts/generate-professional-docs-data.mjs"
]);

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function walk(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry).replace(/\\/g, "/");
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walk(fullPath));
    } else {
      output.push(fullPath);
    }
  }

  return output;
}

function listDirs(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry).replace(/\\/g, "/");
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(fullPath);
      output.push(...listDirs(fullPath));
    }
  }

  return output;
}

function lineMentionsRemoved(line) {
  const lower = line.toLowerCase();

  return (
    removedNames.some((name) => new RegExp(`\\b${name}\\b`).test(line)) ||
    removedKebabs.some((name) => lower.includes(name))
  );
}

function isBlockingLine(line) {
  if (!lineMentionsRemoved(line)) return false;

  return (
    /^\s*export\s+/.test(line) ||
    /^\s*import\s+/.test(line) ||
    /^\s*\}\s+from\s+/.test(line) ||
    /^\s*name:\s*["']/.test(line) ||
    /^\s*component:\s*/.test(line) ||
    /^\s*kebab:\s*["']/.test(line) ||
    /^\s*path:\s*["']/.test(line) ||
    /^\s*href:\s*["']/.test(line) ||
    line.includes("docsHref(`/components/") ||
    line.includes("componentSlug")
  );
}

const problems = [];
const allowedMatches = [];
const informationalMatches = [];

for (const root of [
  "packages/react/src/components",
  "packages/styles/src/components",
  "packages/tokens/src/components",
  "apps/docs/src/components",
  "apps/docs/src/pages/components"
]) {
  for (const dir of listDirs(root)) {
    const base = basename(dir).toLowerCase();

    if (removedDirNames.has(base)) {
      problems.push(`Removed component directory still active: ${dir}`);
    }
  }
}

const scannedFiles = [
  ...walk("packages/react/src"),
  ...walk("packages/styles/src"),
  ...walk("packages/tokens/src"),
  ...walk("apps/docs/src"),
  ...walk("scripts")
]
  .filter((file) => /\.(ts|tsx|mjs|js|json)$/.test(file))
  .filter((file) => !file.includes("/node_modules/"))
  .filter((file) => !file.includes("/dist/"))
  .filter((file) => !file.includes("/archive/"))
  .filter((file) => !file.includes("/safety-backups/"));

for (const file of scannedFiles) {
  const text = readText(file);
  const lines = text.split(/\r?\n/g);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!lineMentionsRemoved(line)) continue;

    const entry = `${file}:${index + 1}: ${line.trim()}`;

    if (allowedFiles.has(file)) {
      allowedMatches.push(entry);
      continue;
    }

    if (file.includes("/generated/")) {
      if (/name:\s*["'](DateInput|DateTimeInput|MonthInput|TimeInput|WeekInput|YearInput|TimePicker|Calendar|DatePicker|DateTimePicker|DateRangePicker)["']/.test(line)) {
        problems.push(`Generated docs still includes removed component: ${entry}`);
      } else {
        informationalMatches.push(entry);
      }

      continue;
    }

    if (isBlockingLine(line)) {
      problems.push(`Active source still references removed component: ${entry}`);
    } else {
      informationalMatches.push(entry);
    }
  }
}

const report = [
  "# Date/Time Removal State Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  `Allowed matches: ${allowedMatches.length}`,
  `Informational matches: ${informationalMatches.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Allowed matches",
  "",
  ...(allowedMatches.length > 0 ? allowedMatches.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Informational matches",
  "",
  ...(informationalMatches.length > 0 ? informationalMatches.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("date-time-removal-state-report.md", `${report}\n`, "utf8");

console.log(`Date/time removal state audit completed. Problems: ${problems.length}. Allowed matches: ${allowedMatches.length}. Informational matches: ${informationalMatches.length}. Report: date-time-removal-state-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Date/time removal state audit failed.");
}