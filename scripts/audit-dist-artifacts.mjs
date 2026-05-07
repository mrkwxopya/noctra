import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function listPackageJsonFiles() {
  const output = [];

  if (!existsSync("packages")) return output;

  for (const entry of readdirSync("packages")) {
    const packageDir = join("packages", entry);
    if (!statSync(packageDir).isDirectory()) continue;

    const packageJsonPath = join(packageDir, "package.json");
    if (existsSync(packageJsonPath)) {
      output.push(packageJsonPath.replace(/\\/g, "/"));
    }
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function walkFiles(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walkFiles(fullPath));
      continue;
    }

    output.push(fullPath.replace(/\\/g, "/"));
  }

  return output.sort((a, b) => a.localeCompare(b));
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

function hasAnyDistFile(distFiles, extension) {
  return distFiles.some((file) => file.endsWith(extension));
}

const packageJsonFiles = listPackageJsonFiles();
const packageRows = [];
const exportRows = [];
const problems = [];
const warnings = [];

for (const packageJsonPath of packageJsonFiles) {
  const packageDir = dirname(packageJsonPath).replace(/\\/g, "/");
  const json = readJson(packageJsonPath);
  const packageName = json.name ?? packageDir;
  const distDir = `${packageDir}/dist`;
  const distFiles = walkFiles(distDir);
  const hasDist = existsSync(distDir);
  const hasDeclaration = hasAnyDistFile(distFiles, ".d.ts");
  const hasJs = hasAnyDistFile(distFiles, ".js");
  const hasCss = distFiles.some((file) => file.endsWith(".css"));
  const publishable = !json.private;

  packageRows.push({
    packageName,
    packageDir,
    hasDist,
    distFileCount: distFiles.length,
    hasDeclaration,
    hasJs,
    hasCss,
    publishable
  });

  if (publishable && !hasDist) {
    warnings.push(`${packageName}: publishable package has no dist directory`);
  }

  if (publishable && !hasDeclaration && packageName !== "@noctra/styles") {
    warnings.push(`${packageName}: publishable TypeScript package has no .d.ts artifact`);
  }

  if (publishable && !hasJs && packageName !== "@noctra/styles") {
    warnings.push(`${packageName}: publishable TypeScript package has no .js artifact`);
  }

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

    exportRows.push({
      packageName,
      packageJsonPath,
      field: item.field,
      exportKey: item.exportKey,
      target: item.target,
      resolved: checked.resolved,
      exists: checked.exists,
      skipped: checked.skipped
    });

    if (!checked.exists && !checked.skipped) {
      problems.push(`${packageName}: ${item.field} ${item.exportKey} points to missing artifact ${checked.resolved}`);
    }
  }
}

const report = [
  "# Noctra Dist Artifact Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Packages scanned: ${packageRows.length}`,
  `Export targets checked: ${exportRows.length}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Package Dist Matrix",
  "",
  "| Package | Directory | Publishable | Dist | Files | .d.ts | .js | .css |",
  "|---|---|---|---|---:|---|---|---|",
  ...packageRows.map((row) => {
    return `| ${row.packageName} | ${row.packageDir} | ${row.publishable ? "YES" : "NO"} | ${row.hasDist ? "OK" : "MISSING"} | ${row.distFileCount} | ${row.hasDeclaration ? "OK" : "MISSING"} | ${row.hasJs ? "OK" : "MISSING"} | ${row.hasCss ? "OK" : "MISSING"} |`;
  }),
  "",
  "## Export Target Matrix",
  "",
  "| Package | Field | Export key | Target | Resolved | Status |",
  "|---|---|---|---|---|---|",
  ...exportRows.map((row) => {
    return `| ${row.packageName} | ${row.field} | ${row.exportKey} | ${row.target} | ${row.resolved} | ${row.exists ? "OK" : "MISSING"} |`;
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
  "- Problems mean a declared concrete package entry points to a missing file.",
  "- Warnings are release-readiness hints.",
  "- This audit should run after build."
].join("\n");

writeFileSync("dist-artifact-audit-report.md", `${report}\n`, "utf8");

console.log(`Dist artifact audit completed. Packages: ${packageRows.length}. Export targets: ${exportRows.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: dist-artifact-audit-report.md`);