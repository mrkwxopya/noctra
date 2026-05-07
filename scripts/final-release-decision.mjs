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

function summarizeReport(path) {
  const text = readText(path);

  return {
    path,
    title: text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path,
    generated: text.match(/Generated:\s*([^\n]+)/i)?.[1]?.trim() ?? "-",
    problems: Number(text.match(/Problems found:\s*(\d+)/i)?.[1] ?? 0),
    warnings: Number(text.match(/Warnings found:\s*(\d+)/i)?.[1] ?? 0),
    changes: Number(text.match(/Changes applied:\s*(\d+)/i)?.[1] ?? 0),
    status: text.match(/^Status:\s*([^\n]+)$/m)?.[1]?.trim() ?? "-",
    sha256: hashFile(path)
  };
}

function listPackageJsonFiles() {
  const output = [];

  for (const root of ["packages", "apps"]) {
    if (!existsSync(root)) continue;

    for (const entry of readdirSync(root)) {
      const dir = join(root, entry);
      if (!statSync(dir).isDirectory()) continue;

      const packageJsonPath = join(dir, "package.json").replace(/\\/g, "/");
      if (existsSync(packageJsonPath)) output.push(packageJsonPath);
    }
  }

  if (existsSync("package.json")) output.unshift("package.json");

  return output.sort((a, b) => a.localeCompare(b));
}

function listPublishablePackages() {
  return listPackageJsonFiles()
    .filter((path) => path.startsWith("packages/"))
    .map((path) => {
      const json = readJson(path);

      return {
        path,
        dir: path.replace(/\/package\.json$/, ""),
        name: json.name ?? path,
        version: json.version ?? "-",
        private: Boolean(json.private),
        type: json.type ?? "-",
        publishConfigAccess: json.publishConfig?.access ?? "-",
        exportCount: Object.keys(json.exports ?? {}).length,
        fileCount: Array.isArray(json.files) ? json.files.length : 0
      };
    })
    .filter((pkg) => !pkg.private)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function listComponents() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory() && !entry.startsWith(".");
    })
    .sort((a, b) => a.localeCompare(b));
}

const requiredFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "README.md",
  "CHANGELOG.md",
  "RELEASE_NOTES.md",
  "PUBLISH_CHECKLIST.md",
  "final-quality-gate-report.md",
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md",
  "noctra-release-candidate-manifest.json",
  "noctra-release-candidate-manifest.md",
  "FINAL_RELEASE_READINESS_SNAPSHOT.json",
  "FINAL_RELEASE_READINESS_SNAPSHOT.md"
];

const criticalReportFiles = [
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md",
  "final-release-readiness-snapshot-report.md"
];

const optionalReportFiles = [
  "docs-component-usage-audit-report.md",
  "quality-reports-index.md",
  "noctra-quality-reports-index.md",
  "final-quality-gate-report.md",
  "final-release-notes-publish-checklist-report.md",
  "final-release-readiness-snapshot-report.md"
];

const publishablePackages = listPublishablePackages();
const components = listComponents();
const missingRequiredFiles = requiredFiles.filter((file) => !existsSync(file));

const distRoots = [
  "packages/react/dist",
  "packages/styles/dist",
  "packages/tokens/dist",
  "packages/utils/dist",
  "apps/docs/dist"
];

const dist = distRoots.map((root) => {
  const files = walkFiles(root);

  return {
    root,
    exists: existsSync(root),
    files: files.length,
    bytes: files.reduce((total, file) => total + statSync(file).size, 0),
    hasJs: files.some((file) => file.endsWith(".js")),
    hasTypes: files.some((file) => file.endsWith(".d.ts")),
    hasCss: files.some((file) => file.endsWith(".css"))
  };
});

const criticalReports = criticalReportFiles
  .filter((file) => existsSync(file))
  .map(summarizeReport);

const optionalReports = optionalReportFiles
  .filter((file) => existsSync(file))
  .map(summarizeReport);

const allReports = Array.from(
  new Map([...criticalReports, ...optionalReports].map((report) => [report.path, report])).values()
).sort((a, b) => a.path.localeCompare(b.path));

const readinessSnapshot = existsSync("FINAL_RELEASE_READINESS_SNAPSHOT.json")
  ? readJson("FINAL_RELEASE_READINESS_SNAPSHOT.json")
  : null;

const releaseManifest = existsSync("noctra-release-candidate-manifest.json")
  ? readJson("noctra-release-candidate-manifest.json")
  : null;

const blockers = [];

for (const file of missingRequiredFiles) {
  blockers.push(`missing required file: ${file}`);
}

for (const file of criticalReportFiles) {
  if (!existsSync(file)) {
    blockers.push(`missing critical report: ${file}`);
  }
}

for (const report of criticalReports) {
  if (report.problems > 0) {
    blockers.push(`${report.path}: reports ${report.problems} problem(s)`);
  }
}

for (const item of dist) {
  if (!item.exists) blockers.push(`${item.root}: missing dist directory`);
  if (item.exists && item.files === 0) blockers.push(`${item.root}: empty dist directory`);
}

for (const pkg of publishablePackages) {
  if (pkg.type !== "module") blockers.push(`${pkg.name}: package type is not module`);
  if (pkg.publishConfigAccess !== "public") blockers.push(`${pkg.name}: publishConfig.access is not public`);
  if (pkg.exportCount === 0) blockers.push(`${pkg.name}: has no package exports`);
  if (pkg.fileCount === 0) blockers.push(`${pkg.name}: has no files array`);
}

if (readinessSnapshot && readinessSnapshot.readinessStatus && readinessSnapshot.readinessStatus !== "READY_FOR_FINAL_REVIEW") {
  blockers.push(`FINAL_RELEASE_READINESS_SNAPSHOT status is ${readinessSnapshot.readinessStatus}`);
}

if (releaseManifest?.summary?.missingDistRootCount > 0) {
  blockers.push(`release manifest reports ${releaseManifest.summary.missingDistRootCount} missing dist root(s)`);
}

const decision = blockers.length === 0 ? "PASS_FINAL_HARD_GATE" : "BLOCKED_FINAL_HARD_GATE";

const finalDecision = {
  generatedAt: new Date().toISOString(),
  decision,
  blockers,
  summary: {
    publishablePackages: publishablePackages.length,
    components: components.length,
    criticalReports: criticalReports.length,
    optionalReports: optionalReports.length,
    blockerCount: blockers.length,
    criticalReportProblems: criticalReports.reduce((total, report) => total + report.problems, 0),
    criticalReportWarnings: criticalReports.reduce((total, report) => total + report.warnings, 0),
    optionalReportWarnings: optionalReports.reduce((total, report) => total + report.warnings, 0),
    distRoots: dist.length,
    missingDistRoots: dist.filter((item) => !item.exists).length
  },
  publishablePackages,
  components,
  dist,
  criticalReports,
  optionalReports,
  requiredFileHashes: requiredFiles
    .filter((file) => existsSync(file))
    .map((file) => ({
      file,
      sha256: hashFile(file)
    }))
};

writeFileSync("FINAL_RELEASE_DECISION.json", `${JSON.stringify(finalDecision, null, 2)}\n`, "utf8");

const markdown = [
  "# Noctra Final Release Decision",
  "",
  `Generated: ${finalDecision.generatedAt}`,
  "",
  `Decision: ${decision}`,
  "",
  "## Summary",
  "",
  `- Publishable packages: ${finalDecision.summary.publishablePackages}`,
  `- Components: ${finalDecision.summary.components}`,
  `- Critical reports: ${finalDecision.summary.criticalReports}`,
  `- Optional reports: ${finalDecision.summary.optionalReports}`,
  `- Blockers: ${finalDecision.summary.blockerCount}`,
  `- Critical report problems: ${finalDecision.summary.criticalReportProblems}`,
  `- Critical report warnings: ${finalDecision.summary.criticalReportWarnings}`,
  `- Missing dist roots: ${finalDecision.summary.missingDistRoots}`,
  "",
  "## Blockers",
  "",
  ...(blockers.length > 0 ? blockers.map((blocker) => `- ${blocker}`) : ["- None"]),
  "",
  "## Publishable Packages",
  "",
  "| Package | Version | Path | Exports | Files | Access |",
  "|---|---|---|---:|---:|---|",
  ...publishablePackages.map((pkg) => `| ${pkg.name} | ${pkg.version} | ${pkg.dir} | ${pkg.exportCount} | ${pkg.fileCount} | ${pkg.publishConfigAccess} |`),
  "",
  "## Dist Matrix",
  "",
  "| Root | Exists | Files | Bytes | JS | Types | CSS |",
  "|---|---|---:|---:|---|---|---|",
  ...dist.map((item) => `| ${item.root} | ${item.exists ? "OK" : "MISSING"} | ${item.files} | ${item.bytes} | ${item.hasJs ? "OK" : "MISSING"} | ${item.hasTypes ? "OK" : "MISSING"} | ${item.hasCss ? "OK" : "MISSING"} |`),
  "",
  "## Critical Reports",
  "",
  "| Report | Problems | Warnings | Changes | SHA256 |",
  "|---|---:|---:|---:|---|",
  ...criticalReports.map((report) => `| ${report.path} | ${report.problems} | ${report.warnings} | ${report.changes} | ${report.sha256 ?? "-"} |`),
  "",
  "## Required File Hashes",
  "",
  "| File | SHA256 |",
  "|---|---|",
  ...finalDecision.requiredFileHashes.map((item) => `| ${item.file} | ${item.sha256} |`),
  "",
  "## Final Note",
  "",
  "- This step does not publish, tag, commit, or push.",
  "- If the decision is PASS_FINAL_HARD_GATE, use PUBLISH_CHECKLIST.md before publishing.",
  "- If the decision is BLOCKED_FINAL_HARD_GATE, fix blockers first and rerun this step."
].join("\n");

writeFileSync("FINAL_RELEASE_DECISION.md", `${markdown}\n`, "utf8");

console.log(`Final release decision generated. Decision: ${decision}. Blockers: ${blockers.length}. Report: FINAL_RELEASE_DECISION.md`);

if (blockers.length > 0) {
  throw new Error(`Final release hard gate blocked with ${blockers.length} blocker(s). See FINAL_RELEASE_DECISION.md`);
}