import { existsSync, readFileSync, writeFileSync } from "node:fs";

const packagePath = "package.json";
const workflowPath = ".github/workflows/docs.yml";
const targetVersion = "10.33.2";
const targetPackageManager = `pnpm@${targetVersion}`;

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const problems = [];
const changes = [];

const pkgText = readText(packagePath);
const workflowText = readText(workflowPath);

if (!pkgText) problems.push("package.json missing or empty.");
if (!workflowText) problems.push(".github/workflows/docs.yml missing or empty.");

let pkg = null;

if (pkgText) {
  pkg = JSON.parse(pkgText);

  if (pkg.packageManager !== targetPackageManager) {
    pkg.packageManager = targetPackageManager;
    writeText(packagePath, JSON.stringify(pkg, null, 2));
    changes.push(`package.json packageManager -> ${targetPackageManager}`);
  }
}

let workflow = workflowText;

if (workflow) {
  workflow = workflow.replace(/version:\s*[0-9]+\.[0-9]+\.[0-9]+/g, `version: ${targetVersion}`);

  if (!workflow.includes(`version: ${targetVersion}`)) {
    problems.push(`docs workflow missing pnpm/action-setup version: ${targetVersion}`);
  }

  if (workflow !== workflowText) {
    writeText(workflowPath, workflow);
    changes.push(`.github/workflows/docs.yml pnpm version -> ${targetVersion}`);
  }
}

const finalPackage = JSON.parse(readText(packagePath));
const finalWorkflow = readText(workflowPath);

if (finalPackage.packageManager !== targetPackageManager) {
  problems.push(`package.json packageManager is ${String(finalPackage.packageManager)}, expected ${targetPackageManager}`);
}

if (!finalWorkflow.includes(`version: ${targetVersion}`)) {
  problems.push(`workflow does not include version: ${targetVersion}`);
}

if (finalWorkflow.includes("pnpm@9.15.0")) {
  problems.push("workflow still contains pnpm@9.15.0");
}

const report = [
  "# PNPM Version Alignment Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Target pnpm version: ${targetVersion}`,
  `Problems found: ${problems.length}`,
  `Changes: ${changes.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("pnpm-version-alignment-report.md", `${report}\n`, "utf8");

console.log(`PNPM version alignment completed. Problems: ${problems.length}. Report: pnpm-version-alignment-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("PNPM version alignment failed.");
}