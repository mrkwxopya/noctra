import { existsSync, readFileSync, writeFileSync } from "node:fs";

const legacyPath = ".github/workflows/docs.yml";
const pagesPath = ".github/workflows/docs-pages.yml";
const reportPath = "duplicate-docs-workflow-disable-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforeLegacy = readText(legacyPath);
const beforePages = readText(pagesPath);

if (!beforeLegacy) {
  throw new Error(`${legacyPath} missing or empty.`);
}

if (!beforePages) {
  throw new Error(`${pagesPath} missing or empty.`);
}

const legacy = `name: Legacy Noctra Docs Checks

on:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: noctra-docs-legacy-manual
  cancel-in-progress: true

jobs:
  disabled:
    name: Legacy workflow disabled for push deploys
    runs-on: ubuntu-latest
    steps:
      - name: Explain disabled legacy workflow
        run: |
          echo "This legacy docs workflow is intentionally manual-only."
          echo "GitHub Pages deploys are handled by .github/workflows/docs-pages.yml."
`;

let pages = beforePages;

pages = pages.replace(
  /concurrency:\s*\n\s*group:\s*[^\n]+\n\s*cancel-in-progress:\s*(true|false)/,
  "concurrency:\n  group: noctra-docs-pages-${{ github.ref }}\n  cancel-in-progress: true"
);

writeText(legacyPath, legacy);
writeText(pagesPath, pages);

const afterLegacy = readText(legacyPath);
const afterPages = readText(pagesPath);

const problems = [];

if (/push\s*:/.test(afterLegacy) || /pull_request\s*:/.test(afterLegacy)) {
  problems.push("docs.yml still has push or pull_request trigger.");
}

if (!afterLegacy.includes("workflow_dispatch")) {
  problems.push("docs.yml missing workflow_dispatch manual trigger.");
}

if (!afterLegacy.includes("manual-only")) {
  problems.push("docs.yml does not clearly state manual-only legacy status.");
}

if (!afterPages.includes("workflow_dispatch") && !afterPages.includes("push:")) {
  problems.push("docs-pages.yml does not appear to have push/manual triggers.");
}

if (!afterPages.includes("noctra-docs-pages-${{ github.ref }}")) {
  problems.push("docs-pages.yml concurrency group was not normalized.");
}

const report = [
  "# Duplicate Docs Workflow Disable Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Legacy docs.yml changed: ${beforeLegacy === afterLegacy ? "no" : "yes"}`,
  `docs-pages.yml changed: ${beforePages === afterPages ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Disabled duplicate legacy docs.yml from push deploys.",
  "- Kept docs.yml as manual-only workflow_dispatch.",
  "- Kept docs-pages.yml as the active GitHub Pages deploy workflow.",
  "- Normalized docs-pages.yml concurrency group."
].join("\n");

writeText(reportPath, report);

console.log(`Duplicate docs workflow disable completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Duplicate docs workflow disable failed.");
}
