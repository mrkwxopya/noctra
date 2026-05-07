import { existsSync, readFileSync, writeFileSync } from "node:fs";

const reportPath = "package-json-integrity-report.md";

const expectedPackageFiles = [
  "package.json",
  "packages/utils/package.json",
  "packages/tokens/package.json",
  "packages/styles/package.json",
  "packages/react/package.json",
  "apps/docs/package.json"
];

const expectedPackageNames = new Map([
  ["packages/utils/package.json", "@noctra/utils"],
  ["packages/tokens/package.json", "@noctra/tokens"],
  ["packages/styles/package.json", "@noctra/styles"],
  ["packages/react/package.json", "@noctra/react"],
  ["apps/docs/package.json", "@noctra/docs"]
]);

const problems = [];
const checked = [];

function readJson(path) {
  if (!existsSync(path)) {
    problems.push(`${path}: missing package.json`);
    return null;
  }

  checked.push(path);

  try {
    return JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    problems.push(`${path}: invalid JSON - ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

const rootPackage = readJson("package.json");

if (rootPackage) {
  if (!rootPackage.private) {
    problems.push("package.json: root package should be private for workspace safety");
  }

  const workspaces = rootPackage.workspaces;

  if (!Array.isArray(workspaces)) {
    problems.push("package.json: missing workspaces array");
  } else {
    for (const workspace of ["packages/*", "apps/*"]) {
      if (!workspaces.includes(workspace)) {
        problems.push(`package.json: workspaces missing ${workspace}`);
      }
    }
  }

  if (!rootPackage.packageManager) {
    problems.push("package.json: missing packageManager");
  }
}

for (const path of expectedPackageFiles.slice(1)) {
  const packageJson = readJson(path);

  if (!packageJson) continue;

  const expectedName = expectedPackageNames.get(path);

  if (expectedName && packageJson.name !== expectedName) {
    problems.push(`${path}: expected name ${expectedName}, found ${packageJson.name || "missing"}`);
  }

  if (!packageJson.scripts || typeof packageJson.scripts !== "object") {
    problems.push(`${path}: missing scripts object`);
  }
}

const report = [
  "# Package JSON Integrity Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Files checked: ${checked.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Checked files",
  "",
  ...(checked.length ? checked.map((path) => `- ${path}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Package JSON integrity audit completed. Files: ${checked.length}. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Package JSON integrity audit failed.");
}
