import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function walkFiles(root = ".") {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    if (["node_modules", ".git", "dist", ".vite"].includes(entry)) continue;

    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walkFiles(fullPath));
      continue;
    }

    output.push(fullPath.replace(/\\/g, "/").replace(/^\.\//, ""));
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function numberAfter(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}:\\s*(\\d+)`, "i"));
  return match ? Number(match[1]) : 0;
}

function statusAfter(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}:\\s*([^\\n]+)`, "i"));
  return match ? match[1].trim() : "-";
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

const criticalReports = new Set([
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md"
]);

const knownNonBlockingReports = new Set([
  "docs-component-usage-audit-report.md",
  "final-quality-gate-report.md",
  "final-release-notes-publish-checklist-report.md",
  "final-release-readiness-snapshot-report.md",
  "final-report-drift-resolution-report.md",
  "noctra-quality-reports-index.md",
  "noctra-release-candidate-manifest.md",
  "FINAL_RELEASE_READINESS_SNAPSHOT.md",
  "FINAL_RELEASE_DECISION.md",
  "release-warning-metadata-heal-report.md"
]);

const reportFiles = walkFiles(".")
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const lower = file.toLowerCase();

    return lower.endsWith("-report.md") ||
      lower.endsWith("audit-report.md") ||
      lower.endsWith("quality-gate-report.md") ||
      lower === "noctra-quality-reports-index.md" ||
      lower === "noctra-release-candidate-manifest.md" ||
      lower === "final_release_readiness_snapshot.md" ||
      lower === "final_release_decision.md" ||
      lower === "final_release_readiness_snapshot.md" ||
      lower === "final_release_decision.md";
  })
  .sort((a, b) => a.localeCompare(b));

const rows = [];
const blockers = [];
const observations = [];

for (const file of reportFiles) {
  const basename = file.split("/").pop();
  const text = readText(file);

  const row = {
    file,
    basename,
    title: text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file,
    critical: criticalReports.has(basename),
    nonBlocking: knownNonBlockingReports.has(basename),
    problemsFound: numberAfter(text, "Problems found"),
    warningsFound: Math.max(numberAfter(text, "Warnings found"), numberAfter(text, "Warnings")),
    changesApplied: numberAfter(text, "Changes applied"),
    totalReportedProblems: numberAfter(text, "Total reported problems") ||
      numberAfter(text, "Problems summarized") ||
      numberAfter(text, "Reported problems"),
    status: statusAfter(text, "Status"),
    decision: statusAfter(text, "Decision"),
    problemItems: sectionItems(text, "Problems"),
    warningItems: sectionItems(text, "Warnings"),
    blockerItems: sectionItems(text, "Blockers")
  };

  rows.push(row);

  if (row.critical && row.problemsFound > 0) {
    blockers.push(`${file}: critical report has Problems found = ${row.problemsFound}`);
  }

  if (row.critical && row.blockerItems.length > 0) {
    blockers.push(`${file}: critical report has ${row.blockerItems.length} blocker item(s)`);
  }

  if (!row.critical && !row.nonBlocking && row.problemsFound > 0) {
    observations.push(`${file}: non-critical report has Problems found = ${row.problemsFound}`);
  }

  if (row.warningsFound > 0) {
    observations.push(`${file}: warning count = ${row.warningsFound}`);
  }

  if (row.totalReportedProblems > 0 && !row.critical) {
    observations.push(`${file}: aggregate summarized old/problem totals = ${row.totalReportedProblems}`);
  }
}

const blockersText = [
  "FINAL REMAINING BLOCKERS",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Critical blockers: ${blockers.length}`,
  `Observations: ${observations.length}`,
  "",
  "BLOCKERS:",
  ...(blockers.length > 0 ? blockers.map((item) => `- ${item}`) : ["- None"]),
  "",
  "OBSERVATIONS:",
  ...(observations.length > 0 ? observations.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("FINAL_REMAINING_BLOCKERS.txt", `${blockersText}\n`, "utf8");

const report = [
  "# Final Report Drift Resolution Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Reports scanned: ${rows.length}`,
  `Critical blockers: ${blockers.length}`,
  `Non-blocking observations: ${observations.length}`,
  "",
  "## Report Matrix",
  "",
  "| Report | Critical | Non-blocking | Problems | Total summarized problems | Warnings | Changes | Status | Decision |",
  "|---|---|---|---:|---:|---:|---:|---|---|",
  ...rows.map((row) => {
    return `| ${row.file} | ${row.critical ? "YES" : "NO"} | ${row.nonBlocking ? "YES" : "NO"} | ${row.problemsFound} | ${row.totalReportedProblems} | ${row.warningsFound} | ${row.changesApplied} | ${row.status} | ${row.decision} |`;
  }),
  "",
  "## Critical Blockers",
  "",
  ...(blockers.length > 0 ? blockers.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Non-blocking Observations",
  "",
  ...(observations.length > 0 ? observations.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Extracted Details",
  "",
  ...rows.flatMap((row) => {
    const items = [
      ...row.problemItems.map((item) => `- ${row.file}: ${item.replace(/^- /, "")}`),
      ...row.warningItems.map((item) => `- ${row.file}: ${item.replace(/^- /, "")}`),
      ...row.blockerItems.map((item) => `- ${row.file}: ${item.replace(/^- /, "")}`)
    ];

    return items.length > 0 ? [`### ${row.file}`, "", ...items, ""] : [];
  }),
  rows.every((row) => row.problemItems.length === 0 && row.warningItems.length === 0 && row.blockerItems.length === 0) ? "- None" : "",
  "",
  "## Resolution Rule",
  "",
  "- Critical audit reports with `Problems found > 0` are blockers.",
  "- Aggregate/generated summary reports are not blockers by themselves.",
  "- Warning-only reports are tracked as observations.",
  "- `FINAL_REMAINING_BLOCKERS.txt` contains the shortest readable list."
].join("\n");

writeFileSync("final-report-drift-resolution-report.md", `${report}\n`, "utf8");

console.log(`Final report drift resolution completed. Reports: ${rows.length}. Critical blockers: ${blockers.length}. Observations: ${observations.length}. Details: FINAL_REMAINING_BLOCKERS.txt`);

if (blockers.length > 0) {
  console.error(blockersText);
  throw new Error(`Critical report blockers remain: ${blockers.length}. See FINAL_REMAINING_BLOCKERS.txt`);
}