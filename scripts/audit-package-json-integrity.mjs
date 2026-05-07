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

const requiredWorkspaceGlobs = ["packages/*", "apps/*"];
const problems = [];
const warnings = [];
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

function readPnpmWorkspacePackages() {
  if (!existsSync("pnpm-workspace.yaml")) {
    return [];
  }

  const text = readFileSync("pnpm-workspace.yaml", "utf8").replace(/^\uFEFF/, "");
  const packages = [];

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s*['"]?([^'"]+)['"]?\s*$/);

    if (match) {
      packages.push(match[1].trim());
    }
  }

  return packages;
}

const rootPackage = readJson("package.json");
const pnpmWorkspacePackages = readPnpmWorkspacePackages();

if (rootPackage) {
  if (!rootPackage.private) {
    problems.push("package.json: root package should be private for workspace safety");
  }

  const rootWorkspaces = Array.isArray(rootPackage.workspaces) ? rootPackage.workspaces : [];
  const workspaceSource = rootWorkspaces.length > 0 ? rootWorkspaces : pnpmWorkspacePackages;

  if (workspaceSource.length === 0) {
    problems.push("workspace config missing: expected package.json workspaces or pnpm-workspace.yaml packages");
  }

  for (const workspace of requiredWorkspaceGlobs) {
    if (!workspaceSource.includes(workspace)) {
      problems.push(`workspace config missing ${workspace}`);
    }
  }

  if (!rootPackage.packageManager) {
    problems.push("package.json: missing packageManager");
  }

  if (rootWorkspaces.length === 0 && pnpmWorkspacePackages.length > 0) {
    warnings.push("package.json has no workspaces array; accepted pnpm-workspace.yaml as the workspace source.");
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
  `Warnings found: ${warnings.length}`,
  "",
  "## Workspace source",
  "",
  `- package.json workspaces: ${Array.isArray(rootPackage?.workspaces) ? rootPackage.workspaces.join(", ") : "none"}`,
  `- pnpm-workspace.yaml packages: ${pnpmWorkspacePackages.length ? pnpmWorkspacePackages.join(", ") : "none"}`,
  "",
  "## Checked files",
  "",
  ...(checked.length ? checked.map((path) => `- ${path}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Package JSON integrity audit completed. Files: ${checked.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Package JSON integrity audit failed.");
}
