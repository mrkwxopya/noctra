import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = ".github/workflows/docs.yml";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const text = readText(file);
const problems = [];

const required = [
  "name: Deploy Noctra Docs",
  "GITHUB_PAGES_BASE: /noctra/",
  "actions/upload-pages-artifact@v3",
  "actions/deploy-pages@v4",
  "cp apps/docs/dist/index.html apps/docs/dist/404.html",
  "node scripts/audit-final-noctra-docs-release.mjs",
  "path: apps/docs/dist",
  "pnpm build"
];

if (!text) {
  problems.push(`${file} is missing or empty.`);
}

for (const snippet of required) {
  if (!text.includes(snippet)) {
    problems.push(`Missing workflow snippet: ${snippet}`);
  }
}

if (text.includes("GITHUB_PAGES_BASE: /components/")) {
  problems.push("Workflow contains wrong GitHub Pages base.");
}

const report = [
  "# GitHub Pages Docs Workflow Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Expected URL",
  "",
  "- https://mrkwxopya.github.io/noctra/components/button"
].join("\n");

writeFileSync("github-pages-docs-workflow-report.md", `${report}\n`, "utf8");

console.log(`GitHub Pages docs workflow audit completed. Problems: ${problems.length}. Report: github-pages-docs-workflow-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("GitHub Pages docs workflow audit failed.");
}