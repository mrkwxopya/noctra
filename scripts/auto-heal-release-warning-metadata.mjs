import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function writeJson(path, json) {
  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`, "utf8");
}

function listPackageJsonFiles() {
  const roots = ["packages", "apps"];
  const output = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    for (const entry of readdirSync(root)) {
      const dir = join(root, entry);
      if (!statSync(dir).isDirectory()) continue;

      const packageJsonPath = join(dir, "package.json").replace(/\\/g, "/");
      if (existsSync(packageJsonPath)) output.push(packageJsonPath);
    }
  }

  return output.sort((a, b) => a.localeCompare(b));
}

const rootJson = existsSync("package.json") ? readJson("package.json") : {};
const rootLicense = typeof rootJson.license === "string" && rootJson.license.trim() ? rootJson.license : null;
const rootRepository = rootJson.repository ?? null;
const packageJsonFiles = listPackageJsonFiles();
const changes = [];
const warnings = [];

for (const path of packageJsonFiles) {
  const json = readJson(path);
  const packageName = json.name ?? path;
  const isPrivate = Boolean(json.private);
  const hasLicense = typeof json.license === "string" && json.license.trim();
  const hasRepository = typeof json.repository === "string" || (json.repository && typeof json.repository === "object");
  let changed = false;

  if (!hasLicense && !hasRepository) {
    if (rootLicense) {
      json.license = rootLicense;
      changed = true;
      changes.push(`${packageName}: inherited root license ${rootLicense}`);
    } else if (rootRepository) {
      json.repository = rootRepository;
      changed = true;
      changes.push(`${packageName}: inherited root repository metadata`);
    } else if (isPrivate) {
      json.license = "UNLICENSED";
      changed = true;
      changes.push(`${packageName}: added UNLICENSED for private package metadata`);
    } else {
      warnings.push(`${packageName}: publishable package has no root license/repository to inherit safely`);
    }
  }

  if (changed) {
    writeJson(path, json);
  }
}

const report = [
  "# Release Warning Metadata Heal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageJsonFiles.length}`,
  `Changes applied: ${changes.length}`,
  `Warnings: ${warnings.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"])
].join("\n");

writeFileSync("release-warning-metadata-heal-report.md", `${report}\n`, "utf8");

console.log(`Release warning metadata heal completed. Changes: ${changes.length}. Warnings: ${warnings.length}. Report: release-warning-metadata-heal-report.md`);