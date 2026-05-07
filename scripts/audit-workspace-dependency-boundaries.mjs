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

function collectDeps(json) {
  const fields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
  const deps = [];

  for (const field of fields) {
    const entries = Object.entries(json[field] ?? {});

    for (const [name, version] of entries) {
      deps.push({
        field,
        name,
        version: String(version)
      });
    }
  }

  return deps.sort((a, b) => `${a.field}:${a.name}`.localeCompare(`${b.field}:${b.name}`));
}

const packageJsonFiles = listPackageJsonFiles();
const packageRows = packageJsonFiles.map((path) => {
  const json = readJson(path);

  return {
    path,
    name: json.name ?? path,
    private: Boolean(json.private),
    version: json.version ?? "-",
    deps: collectDeps(json)
  };
});

const workspacePackageNames = new Set(
  packageRows
    .filter((row) => row.path.startsWith("packages/"))
    .map((row) => row.name)
);

const rows = [];
const problems = [];
const warnings = [];

for (const pkg of packageRows) {
  for (const dep of pkg.deps) {
    const isWorkspacePackage = workspacePackageNames.has(dep.name);
    const usesWorkspaceProtocol = dep.version.startsWith("workspace:");
    const isNoctraPackage = dep.name.startsWith("@noctra/");

    rows.push({
      packageName: pkg.name,
      packagePath: pkg.path,
      field: dep.field,
      dependency: dep.name,
      version: dep.version,
      isWorkspacePackage,
      usesWorkspaceProtocol
    });

    if (isWorkspacePackage && !usesWorkspaceProtocol) {
      problems.push(`${pkg.name}: ${dep.field}.${dep.name} should use workspace:* instead of ${dep.version}`);
    }

    if (isNoctraPackage && !isWorkspacePackage) {
      warnings.push(`${pkg.name}: ${dep.field}.${dep.name} looks like a Noctra package but is not present in this workspace`);
    }

    if (dep.field === "dependencies" && dep.name === "typescript") {
      warnings.push(`${pkg.name}: typescript is in dependencies; devDependencies is usually safer`);
    }

    if (dep.field === "dependencies" && dep.name.startsWith("@types/")) {
      warnings.push(`${pkg.name}: ${dep.name} is in dependencies; devDependencies is usually safer`);
    }
  }
}

const duplicateDependencyVersions = [];

const versionMap = new Map();

for (const row of rows) {
  if (row.dependency.startsWith("@noctra/")) continue;

  const key = row.dependency;
  const versions = versionMap.get(key) ?? new Set();
  versions.add(row.version);
  versionMap.set(key, versions);
}

for (const [dependency, versions] of versionMap.entries()) {
  if (versions.size > 1) {
    duplicateDependencyVersions.push(`${dependency}: ${Array.from(versions).sort((a, b) => a.localeCompare(b)).join(", ")}`);
  }
}

const report = [
  "# Noctra Workspace Dependency Boundary Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageRows.length}`,
  `Dependency edges scanned: ${rows.length}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  `Duplicate external version groups: ${duplicateDependencyVersions.length}`,
  "",
  "## Dependency Matrix",
  "",
  "| Package | package.json | Field | Dependency | Version | Workspace package | Workspace protocol |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((row) => {
    return `| ${row.packageName} | ${row.packagePath} | ${row.field} | ${row.dependency} | ${row.version} | ${row.isWorkspacePackage ? "YES" : "NO"} | ${row.usesWorkspaceProtocol ? "YES" : "NO"} |`;
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
  "## Duplicate External Dependency Versions",
  "",
  ...(duplicateDependencyVersions.length > 0 ? duplicateDependencyVersions.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- This audit does not automatically fail on warnings.",
  "- Build, typecheck, verify-exports, and final-quality-gate remain the source of truth.",
  "- Workspace package dependencies should use workspace:* to avoid accidentally resolving a published package."
].join("\n");

writeFileSync("workspace-dependency-boundary-audit-report.md", `${report}\n`, "utf8");

console.log(`Workspace dependency boundary audit completed. Packages: ${packageRows.length}. Edges: ${rows.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: workspace-dependency-boundary-audit-report.md`);