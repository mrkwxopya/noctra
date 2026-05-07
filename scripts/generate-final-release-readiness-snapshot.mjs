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
        version: json.version ?? "-",
        private: Boolean(json.private),
        path: dir.replace(/\\/g, "/"),
        packageJsonPath,
        type: json.type ?? "-",
        publishConfigAccess: json.publishConfig?.access ?? "-",
        files: Array.isArray(json.files) ? json.files : [],
        exports: Object.keys(json.exports ?? {}).sort((a, b) => a.localeCompare(b)),
        scripts: Object.keys(json.scripts ?? {}).sort((a, b) => a.localeCompare(b))
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
    changes: Number(text.match(/Changes applied:\s*(\d+)/i)?.[1] ?? 0),
    sha256: hashFile(path)
  };
}

function summarizeDist(root) {
  const files = walkFiles(root);

  return {
    root,
    exists: existsSync(root),
    fileCount: files.length,
    totalBytes: files.reduce((total, file) => total + statSync(file).size, 0),
    hasJs: files.some((file) => file.endsWith(".js")),
    hasTypes: files.some((file) => file.endsWith(".d.ts")),
    hasCss: files.some((file) => file.endsWith(".css")),
    sampleFiles: files.slice(0, 16)
  };
}

const rootPackage = existsSync("package.json") ? readJson("package.json") : {};
const packages = listWorkspacePackages();
const publishablePackages = packages.filter((pkg) => !pkg.private && pkg.path.startsWith("packages/"));

const components = listComponentDirs().map((name) => {
  const kebab = toKebabCase(name);

  return {
    name,
    kebab,
    reactIndex: existsSync(`packages/react/src/components/${name}/index.ts`),
    reactMain: existsSync(`packages/react/src/components/${name}/${name}.tsx`) || existsSync(`packages/react/src/components/${name}/${name}.ts`),
    reactTypes: existsSync(`packages/react/src/components/${name}/${name}.types.ts`),
    reactAnatomy: existsSync(`packages/react/src/components/${name}/${name}.anatomy.ts`),
    styleFile: existsSync(`packages/styles/src/components/${kebab}.css`),
    tokenFile: existsSync(`packages/tokens/src/components/${kebab}.ts`)
  };
});

const reportFiles = walkFiles(".")
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const name = file.toLowerCase();

    return name.endsWith("-report.md") ||
      name.endsWith("audit-report.md") ||
      name.endsWith("quality-gate-report.md") ||
      name === "noctra-quality-reports-index.md" ||
      name === "noctra-release-candidate-manifest.md" ||
      name === "release_notes.md" ||
      name === "publish_checklist.md";
  })
  .sort((a, b) => a.localeCompare(b));

const reports = reportFiles.map(summarizeReport);

const distRoots = [
  "packages/react/dist",
  "packages/styles/dist",
  "packages/tokens/dist",
  "packages/utils/dist",
  "apps/docs/dist"
];

const dist = distRoots.map(summarizeDist);

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
  "noctra-release-candidate-manifest.md"
];

const missingRequiredFiles = requiredFiles.filter((file) => !existsSync(file));

const componentProblems = components.flatMap((component) => {
  const problems = [];

  if (!component.reactIndex) problems.push(`${component.name}: missing react index`);
  if (!component.reactMain) problems.push(`${component.name}: missing react main`);
  if (!component.reactTypes) problems.push(`${component.name}: missing react types`);
  if (!component.reactAnatomy) problems.push(`${component.name}: missing react anatomy`);
  if (!component.styleFile) problems.push(`${component.name}: missing style file`);
  if (!component.tokenFile) problems.push(`${component.name}: missing token file`);

  return problems;
});

const distProblems = dist.flatMap((item) => {
  const problems = [];

  if (!item.exists) problems.push(`${item.root}: missing dist root`);
  if (item.exists && item.fileCount === 0) problems.push(`${item.root}: empty dist root`);

  return problems;
});

const publishablePackageProblems = publishablePackages.flatMap((pkg) => {
  const problems = [];

  if (pkg.type !== "module") problems.push(`${pkg.name}: type is not module`);
  if (pkg.publishConfigAccess !== "public") problems.push(`${pkg.name}: publishConfig.access is not public`);
  if (pkg.exports.length === 0) problems.push(`${pkg.name}: no exports`);
  if (pkg.files.length === 0) problems.push(`${pkg.name}: no files array`);

  return problems;
});

const reportProblems = reports.reduce((total, report) => total + report.problems, 0);
const reportWarnings = reports.reduce((total, report) => total + report.warnings, 0);
const reportChanges = reports.reduce((total, report) => total + report.changes, 0);

const blockers = [
  ...missingRequiredFiles.map((file) => `missing required file: ${file}`),
  ...componentProblems,
  ...distProblems,
  ...publishablePackageProblems
];

const readinessStatus = blockers.length === 0 ? "READY_FOR_FINAL_REVIEW" : "BLOCKED";

const snapshot = {
  generatedAt: new Date().toISOString(),
  readinessStatus,
  root: {
    name: rootPackage.name ?? null,
    version: rootPackage.version ?? null,
    private: Boolean(rootPackage.private),
    packageManager: rootPackage.packageManager ?? null
  },
  summary: {
    packages: packages.length,
    publishablePackages: publishablePackages.length,
    components: components.length,
    reports: reports.length,
    reportProblems,
    reportWarnings,
    reportChanges,
    blockers: blockers.length,
    missingRequiredFiles: missingRequiredFiles.length
  },
  blockers,
  missingRequiredFiles,
  packages,
  publishablePackages,
  components,
  dist,
  reports,
  requiredFileHashes: requiredFiles
    .filter((file) => existsSync(file))
    .map((file) => ({
      file,
      sha256: hashFile(file)
    }))
};

writeFileSync("FINAL_RELEASE_READINESS_SNAPSHOT.json", `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

const markdown = [
  "# Noctra Final Release Readiness Snapshot",
  "",
  `Generated: ${snapshot.generatedAt}`,
  "",
  `Status: ${readinessStatus}`,
  "",
  "## Summary",
  "",
  `- Root package: ${snapshot.root.name ?? "-"}`,
  `- Root version: ${snapshot.root.version ?? "-"}`,
  `- Workspace packages: ${snapshot.summary.packages}`,
  `- Publishable packages: ${snapshot.summary.publishablePackages}`,
  `- Components: ${snapshot.summary.components}`,
  `- Reports: ${snapshot.summary.reports}`,
  `- Report problems summarized: ${snapshot.summary.reportProblems}`,
  `- Report warnings summarized: ${snapshot.summary.reportWarnings}`,
  `- Auto-heal changes summarized: ${snapshot.summary.reportChanges}`,
  `- Blockers: ${snapshot.summary.blockers}`,
  `- Missing required files: ${snapshot.summary.missingRequiredFiles}`,
  "",
  "## Blockers",
  "",
  ...(blockers.length > 0 ? blockers.map((blocker) => `- ${blocker}`) : ["- None"]),
  "",
  "## Publishable Packages",
  "",
  "| Package | Version | Path | Exports | Files | Access |",
  "|---|---|---|---:|---:|---|",
  ...publishablePackages.map((pkg) => `| ${pkg.name} | ${pkg.version} | ${pkg.path} | ${pkg.exports.length} | ${pkg.files.length} | ${pkg.publishConfigAccess} |`),
  "",
  "## Component Matrix",
  "",
  "| Component | Kebab | Index | Main | Types | Anatomy | Style | Token |",
  "|---|---|---|---|---|---|---|---|",
  ...components.map((component) => {
    const ok = (value) => value ? "OK" : "MISSING";

    return `| ${component.name} | ${component.kebab} | ${ok(component.reactIndex)} | ${ok(component.reactMain)} | ${ok(component.reactTypes)} | ${ok(component.reactAnatomy)} | ${ok(component.styleFile)} | ${ok(component.tokenFile)} |`;
  }),
  "",
  "## Dist Matrix",
  "",
  "| Root | Exists | Files | Bytes | JS | Types | CSS |",
  "|---|---|---:|---:|---|---|---|",
  ...dist.map((item) => `| ${item.root} | ${item.exists ? "OK" : "MISSING"} | ${item.fileCount} | ${item.totalBytes} | ${item.hasJs ? "OK" : "MISSING"} | ${item.hasTypes ? "OK" : "MISSING"} | ${item.hasCss ? "OK" : "MISSING"} |`),
  "",
  "## Report Matrix",
  "",
  "| Report | Problems | Warnings | Changes | SHA256 |",
  "|---|---:|---:|---:|---|",
  ...reports.map((report) => `| ${report.path} | ${report.problems} | ${report.warnings} | ${report.changes} | ${report.sha256 ?? "-"} |`),
  "",
  "## Required File Hashes",
  "",
  "| File | SHA256 |",
  "|---|---|",
  ...snapshot.requiredFileHashes.map((item) => `| ${item.file} | ${item.sha256} |`),
  "",
  "## Final Note",
  "",
  "- This snapshot does not publish, tag, commit, or push.",
  "- `READY_FOR_FINAL_REVIEW` means the snapshot-level structural blockers are clear.",
  "- Build, typecheck, verify-exports, npm pack dry-run, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("FINAL_RELEASE_READINESS_SNAPSHOT.md", `${markdown}\n`, "utf8");

const report = [
  "# Noctra Final Release Readiness Snapshot Gate Report",
  "",
  `Generated: ${snapshot.generatedAt}`,
  "",
  `Status: ${readinessStatus}`,
  `Blockers: ${blockers.length}`,
  `Reports summarized: ${reports.length}`,
  `Components summarized: ${components.length}`,
  `Publishable packages summarized: ${publishablePackages.length}`,
  "",
  "## Generated Files",
  "",
  "- FINAL_RELEASE_READINESS_SNAPSHOT.json",
  "- FINAL_RELEASE_READINESS_SNAPSHOT.md",
  "",
  "## Blockers",
  "",
  ...(blockers.length > 0 ? blockers.map((blocker) => `- ${blocker}`) : ["- None"])
].join("\n");

writeFileSync("final-release-readiness-snapshot-report.md", `${report}\n`, "utf8");

console.log(`Final release readiness snapshot generated. Status: ${readinessStatus}. Blockers: ${blockers.length}. Report: final-release-readiness-snapshot-report.md`);