import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeJson(path, json) {
  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`, "utf8");
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

const packageJsonFiles = listPackageJsonFiles();

const packageMeta = packageJsonFiles.map((path) => {
  const json = readJson(path);

  return {
    path,
    json,
    name: json.name ?? path
  };
});

const workspacePackageNames = new Set(
  packageMeta
    .filter((pkg) => pkg.path.startsWith("packages/"))
    .map((pkg) => pkg.name)
);

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];

const changes = [];

for (const pkg of packageMeta) {
  let changed = false;

  for (const field of dependencyFields) {
    const deps = pkg.json[field];

    if (!deps || typeof deps !== "object") continue;

    for (const [dependencyName, version] of Object.entries(deps)) {
      if (!workspacePackageNames.has(dependencyName)) continue;
      if (dependencyName === pkg.name) continue;
      if (String(version).startsWith("workspace:")) continue;

      deps[dependencyName] = "workspace:*";
      changed = true;
      changes.push(`${pkg.name}: ${field}.${dependencyName} changed from ${version} to workspace:*`);
    }
  }

  if (changed) {
    writeJson(pkg.path, pkg.json);
  }
}

const report = [
  "# Noctra Workspace Dependency Boundary Auto-Heal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageJsonFiles.length}`,
  `Workspace packages detected: ${workspacePackageNames.size}`,
  `Changes applied: ${changes.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- Only internal workspace dependency versions are changed.",
  "- External dependency versions are not touched.",
  "- Self-dependencies are ignored."
].join("\n");

writeFileSync("workspace-dependency-boundary-auto-heal-report.md", `${report}\n`, "utf8");

console.log(`Workspace dependency boundary auto-heal completed. Packages: ${packageJsonFiles.length}. Changes: ${changes.length}. Report: workspace-dependency-boundary-auto-heal-report.md`);