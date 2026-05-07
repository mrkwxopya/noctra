import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function listPackageJsonFiles() {
  const roots = ["packages", "apps"];
  const output = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    for (const entry of readdirSync(root)) {
      const fullPath = join(root, entry);
      if (!statSync(fullPath).isDirectory()) continue;

      const packageJsonPath = join(fullPath, "package.json");
      if (existsSync(packageJsonPath)) {
        output.push(packageJsonPath.replace(/\\/g, "/"));
      }
    }
  }

  if (existsSync("package.json")) {
    output.unshift("package.json");
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function isSemverLike(value) {
  return typeof value === "string" && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(value);
}

function hasScript(json, scriptName) {
  return Boolean(json.scripts && typeof json.scripts[scriptName] === "string" && json.scripts[scriptName].trim());
}

function hasExport(json, key) {
  return Boolean(json.exports && Object.prototype.hasOwnProperty.call(json.exports, key));
}

function hasFilesArray(json) {
  return Array.isArray(json.files) && json.files.length > 0;
}

const packageJsonFiles = listPackageJsonFiles();
const rows = [];
const problems = [];
const warnings = [];

for (const packageJsonPath of packageJsonFiles) {
  const json = readJson(packageJsonPath);
  const isRoot = packageJsonPath === "package.json";
  const isPackage = packageJsonPath.startsWith("packages/");
  const isApp = packageJsonPath.startsWith("apps/");
  const packageName = json.name ?? "-";
  const version = json.version ?? "-";
  const isPrivate = Boolean(json.private);
  const publishable = isPackage && !isPrivate;

  const checks = {
    hasName: typeof json.name === "string" && json.name.trim().length > 0,
    hasVersion: typeof json.version === "string" && json.version.trim().length > 0,
    semverVersion: isRoot || isApp || isSemverLike(json.version),
    hasTypeModule: isRoot || json.type === "module",
    hasBuildScript: isRoot || hasScript(json, "build"),
    hasTypecheckScript: isRoot || hasScript(json, "typecheck"),
    hasMainExport: !publishable || hasExport(json, "."),
    hasFiles: !publishable || hasFilesArray(json),
    hasLicense: isRoot || typeof json.license === "string" || typeof json.repository === "object" || typeof json.repository === "string",
    publishConfigAccess: !publishable || Boolean(json.publishConfig?.access)
  };

  rows.push({
    packageJsonPath,
    packageName,
    version,
    isPrivate,
    publishable,
    checks
  });

  if (!checks.hasName) problems.push(`${packageJsonPath}: missing package name`);
  if (!checks.hasVersion && !isRoot) problems.push(`${packageJsonPath}: missing package version`);
  if (!checks.semverVersion) problems.push(`${packageJsonPath}: version is not semver-like (${version})`);
  if (!checks.hasTypeModule) warnings.push(`${packageJsonPath}: package type is not module`);
  if (!checks.hasBuildScript) warnings.push(`${packageJsonPath}: missing build script`);
  if (!checks.hasTypecheckScript) warnings.push(`${packageJsonPath}: missing typecheck script`);
  if (!checks.hasMainExport) problems.push(`${packageJsonPath}: publishable package is missing exports['.']`);
  if (!checks.hasFiles) warnings.push(`${packageJsonPath}: publishable package has no files array`);
  if (!checks.hasLicense) warnings.push(`${packageJsonPath}: no license or repository metadata found`);
  if (!checks.publishConfigAccess) warnings.push(`${packageJsonPath}: publishable package has no publishConfig.access`);
}

const duplicatedNames = [];
const nameCounts = new Map();

for (const row of rows) {
  if (row.packageName === "-") continue;
  nameCounts.set(row.packageName, (nameCounts.get(row.packageName) ?? 0) + 1);
}

 for (const [name, count] of nameCounts.entries()) {
  if (count > 1) duplicatedNames.push(`${name} appears ${count} times`);
}

for (const duplicatedName of duplicatedNames) {
  problems.push(`duplicate package name: ${duplicatedName}`);
}

const report = [
  "# Noctra Release Metadata Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageJsonFiles.length}`,
  `Publishable packages detected: ${rows.filter((row) => row.publishable).length}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Release Metadata Matrix",
  "",
  "| package.json | Name | Version | Private | Publishable | Name | Version | Semver | type=module | Build | Typecheck | Main export | Files | Publish access |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map((row) => {
    const ok = (value) => value ? "OK" : "MISSING";

    return `| ${row.packageJsonPath} | ${row.packageName} | ${row.version} | ${row.isPrivate ? "YES" : "NO"} | ${row.publishable ? "YES" : "NO"} | ${ok(row.checks.hasName)} | ${ok(row.checks.hasVersion)} | ${ok(row.checks.semverVersion)} | ${ok(row.checks.hasTypeModule)} | ${ok(row.checks.hasBuildScript)} | ${ok(row.checks.hasTypecheckScript)} | ${ok(row.checks.hasMainExport)} | ${ok(row.checks.hasFiles)} | ${ok(row.checks.publishConfigAccess)} |`;
  }),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- Problems should be fixed before publishing.",
  "- Warnings are release-readiness hints, not automatic blockers.",
  "- Build, typecheck, verify-exports, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("release-metadata-audit-report.md", `${report}\n`, "utf8");

console.log(`Release metadata audit completed. Packages: ${packageJsonFiles.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: release-metadata-audit-report.md`);