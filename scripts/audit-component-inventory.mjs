import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function listComponentDirs() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory();
    })
    .filter((entry) => !entry.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

function hasReactIndex(componentName) {
  return existsSync(`packages/react/src/components/${componentName}/index.ts`) ||
    existsSync(`packages/react/src/components/${componentName}/index.tsx`);
}

function hasReactMain(componentName) {
  return existsSync(`packages/react/src/components/${componentName}/${componentName}.tsx`) ||
    existsSync(`packages/react/src/components/${componentName}/${componentName}.ts`);
}

function hasReactTypes(componentName) {
  return existsSync(`packages/react/src/components/${componentName}/${componentName}.types.ts`);
}

function hasReactAnatomy(componentName) {
  return existsSync(`packages/react/src/components/${componentName}/${componentName}.anatomy.ts`);
}

function packageExportExists(packageJsonPath, exportKey) {
  const raw = readText(packageJsonPath);
  if (!raw) return false;

  const json = JSON.parse(raw);
  return Boolean(json.exports?.[exportKey]);
}

function reactBarrelHas(componentName) {
  const index = readText("packages/react/src/components/index.ts");
  const escaped = componentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const direct = new RegExp(`from\\s+["']\\./${escaped}["']`);
  return direct.test(index);
}

function styleImportExists(kebabName) {
  const css = readText("packages/styles/src/components.css");
  return css.includes(`@import "./components/${kebabName}.css";`);
}

function styleFileExists(kebabName) {
  return existsSync(`packages/styles/src/components/${kebabName}.css`);
}

function stylePackageExportExists(kebabName) {
  return packageExportExists("packages/styles/package.json", `./components/${kebabName}.css`);
}

function tokenFileExists(kebabName) {
  return existsSync(`packages/tokens/src/components/${kebabName}.ts`);
}

function tokenIndexExportExists(kebabName) {
  const index = readText("packages/tokens/src/index.ts");
  return index.includes(`export * from "./components/${kebabName}";`);
}

function reactPackageExportExists(kebabName) {
  return packageExportExists("packages/react/package.json", `./${kebabName}`);
}

function duplicateLines(path) {
  const text = readText(path);
  const lines = text
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set();
  const duplicates = new Set();

  for (const line of lines) {
    if (seen.has(line)) duplicates.add(line);
    seen.add(line);
  }

  return Array.from(duplicates).sort((a, b) => a.localeCompare(b));
}

const componentNames = listComponentDirs();
const rows = [];
const problems = [];

for (const componentName of componentNames) {
  const kebabName = toKebabCase(componentName);

  const checks = {
    reactIndex: hasReactIndex(componentName),
    reactMain: hasReactMain(componentName),
    reactTypes: hasReactTypes(componentName),
    reactAnatomy: hasReactAnatomy(componentName),
    reactBarrel: reactBarrelHas(componentName),
    reactPackageExport: reactPackageExportExists(kebabName),
    styleFile: styleFileExists(kebabName),
    styleImport: styleImportExists(kebabName),
    stylePackageExport: stylePackageExportExists(kebabName),
    tokenFile: tokenFileExists(kebabName),
    tokenIndexExport: tokenIndexExportExists(kebabName)
  };

  rows.push({ componentName, kebabName, checks });

  for (const [key, ok] of Object.entries(checks)) {
    if (!ok) {
      problems.push(`${componentName}: missing ${key}`);
    }
  }
}

const duplicateReports = [
  ["packages/react/src/components/index.ts", duplicateLines("packages/react/src/components/index.ts")],
  ["packages/tokens/src/index.ts", duplicateLines("packages/tokens/src/index.ts")],
  ["packages/styles/src/components.css", duplicateLines("packages/styles/src/components.css")]
].filter(([, duplicates]) => duplicates.length > 0);

for (const [path, duplicates] of duplicateReports) {
  for (const duplicate of duplicates) {
    problems.push(`${path}: duplicate line ${duplicate}`);
  }
}

function ok(value) {
  return value ? "OK" : "MISSING";
}

const report = [
  "# Noctra Component Inventory Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Component directories: ${componentNames.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Component Matrix",
  "",
  "| Component | Kebab | React index | Main | Types | Anatomy | Barrel | React export | CSS file | CSS import | CSS export | Token file | Token export |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map(({ componentName, kebabName, checks }) => {
    return `| ${componentName} | ${kebabName} | ${ok(checks.reactIndex)} | ${ok(checks.reactMain)} | ${ok(checks.reactTypes)} | ${ok(checks.reactAnatomy)} | ${ok(checks.reactBarrel)} | ${ok(checks.reactPackageExport)} | ${ok(checks.styleFile)} | ${ok(checks.styleImport)} | ${ok(checks.stylePackageExport)} | ${ok(checks.tokenFile)} | ${ok(checks.tokenIndexExport)} |`;
  }),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Duplicate Line Scan",
  "",
  ...(duplicateReports.length > 0
    ? duplicateReports.flatMap(([path, duplicates]) => [
        `### ${path}`,
        "",
        ...duplicates.map((line) => `- ${line}`),
        ""
      ])
    : ["- None", ""])
].join("\n");

writeFileSync("component-inventory-audit-report.md", `${report}\n`, "utf8");

console.log(`Component inventory audit completed. Components: ${componentNames.length}. Problems: ${problems.length}. Report: component-inventory-audit-report.md`);