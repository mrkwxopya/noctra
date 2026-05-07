import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function walkMarkdownReports(root = ".") {
  const output = [];

  for (const entry of readdirSync(root)) {
    if (["node_modules", ".git", "dist", ".vite"].includes(entry)) continue;

    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walkMarkdownReports(fullPath));
      continue;
    }

    if (entry.endsWith("-report.md") || entry.endsWith("audit-report.md") || entry.endsWith("quality-gate-report.md")) {
      output.push(fullPath.replace(/\\/g, "/").replace(/^\.\//, ""));
    }
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function firstHeading(text) {
  const match = text.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function extractNumber(text, label) {
  const pattern = new RegExp(`${label}:\\s*(\\d+)`, "i");
  const match = text.match(pattern);
  return match ? Number(match[1]) : null;
}

function extractGenerated(text) {
  const match = text.match(/Generated:\s*([^\n]+)/i);
  return match ? match[1].trim() : "";
}

function classifyReport(path, title) {
  const name = basename(path).toLowerCase();
  const normalizedTitle = title.toLowerCase();

  if (name.includes("auto-heal") || normalizedTitle.includes("auto-heal")) return "auto-heal";
  if (name.includes("smoke") || normalizedTitle.includes("smoke")) return "smoke";
  if (name.includes("audit") || normalizedTitle.includes("audit")) return "audit";
  if (name.includes("quality")) return "quality";
  return "report";
}

const criticalReports = new Set([
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md"
]);

const nonBlockingReports = new Set([
  "docs-component-usage-audit-report.md",
  "final-quality-gate-report.md",
  "final-release-notes-publish-checklist-report.md",
  "final-release-readiness-snapshot-report.md",
  "final-report-drift-resolution-report.md",
  "release-warning-metadata-heal-report.md"
]);

const reports = walkMarkdownReports(".").map((path) => {
  const text = readText(path);
  const title = firstHeading(text) || basename(path);
  const file = basename(path);
  const type = classifyReport(path, title);
  const problemsFound = extractNumber(text, "Problems found") ?? 0;
  const warningsFound = Math.max(extractNumber(text, "Warnings found") ?? 0, extractNumber(text, "Warnings") ?? 0);
  const changesApplied = extractNumber(text, "Changes applied") ?? 0;
  const critical = criticalReports.has(file);
  const nonBlocking = nonBlockingReports.has(file);

  return {
    path,
    file,
    title,
    type,
    critical,
    nonBlocking,
    generated: extractGenerated(text),
    problemsFound,
    warningsFound,
    changesApplied,
    componentsScanned: extractNumber(text, "Components scanned") ?? extractNumber(text, "Component directories") ?? extractNumber(text, "Components imported"),
    missingDocsRefs: extractNumber(text, "Components not referenced in apps/docs/src")
  };
});

const grouped = reports.reduce((acc, row) => {
  acc[row.type] ??= [];
  acc[row.type].push(row);
  return acc;
}, {});

const criticalProblems = reports
  .filter((report) => report.critical)
  .reduce((total, report) => total + report.problemsFound, 0);

const criticalWarnings = reports
  .filter((report) => report.critical)
  .reduce((total, report) => total + report.warningsFound, 0);

const nonBlockingWarnings = reports
  .filter((report) => !report.critical)
  .reduce((total, report) => total + report.warningsFound, 0);

const totalChanges = reports.reduce((total, report) => total + report.changesApplied, 0);

const report = [
  "# Noctra Quality Reports Index",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Reports indexed: ${reports.length}`,
  `Critical reported problems: ${criticalProblems}`,
  `Critical reported warnings: ${criticalWarnings}`,
  `Non-blocking reported warnings: ${nonBlockingWarnings}`,
  `Total auto-heal changes: ${totalChanges}`,
  "",
  "## Report Matrix",
  "",
  "| Report | Type | Critical | Non-blocking | Generated | Components | Problems | Warnings | Changes | Missing docs refs |",
  "|---|---|---|---|---|---:|---:|---:|---:|---:|",
  ...reports.map((row) => {
    return `| ${row.title} (${row.path}) | ${row.type} | ${row.critical ? "YES" : "NO"} | ${row.nonBlocking ? "YES" : "NO"} | ${row.generated || "-"} | ${row.componentsScanned ?? "-"} | ${row.problemsFound} | ${row.warningsFound} | ${row.changesApplied} | ${row.missingDocsRefs ?? "-"} |`;
  }),
  "",
  "## Grouped Reports",
  "",
  ...Object.entries(grouped).flatMap(([type, items]) => [
    `### ${type}`,
    "",
    ...items.map((item) => `- ${item.title}: ${item.path}`),
    ""
  ]),
  "## Gate Interpretation",
  "",
  "- Critical reported problems must be zero before publishing.",
  "- Aggregate reports and docs coverage observations are tracked but are not direct blockers.",
  "- Build, typecheck, verify-exports, npm pack dry-run, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("noctra-quality-reports-index.md", `${report}\n`, "utf8");

console.log(`Quality reports index generated. Reports: ${reports.length}. Critical problems: ${criticalProblems}. Critical warnings: ${criticalWarnings}. Non-blocking warnings: ${nonBlockingWarnings}. Report: noctra-quality-reports-index.md`);