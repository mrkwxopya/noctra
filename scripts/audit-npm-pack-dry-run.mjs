import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

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

function packageDirFromPackageJson(packageJsonPath) {
  return packageJsonPath.replace(/\/package\.json$/, "");
}

function runNpmPackDryRun(packageDir) {
  return spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: packageDir,
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 1024 * 1024 * 16
  });
}

function parsePackJson(stdout) {
  const trimmed = stdout.trim();

  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    const firstBracket = trimmed.indexOf("[");
    const lastBracket = trimmed.lastIndexOf("]");

    if (firstBracket >= 0 && lastBracket > firstBracket) {
      const sliced = trimmed.slice(firstBracket, lastBracket + 1);
      const parsed = JSON.parse(sliced);
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    return [];
  }
}

const packageJsonFiles = listPackageJsonFiles();
const rows = [];
const problems = [];
const warnings = [];

for (const packageJsonPath of packageJsonFiles) {
  const packageDir = packageDirFromPackageJson(packageJsonPath);
  const json = readJson(packageJsonPath);
  const packageName = json.name ?? packageDir;
  const publishable = !json.private;

  if (!publishable) {
    rows.push({
      packageName,
      packageDir,
      publishable,
      ok: true,
      filename: "-",
      fileCount: 0,
      unpackedSize: 0,
      packageSize: 0,
      entryFiles: [],
      error: "skipped private package"
    });

    continue;
  }

  const result = runNpmPackDryRun(packageDir);
  const packs = parsePackJson(result.stdout);
  const pack = packs[0] ?? null;
  const files = Array.isArray(pack?.files) ? pack.files : [];
  const entryFiles = files
    .map((file) => file.path)
    .filter((filePath) => {
      return filePath === "package.json" ||
        filePath === "README.md" ||
        filePath === "LICENSE" ||
        filePath.startsWith("dist/") ||
        filePath.startsWith("src/");
    });

  const row = {
    packageName,
    packageDir,
    publishable,
    ok: result.status === 0 && Boolean(pack),
    filename: pack?.filename ?? "-",
    fileCount: files.length,
    unpackedSize: pack?.unpackedSize ?? 0,
    packageSize: pack?.size ?? 0,
    entryFiles,
    error: result.status === 0 ? "" : `${result.stderr || result.stdout}`.trim()
  };

  rows.push(row);

  if (!row.ok) {
    problems.push(`${packageName}: npm pack --dry-run failed ${row.error}`);
    continue;
  }

  if (row.fileCount === 0) {
    problems.push(`${packageName}: npm pack produced zero files`);
  }

  if (!entryFiles.some((file) => file === "package.json")) {
    problems.push(`${packageName}: package.json missing from pack output`);
  }

  if (!entryFiles.some((file) => file.startsWith("dist/")) && packageName !== "@noctra/styles") {
    warnings.push(`${packageName}: no dist files detected in pack output`);
  }

  if (row.unpackedSize > 5 * 1024 * 1024) {
    warnings.push(`${packageName}: unpacked size is larger than 5MB (${row.unpackedSize} bytes)`);
  }

  if (row.packageSize > 2 * 1024 * 1024) {
    warnings.push(`${packageName}: packed tarball is larger than 2MB (${row.packageSize} bytes)`);
  }
}

const report = [
  "# Noctra NPM Pack Dry Run Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Packages scanned: ${packageJsonFiles.length}`,
  `Publishable packages packed: ${rows.filter((row) => row.publishable).length}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Pack Matrix",
  "",
  "| Package | Directory | Publishable | Status | Filename | Files | Package size | Unpacked size |",
  "|---|---|---|---|---|---:|---:|---:|",
  ...rows.map((row) => {
    return `| ${row.packageName} | ${row.packageDir} | ${row.publishable ? "YES" : "NO"} | ${row.ok ? "OK" : "FAILED"} | ${row.filename} | ${row.fileCount} | ${row.packageSize} | ${row.unpackedSize} |`;
  }),
  "",
  "## Entry Files",
  "",
  ...rows.flatMap((row) => [
    `### ${row.packageName}`,
    "",
    ...(row.entryFiles.length > 0 ? row.entryFiles.map((file) => `- ${file}`) : ["- None"]),
    ""
  ]),
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
  "- This step does not publish anything.",
  "- It only runs npm pack --dry-run --json for publishable workspace packages.",
  "- Build, typecheck, verify-exports, dist audit, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("npm-pack-dry-run-audit-report.md", `${report}\n`, "utf8");

console.log(`NPM pack dry run audit completed. Packages: ${packageJsonFiles.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: npm-pack-dry-run-audit-report.md`);