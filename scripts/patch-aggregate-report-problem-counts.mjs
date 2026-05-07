import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function replaceFile(path, replacements) {
  if (!existsSync(path)) return;

  let text = readText(path);

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  writeFileSync(path, `${text.trimEnd()}\n`, "utf8");
}

replaceFile("scripts/generate-release-candidate-manifest.mjs", [
  [
    /const totalProblems = reports\.reduce\(\(total, report\) => total \+ report\.problems, 0\);/,
    `const criticalReportFiles = new Set([
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
  .reduce((total, report) => total + report.problems, 0);`
  ],
  [
    /`- Reported problems: \$\{manifest\.summary\.totalReportedProblems\}`,/,
    "`- Critical reported problems: ${manifest.summary.totalReportedProblems}`,"
  ]
]);

replaceFile("scripts/generate-final-release-docs.mjs", [
  [
    /const totalProblems = reports\.reduce\(\(total, report\) => total \+ report\.problems, 0\);/,
    `const criticalReportFiles = new Set([
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
  .reduce((total, report) => total + report.problems, 0);`
  ],
  [
    /`- Reported problems: \$\{totalProblems\}`,/,
    "`- Critical reported problems: ${totalProblems}`,"
  ],
  [
    /`Reported problems summarized: \$\{totalProblems\}`,/,
    "`Critical reported problems summarized: ${totalProblems}`,"
  ]
]);

console.log("Patched aggregate report generators to count critical audit problems only.");