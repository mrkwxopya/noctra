import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportPath = "date-time-removal-state-report.md";

const removedComponents = [
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

const removedKebab = [
  "date-input",
  "date-time-input",
  "month-input",
  "time-input",
  "week-input",
  "year-input",
  "time-picker",
  "calendar",
  "date-picker",
  "date-time-picker",
  "date-range-picker"
];

const ignoredPathParts = [
  "node_modules",
  ".git",
  "dist",
  "archive/removed-components",
  "safety-backups",
  ".turbo",
  ".vite",
  "coverage"
];

const activeSearchRoots = [
  "packages/react/src",
  "packages/styles/src",
  "packages/tokens/src",
  "apps/docs/src"
];

const expectedRemovedPaths = [
  ...removedComponents.map((name) => `packages/react/src/components/${name}`),
  ...removedKebab.map((name) => `packages/styles/src/components/${name}.css`),
  ...removedKebab.map((name) => `packages/tokens/src/components/${name}.ts`)
];

const problems = [];
const warnings = [];
const checkedFiles = [];
const existingRemovedPaths = [];

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function shouldIgnore(path) {
  const normalized = normalizePath(path);

  return ignoredPathParts.some((part) => normalized.includes(part));
}

function collectFiles(dir) {
  const out = [];

  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const normalized = normalizePath(full);

    if (shouldIgnore(normalized)) continue;

    const stats = statSync(full);

    if (stats.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(ts|tsx|js|jsx|css|json)$/.test(full)) {
      out.push(normalized);
    }
  }

  return out;
}

for (const removedPath of expectedRemovedPaths) {
  if (existsSync(removedPath)) {
    existingRemovedPaths.push(removedPath);
    problems.push(`Removed date/time component path still exists: ${removedPath}`);
  }
}

const files = activeSearchRoots.flatMap(collectFiles);

for (const file of files) {
  checkedFiles.push(file);

  const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");

  for (const name of removedComponents) {
    const componentPattern = new RegExp(`\\b${name}\\b`);

    if (componentPattern.test(text)) {
      problems.push(`${file}: active reference to removed component ${name}`);
    }
  }

  for (const kebab of removedKebab) {
    const kebabPattern = new RegExp(`\\b${kebab}\\b`);

    if (kebabPattern.test(text)) {
      problems.push(`${file}: active reference to removed style/token slug ${kebab}`);
    }
  }
}

if (!existsSync("archive/removed-components")) {
  warnings.push("archive/removed-components is missing; removed components may have been deleted instead of archived.");
}

const uniqueProblems = [...new Set(problems)].sort();
const uniqueWarnings = [...new Set(warnings)].sort();

const report = [
  "# Date/Time Removal State Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Removed components expected: ${removedComponents.length}`,
  `Active files checked: ${checkedFiles.length}`,
  `Existing removed paths: ${existingRemovedPaths.length}`,
  `Problems found: ${uniqueProblems.length}`,
  `Warnings found: ${uniqueWarnings.length}`,
  "",
  "## Removed components",
  "",
  ...removedComponents.map((name) => `- ${name}`),
  "",
  "## Problems",
  "",
  ...(uniqueProblems.length ? uniqueProblems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(uniqueWarnings.length ? uniqueWarnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Checked roots",
  "",
  ...activeSearchRoots.map((root) => `- ${root}`)
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Date/time removal state audit completed. Active files: ${checkedFiles.length}. Problems: ${uniqueProblems.length}. Warnings: ${uniqueWarnings.length}. Report: ${reportPath}`);

if (uniqueProblems.length > 0) {
  console.error(report);
  throw new Error("Date/time removal state audit failed.");
}
