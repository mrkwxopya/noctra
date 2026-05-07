import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function hashFile(path) {
  if (!existsSync(path)) return null;
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function walkFiles(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    if (["node_modules", ".git", ".vite"].includes(entry)) continue;

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

function listWorkspacePackages() {
  const roots = ["packages", "apps"];
  const output = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    for (const entry of readdirSync(root)) {
      const dir = join(root, entry);
      if (!statSync(dir).isDirectory()) continue;

      const packageJsonPath = join(dir, "package.json").replace(/\\/g, "/");
      if (!existsSync(packageJsonPath)) continue;

      const json = readJson(packageJsonPath);

      output.push({
        name: json.name ?? entry,
        version: json.version ?? null,
        private: Boolean(json.private),
        path: dir.replace(/\\/g, "/"),
        packageJsonPath,
        exports: Object.keys(json.exports ?? {}).sort((a, b) => a.localeCompare(b)),
        scripts: Object.keys(json.scripts ?? {}).sort((a, b) => a.localeCompare(b)),
        dependencies: Object.keys(json.dependencies ?? {}).sort((a, b) => a.localeCompare(b)),
        peerDependencies: Object.keys(json.peerDependencies ?? {}).sort((a, b) => a.localeCompare(b)),
        devDependencies: Object.keys(json.devDependencies ?? {}).sort((a, b) => a.localeCompare(b))
      });
    }
  }

  return output.sort((a, b) => a.name.localeCompare(b.name));
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function listComponentDirs() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory();
    })
    .filter((entry) => !entry.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

function summarizeReport(path) {
  const text = readText(path);
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path;
  const generated = text.match(/Generated:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
  const problems = Number(text.match(/Problems found:\s*(\d+)/i)?.[1] ?? 0);
  const warnings = Number(text.match(/Warnings found:\s*(\d+)/i)?.[1] ?? 0);
  const changes = Number(text.match(/Changes applied:\s*(\d+)/i)?.[1] ?? 0);

  return {
    path,
    title,
    generated,
    problems,
    warnings,
    changes,
    sha256: hashFile(path)
  };
}

const rootPackage = existsSync("package.json") ? readJson("package.json") : {};
const packages = listWorkspacePackages();
const components = listComponentDirs().map((name) => ({
  name,
  kebab: toKebabCase(name),
  reactPath: `packages/react/src/components/${name}`,
  stylePath: `packages/styles/src/components/${toKebabCase(name)}.css`,
  tokenPath: `packages/tokens/src/components/${toKebabCase(name)}.ts`
}));

const distRoots = [
  "packages/react/dist",
  "packages/styles/dist",
  "packages/tokens/dist",
  "packages/utils/dist",
  "apps/docs/dist"
];

const distArtifacts = distRoots.map((root) => {
  const files = walkFiles(root);

  return {
    root,
    exists: existsSync(root),
    fileCount: files.length,
    totalBytes: files.reduce((total, file) => total + statSync(file).size, 0),
    samples: files.slice(0, 24)
  };
});

const reportFiles = walkFiles(".")
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const name = file.toLowerCase();
    return name.endsWith("-report.md") ||
      name.endsWith("audit-report.md") ||
      name.endsWith("quality-gate-report.md") ||
      name === "noctra-quality-reports-index.md";
  })
  .sort((a, b) => a.localeCompare(b));

const reports = reportFiles.map(summarizeReport);
const criticalReportFiles = new Set([
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md"
]);

const totalProblems = reports
  .filter((report) => criticalReportFiles.has(report.path.split("/").pop()))
  .reduce((total, report) => total + report.problems, 0);
const totalWarnings = reports.reduce((total, report) => total + report.warnings, 0);
const totalChanges = reports.reduce((total, report) => total + report.changes, 0);

const importantFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "README.md",
  "CHANGELOG.md",
  "final-quality-gate-report.md",
  "component-inventory-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md",
  "release-metadata-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "noctra-quality-reports-index.md"
].filter((file) => existsSync(file));

const manifest = {
  generatedAt: new Date().toISOString(),
  root: {
    name: rootPackage.name ?? null,
    version: rootPackage.version ?? null,
    private: Boolean(rootPackage.private),
    packageManager: rootPackage.packageManager ?? null
  },
  summary: {
    packageCount: packages.length,
    publishablePackageCount: packages.filter((pkg) => !pkg.private && pkg.path.startsWith("packages/")).length,
    componentCount: components.length,
    reportCount: reports.length,
    totalReportedProblems: totalProblems,
    totalReportedWarnings: totalWarnings,
    totalAutoHealChanges: totalChanges,
    distRootCount: distArtifacts.length,
    missingDistRootCount: distArtifacts.filter((item) => !item.exists).length
  },
  packages,
  components,
  distArtifacts,
  reports,
  importantFileHashes: importantFiles.map((file) => ({
    file,
    sha256: hashFile(file)
  }))
};

writeFileSync("noctra-release-candidate-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const markdown = [
  "# Noctra Release Candidate Manifest",
  "",
  `Generated: ${manifest.generatedAt}`,
  "",
  "## Summary",
  "",
  `- Root package: ${manifest.root.name ?? "-"}`,
  `- Root version: ${manifest.root.version ?? "-"}`,
  `- Workspace packages: ${manifest.summary.packageCount}`,
  `- Publishable packages: ${manifest.summary.publishablePackageCount}`,
  `- Components: ${manifest.summary.componentCount}`,
  `- Reports indexed: ${manifest.summary.reportCount}`,
  `- Critical reported problems: ${manifest.summary.totalReportedProblems}`,
  `- Reported warnings: ${manifest.summary.totalReportedWarnings}`,
  `- Auto-heal changes summarized: ${manifest.summary.totalAutoHealChanges}`,
  `- Missing dist roots: ${manifest.summary.missingDistRootCount}`,
  "",
  "## Packages",
  "",
  "| Package | Version | Private | Path | Exports |",
  "|---|---|---|---|---:|",
  ...packages.map((pkg) => `| ${pkg.name} | ${pkg.version ?? "-"} | ${pkg.private ? "YES" : "NO"} | ${pkg.path} | ${pkg.exports.length} |`),
  "",
  "## Components",
  "",
  "| Component | Kebab | React | Style | Token |",
  "|---|---|---|---|---|",
  ...components.map((component) => `| ${component.name} | ${component.kebab} | ${existsSync(component.reactPath) ? "OK" : "MISSING"} | ${existsSync(component.stylePath) ? "OK" : "MISSING"} | ${existsSync(component.tokenPath) ? "OK" : "MISSING"} |`),
  "",
  "## Dist Artifacts",
  "",
  "| Root | Exists | Files | Total bytes |",
  "|---|---|---:|---:|",
  ...distArtifacts.map((artifact) => `| ${artifact.root} | ${artifact.exists ? "OK" : "MISSING"} | ${artifact.fileCount} | ${artifact.totalBytes} |`),
  "",
  "## Reports",
  "",
  "| Report | Problems | Warnings | Changes | SHA256 |",
  "|---|---:|---:|---:|---|",
  ...reports.map((report) => `| ${report.path} | ${report.problems} | ${report.warnings} | ${report.changes} | ${report.sha256 ?? "-"} |`),
  "",
  "## Important File Hashes",
  "",
  "| File | SHA256 |",
  "|---|---|",
  ...manifest.importantFileHashes.map((item) => `| ${item.file} | ${item.sha256} |`),
  "",
  "## Note",
  "",
  "- This manifest is a release-candidate snapshot.",
  "- It does not publish, tag, commit, or push.",
  "- Build, typecheck, verify-exports, npm pack dry-run, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("noctra-release-candidate-manifest.md", `${markdown}\n`, "utf8");

console.log(`Release candidate manifest generated. Packages: ${packages.length}. Components: ${components.length}. Reports: ${reports.length}. Reported problems: ${totalProblems}. Manifest: noctra-release-candidate-manifest.json`);
