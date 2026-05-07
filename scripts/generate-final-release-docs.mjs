import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
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
        version: json.version ?? "-",
        private: Boolean(json.private),
        path: dir.replace(/\\/g, "/"),
        packageJsonPath,
        exports: Object.keys(json.exports ?? {}).sort((a, b) => a.localeCompare(b)),
        files: Array.isArray(json.files) ? json.files : [],
        publishConfig: json.publishConfig ?? null
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

  return {
    path,
    title: text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path,
    generated: text.match(/Generated:\s*([^\n]+)/i)?.[1]?.trim() ?? "-",
    problems: Number(text.match(/Problems found:\s*(\d+)/i)?.[1] ?? 0),
    warnings: Number(text.match(/Warnings found:\s*(\d+)/i)?.[1] ?? 0),
    changes: Number(text.match(/Changes applied:\s*(\d+)/i)?.[1] ?? 0)
  };
}

const rootPackage = existsSync("package.json") ? readJson("package.json") : {};
const packages = listWorkspacePackages();
const publishablePackages = packages.filter((pkg) => !pkg.private && pkg.path.startsWith("packages/"));
const components = listComponentDirs().map((name) => ({
  name,
  kebab: toKebabCase(name)
}));

const reportFiles = walkFiles(".")
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const name = file.toLowerCase();

    return name.endsWith("-report.md") ||
      name.endsWith("audit-report.md") ||
      name.endsWith("quality-gate-report.md") ||
      name === "noctra-quality-reports-index.md" ||
      name === "noctra-release-candidate-manifest.md";
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

const distRoots = [
  "packages/react/dist",
  "packages/styles/dist",
  "packages/tokens/dist",
  "packages/utils/dist",
  "apps/docs/dist"
];

const distSummary = distRoots.map((root) => ({
  root,
  exists: existsSync(root),
  fileCount: walkFiles(root).length
}));

const releaseNotes = [
  "# Noctra Release Notes",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Release Candidate Summary",
  "",
  `- Root package: ${rootPackage.name ?? "-"}`,
  `- Root version: ${rootPackage.version ?? "-"}`,
  `- Workspace packages: ${packages.length}`,
  `- Publishable packages: ${publishablePackages.length}`,
  `- React components: ${components.length}`,
  `- Quality reports indexed: ${reports.length}`,
  `- Critical reported problems: ${totalProblems}`,
  `- Reported warnings: ${totalWarnings}`,
  `- Auto-heal changes summarized: ${totalChanges}`,
  "",
  "## Publishable Packages",
  "",
  ...publishablePackages.map((pkg) => `- ${pkg.name}@${pkg.version}`),
  "",
  "## Component Inventory",
  "",
  ...components.map((component) => `- ${component.name} (${component.kebab})`),
  "",
  "## Dist Artifact Summary",
  "",
  "| Root | Exists | Files |",
  "|---|---|---:|",
  ...distSummary.map((item) => `| ${item.root} | ${item.exists ? "OK" : "MISSING"} | ${item.fileCount} |`),
  "",
  "## Verification Gates",
  "",
  "- JSON verification",
  "- Component export auto-heal",
  "- Component prop conflict auto-heal",
  "- Workspace dependency boundary auto-heal",
  "- Release metadata auto-heal",
  "- React component smoke export generation",
  "- Token component smoke export generation",
  "- Style component smoke export generation",
  "- Component inventory audit",
  "- Docs component usage audit",
  "- Component prop conflict audit",
  "- Workspace dependency boundary audit",
  "- Release metadata audit",
  "- Package entry point audit",
  "- Dist artifact audit",
  "- npm pack dry-run audit",
  "- Final quality gate",
  "",
  "## Notes",
  "",
  "- This file is generated and should be refreshed before publishing.",
  "- It does not publish, tag, commit, or push.",
  "- Any report with problems should be inspected before release."
].join("\n");

writeFileSync("RELEASE_NOTES.md", `${releaseNotes}\n`, "utf8");

const checklist = [
  "# Noctra Publish Checklist",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Required Before Publishing",
  "",
  "- [ ] Confirm `pnpm install` completed successfully.",
  "- [ ] Confirm `pnpm --filter @noctra/utils build` passed.",
  "- [ ] Confirm `pnpm --filter @noctra/tokens build` passed.",
  "- [ ] Confirm `pnpm --filter @noctra/react build` passed.",
  "- [ ] Confirm `pnpm --filter @noctra/styles build` passed.",
  "- [ ] Confirm `pnpm --filter @noctra/docs typecheck` passed.",
  "- [ ] Confirm `pnpm --filter @noctra/docs build` passed.",
  "- [ ] Confirm `pnpm typecheck` passed.",
  "- [ ] Confirm `pnpm build` passed.",
  "- [ ] Confirm `node scripts/verify-exports.mjs` passed.",
  "- [ ] Confirm `node scripts/final-quality-gate.mjs` passed.",
  "- [ ] Inspect `component-inventory-audit-report.md`.",
  "- [ ] Inspect `docs-component-usage-audit-report.md`.",
  "- [ ] Inspect `component-prop-conflict-audit-report.md`.",
  "- [ ] Inspect `workspace-dependency-boundary-audit-report.md`.",
  "- [ ] Inspect `release-metadata-audit-report.md`.",
  "- [ ] Inspect `package-entry-point-audit-report.md`.",
  "- [ ] Inspect `dist-artifact-audit-report.md`.",
  "- [ ] Inspect `npm-pack-dry-run-audit-report.md`.",
  "- [ ] Inspect `noctra-release-candidate-manifest.md`.",
  "- [ ] Inspect `RELEASE_NOTES.md`.",
  "",
  "## Publishable Package Order",
  "",
  ...publishablePackages.map((pkg, index) => `${index + 1}. ${pkg.name}@${pkg.version}`),
  "",
  "## Safe Publish Commands",
  "",
  "```powershell",
  "# Only run after the checklist is complete.",
  ...publishablePackages.map((pkg) => `pnpm --filter ${pkg.name} publish --access public --no-git-checks`),
  "```",
  "",
  "## Safety Notes",
  "",
  "- Do not publish if any build or typecheck command fails.",
  "- Do not publish if npm pack dry-run reports missing package files.",
  "- Do not publish if package entry point audit reports missing concrete files.",
  "- Do not publish if the final quality gate reports unresolved blockers."
].join("\n");

writeFileSync("PUBLISH_CHECKLIST.md", `${checklist}\n`, "utf8");

const report = [
  "# Noctra Final Release Notes And Publish Checklist Gate Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Release notes generated: ${existsSync("RELEASE_NOTES.md") ? "YES" : "NO"}`,
  `Publish checklist generated: ${existsSync("PUBLISH_CHECKLIST.md") ? "YES" : "NO"}`,
  `Publishable packages: ${publishablePackages.length}`,
  `Components: ${components.length}`,
  `Reports indexed: ${reports.length}`,
  `Critical reported problems summarized: ${totalProblems}`,
  `Reported warnings summarized: ${totalWarnings}`,
  "",
  "## Generated Files",
  "",
  "- RELEASE_NOTES.md",
  "- PUBLISH_CHECKLIST.md",
  "",
  "## Publishable Packages",
  "",
  ...publishablePackages.map((pkg) => `- ${pkg.name}@${pkg.version}`),
  "",
  "## Note",
  "",
  "- This gate prepares release-facing documents only.",
  "- It does not publish, tag, commit, or push."
].join("\n");

writeFileSync("final-release-notes-publish-checklist-report.md", `${report}\n`, "utf8");

console.log(`Final release notes and publish checklist generated. Publishable packages: ${publishablePackages.length}. Components: ${components.length}. Report: final-release-notes-publish-checklist-report.md`);
