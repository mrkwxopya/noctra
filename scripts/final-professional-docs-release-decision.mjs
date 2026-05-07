import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function hashFile(path) {
  if (!existsSync(path)) return null;
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function numberAfter(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}:\\s*(\\d+)`, "i"));
  return match ? Number(match[1]) : 0;
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

function sectionItems(text, heading) {
  const lines = text.split(/\r?\n/g);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);

  if (start === -1) return [];

  const items = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (line.startsWith("## ")) break;

    if (line.startsWith("- ") && line !== "- None") {
      items.push(line);
    }
  }

  return items;
}

const requiredFiles = [
  "apps/docs/src/main.tsx",
  "apps/docs/src/docs.css",
  "apps/docs/src/components/DocsChrome.tsx",
  "apps/docs/src/pages/OverviewPage.tsx",
  "apps/docs/src/pages/ComponentsPage.tsx",
  "apps/docs/src/pages/ComponentDetailPage.tsx",
  "apps/docs/src/pages/ArchitecturePage.tsx",
  "apps/docs/src/pages/ThemingPage.tsx",
  "apps/docs/src/pages/QualityPage.tsx",
  "apps/docs/src/pages/ReleasePage.tsx",
  "apps/docs/src/data/componentExamples.tsx",
  "apps/docs/src/data/propDescriptions.ts",
  "apps/docs/src/generated/noctra-professional-docs.generated.ts",
  "professional-docs-audit-report.md",
  "professional-docs-data-generation-report.md",
  "docs-typecheck-debug.log",
  "docs-build-debug.log"
];

const docsDistFiles = walkFiles("apps/docs/dist");
const professionalAudit = readText("professional-docs-audit-report.md");
const typecheckLog = readText("docs-typecheck-debug.log");
const buildLog = readText("docs-build-debug.log");

const auditProblems = numberAfter(professionalAudit, "Problems found");
const auditWarnings = numberAfter(professionalAudit, "Warnings found");
const generatedComponents = numberAfter(professionalAudit, "Generated components");
const generatedProps = numberAfter(professionalAudit, "Generated props");
const generatedTokens = numberAfter(professionalAudit, "Generated tokens");
const curatedExamples = numberAfter(professionalAudit, "Curated examples");
const propDescriptions = numberAfter(professionalAudit, "Prop descriptions");

const blockers = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    blockers.push(`Missing required docs release file: ${file}`);
  }
}

if (!existsSync("apps/docs/dist")) {
  blockers.push("Missing apps/docs/dist");
}

if (docsDistFiles.length === 0) {
  blockers.push("Docs dist is empty");
}

if (auditProblems > 0) {
  blockers.push(`professional-docs-audit-report.md has ${auditProblems} problem(s)`);
}

if (!buildLog.includes("built") && !buildLog.includes("Done")) {
  blockers.push("docs-build-debug.log does not show a successful build");
}

if (typecheckLog.toLowerCase().includes("error ts")) {
  blockers.push("docs-typecheck-debug.log contains TypeScript errors");
}

const warnings = [
  ...sectionItems(professionalAudit, "Warnings")
];

const decision = blockers.length === 0 ? "PASS_FINAL_DOCS_RELEASE_GATE" : "BLOCKED_FINAL_DOCS_RELEASE_GATE";

const payload = {
  generatedAt: new Date().toISOString(),
  decision,
  blockers,
  warnings,
  summary: {
    auditProblems,
    auditWarnings,
    generatedComponents,
    generatedProps,
    generatedTokens,
    curatedExamples,
    propDescriptions,
    docsDistFiles: docsDistFiles.length,
    docsDistBytes: docsDistFiles.reduce((total, file) => total + statSync(file).size, 0)
  },
  files: requiredFiles
    .filter((file) => existsSync(file))
    .map((file) => ({
      file,
      sha256: hashFile(file)
    })),
  distSamples: docsDistFiles.slice(0, 20)
};

writeFileSync("FINAL_DOCS_RELEASE_DECISION.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const markdown = [
  "# Final Professional Docs Release Decision",
  "",
  `Generated: ${payload.generatedAt}`,
  "",
  `Decision: ${decision}`,
  "",
  "## Summary",
  "",
  `- Audit problems: ${payload.summary.auditProblems}`,
  `- Audit warnings: ${payload.summary.auditWarnings}`,
  `- Generated components: ${payload.summary.generatedComponents}`,
  `- Generated props: ${payload.summary.generatedProps}`,
  `- Generated tokens: ${payload.summary.generatedTokens}`,
  `- Curated examples: ${payload.summary.curatedExamples}`,
  `- Prop descriptions: ${payload.summary.propDescriptions}`,
  `- Docs dist files: ${payload.summary.docsDistFiles}`,
  `- Docs dist bytes: ${payload.summary.docsDistBytes}`,
  "",
  "## Blockers",
  "",
  ...(blockers.length > 0 ? blockers.map((blocker) => `- ${blocker}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings : ["- None"]),
  "",
  "## Dist Samples",
  "",
  ...(payload.distSamples.length > 0 ? payload.distSamples.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## File Hashes",
  "",
  "| File | SHA256 |",
  "|---|---|",
  ...payload.files.map((item) => `| ${item.file} | ${item.sha256} |`),
  "",
  "## Interpretation",
  "",
  "- PASS_FINAL_DOCS_RELEASE_GATE means the professional docs structure, generated component docs, audit, typecheck, and build passed.",
  "- Warnings are acceptable for alpha docs, but should be reduced before a stable public v1 documentation release.",
  "- This step does not publish, commit, tag, or push."
].join("\n");

writeFileSync("FINAL_DOCS_RELEASE_DECISION.md", `${markdown}\n`, "utf8");

console.log(`Final professional docs release decision generated. Decision: ${decision}. Blockers: ${blockers.length}. Warnings: ${warnings.length}. Report: FINAL_DOCS_RELEASE_DECISION.md`);

if (blockers.length > 0) {
  throw new Error(`Final professional docs release gate blocked with ${blockers.length} blocker(s). See FINAL_DOCS_RELEASE_DECISION.md`);
}