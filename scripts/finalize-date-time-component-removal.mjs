import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync
} from "node:fs";
import { basename, dirname, join } from "node:path";

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

const removedTokenIdentifiers = [
  "ncCalendarTokenNames",
  "NcCalendarTokenName",
  "ncDateInputTokenNames",
  "NcDateInputTokenName",
  "ncDatePickerTokenNames",
  "NcDatePickerTokenName",
  "ncDateRangePickerTokenNames",
  "NcDateRangePickerTokenName",
  "ncDateTimeInputTokenNames",
  "NcDateTimeInputTokenName",
  "ncDateTimePickerTokenNames",
  "NcDateTimePickerTokenName",
  "ncMonthInputTokenNames",
  "NcMonthInputTokenName",
  "ncTimeInputTokenNames",
  "NcTimeInputTokenName",
  "ncTimePickerTokenNames",
  "NcTimePickerTokenName",
  "ncWeekInputTokenNames",
  "NcWeekInputTokenName",
  "ncYearInputTokenNames",
  "NcYearInputTokenName"
];

const archiveRoot = "archive/removed-components";

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  ensureDir(dirname(path));
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

function archiveFile(path) {
  if (!existsSync(path)) return null;

  ensureDir(archiveRoot);

  const target = `${archiveRoot}/${path.replace(/[/:\\]/g, "__")}`;

  if (existsSync(target)) {
    return null;
  }

  renameSync(path, target);

  return `${path} -> ${target}`;
}

function archiveDir(path) {
  if (!existsSync(path) || !statSync(path).isDirectory()) return null;

  ensureDir(archiveRoot);

  const target = `${archiveRoot}/${path.replace(/[/:\\]/g, "__")}`;

  if (existsSync(target)) {
    return null;
  }

  renameSync(path, target);

  return `${path} -> ${target}`;
}

function removeLinesMentioning(path, terms) {
  if (!existsSync(path)) return false;

  const before = readText(path);
  const after = before
    .split(/\r?\n/g)
    .filter((line) => !terms.some((term) => line.includes(term)))
    .join("\n")
    .replace(/,\s*,/g, ",")
    .replace(/\{\s*,/g, "{")
    .replace(/,\s*\}/g, "}")
    .replace(/\[\s*,/g, "[")
    .replace(/,\s*\]/g, "]")
    .replace(/\n{3,}/g, "\n\n");

  if (after !== before) {
    writeText(path, after);
    return true;
  }

  return false;
}

function removeJsonExports(path) {
  if (!existsSync(path)) return false;

  const before = readText(path);
  let data;

  try {
    data = JSON.parse(before);
  } catch {
    return false;
  }

  if (!data || typeof data !== "object" || !data.exports || typeof data.exports !== "object") {
    return false;
  }

  let changed = false;

  for (const kebab of removedKebabs) {
    const reactKey = `./${kebab}`;
    const styleKey = `./components/${kebab}.css`;
    const tokenKey = `./components/${kebab}`;

    for (const key of [reactKey, styleKey, tokenKey]) {
      if (Object.prototype.hasOwnProperty.call(data.exports, key)) {
        delete data.exports[key];
        changed = true;
      }
    }
  }

  if (changed) {
    writeText(path, JSON.stringify(data, null, 2));
  }

  return changed;
}

function removeObjectProperties(path, propertyNames) {
  if (!existsSync(path)) return false;

  let text = readText(path);
  const before = text;

  for (const propertyName of propertyNames) {
    let searchFrom = 0;

    while (searchFrom < text.length) {
      const match = new RegExp(`(^|\\n)(\\s*)${propertyName}\\s*:\\s*\\{`, "m").exec(text.slice(searchFrom));

      if (!match || match.index === undefined) break;

      const localStart = match.index + match[1].length;
      const start = searchFrom + localStart;
      const openBrace = text.indexOf("{", start);

      if (openBrace === -1) break;

      let depth = 0;
      let end = openBrace;

      for (; end < text.length; end += 1) {
        const char = text[end];

        if (char === "{") depth += 1;
        if (char === "}") depth -= 1;

        if (depth === 0) {
          end += 1;
          break;
        }
      }

      while (text[end] === "," || text[end] === "\r" || text[end] === "\n") {
        end += 1;
      }

      text = `${text.slice(0, start)}${text.slice(end)}`;
      searchFrom = start;
    }
  }

  if (text !== before) {
    writeText(path, text);
    return true;
  }

  return false;
}

const moved = [];
const changed = [];

for (const kebab of removedKebabs) {
  for (const file of [
    `packages/tokens/src/components/${kebab}.ts`,
    `packages/styles/src/components/${kebab}.css`
  ]) {
    const result = archiveFile(file);
    if (result) moved.push(result);
  }
}

for (const name of removedNames) {
  for (const dir of [
    `packages/react/src/components/${name}`,
    `apps/docs/src/components/${name}`,
    `apps/docs/src/pages/components/${name}`
  ]) {
    const result = archiveDir(dir);
    if (result) moved.push(result);
  }
}

const linePatchFiles = [
  "packages/tokens/src/index.ts",
  "packages/tokens/src/components/index.ts",
  "packages/styles/src/index.ts",
  "packages/styles/src/components/index.ts",
  "packages/styles/src/index.css",
  "packages/react/src/index.ts",
  "packages/react/src/index.tsx",
  "packages/react/src/components/index.ts",
  "packages/react/src/generated/component-smoke.generated.tsx",
  "packages/styles/src/generated/component-style-smoke.generated.ts",
  "packages/tokens/src/generated/component-token-smoke.generated.ts",
  "apps/docs/src/data/interactiveDemoPresets.ts",
  "apps/docs/src/generated/noctra-component-registry.generated.ts"
];

const terms = [
  ...removedNames,
  ...removedKebabs,
  ...removedTokenIdentifiers
];

for (const file of linePatchFiles) {
  if (removeLinesMentioning(file, terms)) {
    changed.push(file);
  }
}

for (const packageJson of [
  "packages/react/package.json",
  "packages/styles/package.json",
  "packages/tokens/package.json"
]) {
  if (removeJsonExports(packageJson)) {
    changed.push(packageJson);
  }
}

if (removeObjectProperties("apps/docs/src/data/interactiveDemoPresets.ts", removedNames)) {
  changed.push("apps/docs/src/data/interactiveDemoPresets.ts");
}

const activeProblems = [];

const blockingRoots = [
  "packages/react/src",
  "packages/styles/src",
  "packages/tokens/src",
  "apps/docs/src"
];

for (const root of blockingRoots) {
  for (const file of walk(root)) {
    if (!/\.(ts|tsx|js|jsx|mjs|json|css)$/.test(file)) continue;
    if (file.includes("/archive/")) continue;
    if (file.includes("/dist/")) continue;

    const text = readText(file);

    for (const term of terms) {
      if (text.includes(term)) {
        activeProblems.push(`${file}: ${term}`);
      }
    }
  }
}

const report = [
  "# Date/Time Final Removal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Moved files/directories: ${moved.length}`,
  `Changed files: ${Array.from(new Set(changed)).length}`,
  `Active problems: ${activeProblems.length}`,
  "",
  "## Moved",
  "",
  ...(moved.length > 0 ? moved.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Changed",
  "",
  ...(changed.length > 0 ? Array.from(new Set(changed)).sort().map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Active problems",
  "",
  ...(activeProblems.length > 0 ? activeProblems.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeText("date-time-final-removal-report.md", report);

console.log(`Date/time final removal completed. Moved: ${moved.length}. Changed: ${Array.from(new Set(changed)).length}. Active problems: ${activeProblems.length}. Report: date-time-final-removal-report.md`);

if (activeProblems.length > 0) {
  console.error(report);
  throw new Error("Date/time final removal still has active problems.");
}