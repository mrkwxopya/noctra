import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join, basename, dirname } from "node:path";

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

const removedNameSet = new Set(removedNames);
const removedLowerSet = new Set([
  ...removedNames.map((name) => name.toLowerCase()),
  ...removedKebabs.map((name) => name.toLowerCase())
]);

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

function listDirs(root) {
  if (!existsSync(root)) return [];

  return readdirSync(root)
    .map((entry) => join(root, entry).replace(/\\/g, "/"))
    .filter((path) => statSync(path).isDirectory());
}

function listFiles(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry).replace(/\\/g, "/");
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...listFiles(fullPath));
    } else {
      output.push(fullPath);
    }
  }

  return output;
}

function shouldRemoveDir(path) {
  const base = basename(path).toLowerCase();

  return removedLowerSet.has(base);
}

function archiveDir(path) {
  ensureDir(archiveRoot);

  const target = `${archiveRoot}/${path.replace(/[/:\\]/g, "__")}`;

  if (existsSync(target)) return null;

  renameSync(path, target);

  return `${path} -> ${target}`;
}

function isRemovalLine(line) {
  return removedNames.some((name) => {
    const exactName = new RegExp(`\\b${name}\\b`);
    if (!exactName.test(line)) return false;

    return (
      /^\s*export\s+/.test(line) ||
      /^\s*import\s+/.test(line) ||
      /^\s*\{\s*name:\s*/.test(line) ||
      /^\s*name:\s*/.test(line) ||
      /^\s*component:\s*/.test(line) ||
      line.includes("componentName") ||
      line.includes("kebab") ||
      line.includes("route") ||
      line.includes("href")
    );
  }) || removedKebabs.some((name) => {
    if (!line.toLowerCase().includes(name)) return false;

    return (
      /^\s*export\s+/.test(line) ||
      /^\s*import\s+/.test(line) ||
      line.includes("component") ||
      line.includes("route") ||
      line.includes("href") ||
      line.includes("kebab")
    );
  });
}

function patchTargetedFile(path) {
  if (!existsSync(path)) return false;

  const before = readText(path);
  const lines = before.split(/\r?\n/g);
  const afterLines = lines.filter((line) => !isRemovalLine(line));
  let after = afterLines.join("\n");

  after = after
    .replace(/,\s*,/g, ",")
    .replace(/\{\s*,/g, "{")
    .replace(/,\s*\}/g, "}")
    .replace(/\[\s*,/g, "[")
    .replace(/,\s*\]/g, "]");

  if (after !== before) {
    writeText(path, after);
    return true;
  }

  return false;
}

function patchGeneratorFilter(path) {
  if (!existsSync(path)) return false;

  let text = readText(path);

  if (text.includes("NOCTRA_REMOVED_DOC_COMPONENTS")) return false;

  const block = `
const NOCTRA_REMOVED_DOC_COMPONENTS = new Set(${JSON.stringify(removedNames, null, 2)});

function isNoctraRemovedDocComponent(name) {
  return NOCTRA_REMOVED_DOC_COMPONENTS.has(name);
}
`;

  text = `${block}\n${text}`;

  const candidates = [
    {
      from: /const components\s*=\s*componentNames\.map\(/,
      to: "const components = componentNames.filter((name) => !isNoctraRemovedDocComponent(name)).map("
    },
    {
      from: /const componentNames\s*=\s*Array\.from\(([^;]+)\);/,
      to: "const componentNames = Array.from($1).filter((name) => !isNoctraRemovedDocComponent(name));"
    },
    {
      from: /noctraDocsComponents:\s*components,/,
      to: "noctraDocsComponents: components.filter((component) => !isNoctraRemovedDocComponent(component.name)),"
    }
  ];

  let patched = false;

  for (const candidate of candidates) {
    if (candidate.from.test(text)) {
      text = text.replace(candidate.from, candidate.to);
      patched = true;
    }
  }

  if (!patched) {
    text += `

/*
Removed docs component filter:
${removedNames.map((name) => `- ${name}`).join("\n")}
If this generator collects component names in a different shape,
filter those names with isNoctraRemovedDocComponent(name) before writing generated docs data.
*/
`;
  }

  writeText(path, text);
  return true;
}

const moved = [];
const changed = [];

const componentRoots = [
  "packages/react/src/components",
  "packages/styles/src/components",
  "packages/tokens/src/components",
  "apps/docs/src/components",
  "apps/docs/src/pages/components"
];

for (const root of componentRoots) {
  for (const dir of listDirs(root)) {
    if (!shouldRemoveDir(dir)) continue;

    const result = archiveDir(dir);
    if (result) moved.push(result);
  }
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
  "apps/docs/src/data/interactiveDemoPresets.ts",
  "apps/docs/src/generated/noctra-professional-docs.generated.ts",
  "scripts/audit-component-runtime-smoke.mjs",
  "scripts/audit-professional-docs.mjs",
  "scripts/audit-real-isolated-playground.mjs"
];

for (const file of targetedFiles) {
  if (patchTargetedFile(file)) {
    changed.push(file);
  }
}

for (const file of listFiles("packages/react/src")) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  if (!file.endsWith("index.ts") && !file.endsWith("index.tsx")) continue;

  if (patchTargetedFile(file)) changed.push(file);
}

for (const file of listFiles("packages/styles/src")) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  if (!file.endsWith("index.ts") && !file.endsWith("index.tsx")) continue;

  if (patchTargetedFile(file)) changed.push(file);
}

for (const file of listFiles("packages/tokens/src")) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  if (!file.endsWith("index.ts") && !file.endsWith("index.tsx")) continue;

  if (patchTargetedFile(file)) changed.push(file);
}

if (patchGeneratorFilter("scripts/generate-professional-docs-data.mjs")) {
  changed.push("scripts/generate-professional-docs-data.mjs");
}

const activeScanRoots = [
  "packages/react/src",
  "packages/styles/src",
  "packages/tokens/src",
  "apps/docs/src",
  "scripts"
];

const remainingActiveMatches = [];

for (const root of activeScanRoots) {
  for (const file of listFiles(root)) {
    if (!/\.(ts|tsx|mjs|js|json)$/.test(file)) continue;
    if (file.includes("/generated/")) continue;

    const text = readText(file);

    for (const name of removedNames) {
      if (text.includes(name)) {
        remainingActiveMatches.push(`${file}: ${name}`);
      }
    }

    for (const kebab of removedKebabs) {
      if (text.includes(kebab)) {
        remainingActiveMatches.push(`${file}: ${kebab}`);
      }
    }
  }
}

const changedUnique = Array.from(new Set(changed)).sort();
const movedUnique = Array.from(new Set(moved)).sort();

const report = [
  "# Safe Date/Time Component Removal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Moved directories: ${movedUnique.length}`,
  `Changed targeted files: ${changedUnique.length}`,
  `Remaining active matches: ${remainingActiveMatches.length}`,
  "",
  "## Removed components",
  "",
  ...removedNames.map((name) => `- ${name}`),
  "",
  "## Moved directories",
  "",
  ...(movedUnique.length > 0 ? movedUnique.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Changed targeted files",
  "",
  ...(changedUnique.length > 0 ? changedUnique.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Remaining active matches",
  "",
  ...(remainingActiveMatches.length > 0 ? remainingActiveMatches.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Safety policy",
  "",
  "- No global find/replace was used.",
  "- Only component directories, public export/index files, docs generator, and audit-related files were targeted.",
  "- If changed targeted files exceed 100, this script fails."
].join("\n");

writeText("safe-date-time-removal-report.md", report);

console.log(`Safe date/time removal completed. Moved: ${movedUnique.length}. Changed files: ${changedUnique.length}. Remaining active matches: ${remainingActiveMatches.length}. Report: safe-date-time-removal-report.md`);

if (changedUnique.length > 100) {
  throw new Error(`Safety stop: too many changed targeted files (${changedUnique.length}).`);
}

if (remainingActiveMatches.length > 0) {
  throw new Error("Removed component names still exist in active source. See safe-date-time-removal-report.md");
}