import { existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const removedComponents = [
  "",
  "",
  "",
  "",
  "",
  ""
];

const removedKebabs = [
  ];

const removedLower = new Set([
  ...removedComponents.map((item) => item.toLowerCase()),
  ...removedKebabs.map((item) => item.toLowerCase())
]);

const archiveRoot = "archive/removed-components";

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

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
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walk(fullPath));
    } else {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

function listDirs(root) {
  if (!existsSync(root)) return [];

  return readdirSync(root)
    .map((entry) => join(root, entry).replace(/\\/g, "/"))
    .filter((path) => statSync(path).isDirectory());
}

function shouldRemovePath(path) {
  const lowerPath = path.toLowerCase();
  const base = basename(path).toLowerCase();

  if (removedLower.has(base)) return true;

  return removedKebabs.some((kebab) => {
    return lowerPath.endsWith(`/${kebab}`) || lowerPath.includes(`/${kebab}/`);
  });
}

const candidateRoots = [
  "packages/react/src/components",
  "packages/styles/src/components",
  "packages/tokens/src/components",
  "apps/docs/src/pages/components",
  "apps/docs/src/examples/components"
];

const moved = [];

for (const root of candidateRoots) {
  for (const dir of listDirs(root)) {
    if (!shouldRemovePath(dir)) continue;

    const target = `${archiveRoot}/${dir.replace(/[/:\\]/g, "__")}`;

    ensureDir(archiveRoot);

    if (existsSync(target)) {
      continue;
    }

    renameSync(dir, target);
    moved.push(`${dir} -> ${target}`);
  }
}

const patchableFiles = walk(".")
  .filter((file) => {
    if (file.includes("/node_modules/")) return false;
    if (file.includes("/.git/")) return false;
    if (file.includes("/dist/")) return false;
    if (file.includes("/archive/removed-components/")) return false;

    return /\.(ts|tsx|mts|cts|mjs|cjs|js|jsx|json|md|css)$/.test(file);
  });

const changedFiles = [];

for (const file of patchableFiles) {
  const original = readText(file);
  let next = original;

  const lines = next.split(/\r?\n/g);
  const filteredLines = lines.filter((line) => {
    const normalized = line.toLowerCase();

    const mentionsRemovedComponent = removedComponents.some((name) => {
      return new RegExp(`\\b${name}\\b`).test(line);
    });

    const mentionsRemovedKebab = removedKebabs.some((name) => normalized.includes(name));

    if (!mentionsRemovedComponent && !mentionsRemovedKebab) return true;

    const isExportImportLine =
      /^\s*export\s+/.test(line) ||
      /^\s*import\s+/.test(line) ||
      /^\s*["']\.\/.*["']\s*,?\s*$/.test(line) ||
      /^\s*["']\.\/.*["']\s*:\s*/.test(line);

    const isRouteOrRegistryLine =
      normalized.includes("component") ||
      normalized.includes("docs") ||
      normalized.includes("route") ||
      normalized.includes("registry") ||
      normalized.includes("entry") ||
      normalized.includes("export");

    return !(isExportImportLine || isRouteOrRegistryLine);
  });

  next = filteredLines.join("\n");

  for (const component of removedComponents) {
    next = next.replace(new RegExp(`\\b${component}\\b,?\\s*`, "g"), "");
  }

  for (const kebab of removedKebabs) {
    next = next.replace(new RegExp(`["']?${kebab}["']?,?\\s*`, "g"), "");
  }

  next = next
    .replace(/,\s*,/g, ",")
    .replace(/\{\s*,/g, "{")
    .replace(/,\s*\}/g, "}")
    .replace(/\[\s*,/g, "[")
    .replace(/,\s*\]/g, "]");

  if (next !== original) {
    writeText(file, next);
    changedFiles.push(file);
  }
}

const remainingMatches = [];

for (const file of patchableFiles) {
  const text = readText(file);

  for (const component of removedComponents) {
    if (text.includes(component)) {
      remainingMatches.push(`${file}: ${component}`);
    }
  }

  for (const kebab of removedKebabs) {
    if (text.includes(kebab)) {
      remainingMatches.push(`${file}: ${kebab}`);
    }
  }
}

const report = [
  "# Removed Date/Time Input Components Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Removed components",
  "",
  ...removedComponents.map((item) => `- ${item}`),
  "",
  "## Moved directories",
  "",
  ...(moved.length > 0 ? moved.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Patched files",
  "",
  ...(changedFiles.length > 0 ? changedFiles.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Remaining matches",
  "",
  ...(remainingMatches.length > 0 ? remainingMatches.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeText("removed-date-time-components-report.md", report);

console.log(`Removed date/time input components. Moved: ${moved.length}. Patched files: ${changedFiles.length}. Remaining matches: ${remainingMatches.length}. Report: removed-date-time-components-report.md`);

if (remainingMatches.length > 0) {
  throw new Error(`Removed component names still exist in active source. See removed-date-time-components-report.md`);
}
