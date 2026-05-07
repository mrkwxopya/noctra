import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
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

function lineMentionsRemoved(line) {
  const lower = line.toLowerCase();

  return (
    removedNames.some((name) => new RegExp(`\\b${name}\\b`).test(line)) ||
    removedKebabs.some((name) => lower.includes(name))
  );
}

function shouldRemoveLine(line) {
  if (!lineMentionsRemoved(line)) return false;

  return (
    /^\s*export\s+/.test(line) ||
    /^\s*import\s+/.test(line) ||
    /^\s*\}\s+from\s+/.test(line) ||
    /^\s*["'][^"']+["']\s*,?\s*$/.test(line) ||
    /^\s*name:\s*["']/.test(line) ||
    /^\s*component:\s*/.test(line) ||
    /^\s*path:\s*["']/.test(line) ||
    /^\s*href:\s*["']/.test(line) ||
    /^\s*kebab:\s*["']/.test(line)
  );
}

const targetedFiles = [
  "packages/react/src/index.ts",
  "packages/react/src/index.tsx",
  "packages/react/src/components/index.ts",
  "packages/styles/src/index.ts",
  "packages/styles/src/components/index.ts",
  "packages/tokens/src/index.ts",
  "packages/tokens/src/components/index.ts",
  "apps/docs/src/data/docsCatalog.ts",
  "apps/docs/src/data/routes.tsx",
  "apps/docs/src/data/interactiveDemoPresets.ts"
];

for (const root of ["packages/react/src", "packages/styles/src", "packages/tokens/src"]) {
  for (const file of walk(root)) {
    if ((file.endsWith("index.ts") || file.endsWith("index.tsx")) && !targetedFiles.includes(file)) {
      targetedFiles.push(file);
    }
  }
}

const changed = [];

for (const file of targetedFiles) {
  if (!existsSync(file)) continue;

  const before = readText(file);
  const after = before
    .split(/\r?\n/g)
    .filter((line) => !shouldRemoveLine(line))
    .join("\n")
    .replace(/,\s*,/g, ",")
    .replace(/\{\s*,/g, "{")
    .replace(/,\s*\}/g, "}")
    .replace(/\[\s*,/g, "[")
    .replace(/,\s*\]/g, "]");

  if (after !== before) {
    writeText(file, after);
    changed.push(file);
  }
}

console.log(`Targeted date/time export cleanup completed. Changed files: ${changed.length}`);
for (const file of changed) {
  console.log(`- ${file}`);
}