import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

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

  return output;
}

function collectExportTargets(value, output = []) {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectExportTargets(item, output);
    }

    return output;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectExportTargets(item, output);
    }
  }

  return output;
}

function normalizeTargetPath(packageDir, target) {
  if (typeof target !== "string") return null;
  if (!target.startsWith("./")) return null;
  if (target.includes("*")) return null;

  return normalize(join(packageDir, target)).replace(/\\/g, "/");
}

function checkTarget(packageDir, target) {
  const resolved = normalizeTargetPath(packageDir, target);

  if (!resolved) {
    return {
      target,
      resolved: "-",
      exists: true,
      skipped: true
    };
  }

  return {
    target,
    resolved,
    exists: existsSync(resolved),
    skipped: false
  };
}

const packageJsonFiles = listPackageJsonFiles();
const rows = [];
const problems = [];

for (const packageJsonPath of packageJsonFiles) {
  const packageDir = dirname(packageJsonPath).replace(/\\/g, "/");
  const json = readJson(packageJsonPath);
  const packageName = json.name ?? packageDir;
  const targets = [];

  for (const field of ["main", "module", "types", "style"]) {
    if (typeof json[field] === "string") {
      targets.push({
        field,
        exportKey: "-",
        target: json[field]
      });
    }
  }

  if (json.exports && typeof json.exports === "object") {
    for (const [exportKey, exportValue] of Object.entries(json.exports)) {
      for (const target of collectExportTargets(exportValue)) {
        targets.push({
          field: "exports",
          exportKey,
          target
        });
      }
    }
  }

  for (const item of targets) {
    const checked = checkTarget(packageDir, item.target);

    rows.push({
      packageName,
      packageJsonPath,
      packageDir,
      field: item.field,
      exportKey: item.exportKey,
      target: item.target,
      resolved: checked.resolved,
      exists: checked.exists,
      skipped: checked.skipped
    });

    if (!checked.exists && !checked.skipped) {
      problems.push(`${packageName}: ${item.field} ${item.exportKey} points to missing file ${checked.resolved}`);
    }
  }
}

const report = [
  "# Noctra Package Entry Point Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageJsonFiles.length}`,
  `Entry targets checked: ${rows.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Entry Point Matrix",
  "",
  "| Package | package.json | Field | Export key | Target | Resolved | Status |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((row) => {
    return `| ${row.packageName} | ${row.packageJsonPath} | ${row.field} | ${row.exportKey} | ${row.target} | ${row.resolved} | ${row.exists ? "OK" : "MISSING"} |`;
  }),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- This audit is strongest after build because many package exports point to dist files.",
  "- Wildcard exports are skipped because they represent patterns, not concrete files.",
  "- Build, typecheck, and verify-exports remain the source of truth."
].join("\n");

writeFileSync("package-entry-point-audit-report.md", `${report}\n`, "utf8");

console.log(`Package entry point audit completed. Packages: ${packageJsonFiles.length}. Targets: ${rows.length}. Problems: ${problems.length}. Report: package-entry-point-audit-report.md`);