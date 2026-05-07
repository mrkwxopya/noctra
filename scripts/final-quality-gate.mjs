import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());

const packageDirs = [
  "packages/react",
  "packages/styles",
  "packages/tokens",
  "packages/utils"
];

const projectFiles = [
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "docs/installation.md",
  "docs/theming.md",
  "docs/component-contract.md",
  "docs/foundation-summary.md",
  "docs/publish-readiness.md",
  "docs-release-checklist.md",
  "apps/docs/dist/index.html"
];

const passed = [];
const warnings = [];

function fileExists(path) {
  return existsSync(join(root, path));
}

function markFile(path, label = path) {
  if (fileExists(path)) {
    passed.push(`${label}: ${path}`);
    return true;
  }

  warnings.push(`Missing ${label}: ${path}`);
  return false;
}

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function normalizeExportTargets(packageDir, exportValue, exportName) {
  if (typeof exportValue === "string") {
    return [{ path: join(packageDir, exportValue), label: `${exportName}` }];
  }

  const targets = [];

  if (exportValue.types) {
    targets.push({ path: join(packageDir, exportValue.types), label: `${exportName} types` });
  }

  if (exportValue.import) {
    targets.push({ path: join(packageDir, exportValue.import), label: `${exportName} import` });
  }

  return targets;
}

for (const file of projectFiles) {
  markFile(file);
}

for (const packageDir of packageDirs) {
  const packageJsonPath = `${packageDir}/package.json`;

  if (!markFile(packageJsonPath)) {
    continue;
  }

  const pkg = readJson(packageJsonPath);

  if (pkg.private === false) {
    passed.push(`${pkg.name}: private=false`);
  } else {
    warnings.push(`${pkg.name}: private=false is not set`);
  }

  if (typeof pkg.version === "string" && pkg.version.includes("alpha")) {
    passed.push(`${pkg.name}: alpha version ${pkg.version}`);
  } else {
    warnings.push(`${pkg.name}: alpha version is not set`);
  }

  if (pkg.license === "MIT") {
    passed.push(`${pkg.name}: MIT license metadata`);
  } else {
    warnings.push(`${pkg.name}: MIT license metadata is not set`);
  }

  if (pkg.exports) {
    passed.push(`${pkg.name}: exports map exists`);

    for (const [exportName, exportValue] of Object.entries(pkg.exports)) {
      for (const target of normalizeExportTargets(packageDir, exportValue, exportName)) {
        markFile(target.path, `${pkg.name} ${target.label}`);
      }
    }
  } else {
    warnings.push(`${pkg.name}: exports map is missing`);
  }

  markFile(`${packageDir}/README.md`, `${pkg.name} README`);
  markFile(`${packageDir}/LICENSE`, `${pkg.name} LICENSE`);
}

const report = [
  "# Noctra Final Quality Gate Report",
  "",
  "## Status",
  "",
  warnings.length === 0 ? "PASS" : "PASS WITH WARNINGS",
  "",
  "## Passed checks",
  "",
  ...passed.map((item) => `- ${item}`),
  "",
  "## Warnings",
  "",
  ...(warnings.length === 0 ? ["- None"] : warnings.map((item) => `- ${item}`)),
  ""
].join("\n");

writeFileSync(join(root, "final-quality-gate-report.md"), report, "utf8");

console.log("Noctra final quality gate completed.");
console.log(`Passed checks: ${passed.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log("Report: final-quality-gate-report.md");