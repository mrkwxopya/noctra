import { existsSync, readFileSync, writeFileSync } from "node:fs";

const workflowPath = ".github/workflows/docs-pages.yml";
const reportPath = "canonical-pages-workflow-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(workflowPath);

if (!before) {
  throw new Error(`${workflowPath} missing or empty.`);
}

const workflow = `name: Deploy Noctra Docs

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: noctra-docs-pages-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Build docs artifact
    runs-on: ubuntu-latest
    env:
      GITHUB_PAGES_BASE: /noctra/
      NODE_ENV: production
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build docs
        run: pnpm --filter @noctra/docs build

      - name: Prepare Pages fallback
        shell: bash
        run: |
          test -f apps/docs/dist/index.html
          cp apps/docs/dist/index.html apps/docs/dist/404.html
          node - <<'NODE'
          const { readFileSync, writeFileSync, existsSync } = require("node:fs");
          const indexPath = "apps/docs/dist/index.html";
          const html = readFileSync(indexPath, "utf8");
          const match = html.match(/assets\\/index-[^"]+\\.js/);
          if (!match) {
            throw new Error("No Vite JS asset found in docs dist index.html");
          }
          const assetPath = "apps/docs/dist/" + match[0];
          if (!existsSync(assetPath)) {
            throw new Error("Vite JS asset referenced by index.html does not exist: " + assetPath);
          }
          const info = {
            generatedAt: new Date().toISOString(),
            sha: process.env.GITHUB_SHA,
            asset: match[0],
            base: process.env.GITHUB_PAGES_BASE
          };
          writeFileSync("apps/docs/dist/noctra-deploy-info.json", JSON.stringify(info, null, 2) + "\\n");
          console.log("Noctra docs artifact asset:", match[0]);
          NODE

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload current docs artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: apps/docs/dist

  deploy:
    name: Deploy docs to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy current artifact
        id: deployment
        uses: actions/deploy-pages@v4
`;

writeText(workflowPath, workflow);

const after = readText(workflowPath);
const problems = [];

if (!after.includes("actions/upload-pages-artifact@v4")) {
  problems.push("docs-pages.yml missing upload-pages-artifact@v4.");
}

if (!after.includes("actions/deploy-pages@v4")) {
  problems.push("docs-pages.yml missing deploy-pages@v4.");
}

if (!after.includes("path: apps/docs/dist")) {
  problems.push("docs-pages.yml does not upload apps/docs/dist.");
}

if (!after.includes("pnpm --filter @noctra/docs build")) {
  problems.push("docs-pages.yml does not build @noctra/docs.");
}

if (!after.includes("noctra-deploy-info.json")) {
  problems.push("docs-pages.yml missing deploy info marker.");
}

if (!after.includes("GITHUB_PAGES_BASE: /noctra/")) {
  problems.push("docs-pages.yml missing /noctra/ base env.");
}

if (/version:\s*10\.33\.2/.test(after) || /version:\s*9\.15\.0/.test(after)) {
  problems.push("docs-pages.yml hardcodes pnpm version; this can conflict with packageManager.");
}

const report = [
  "# Canonical Pages Workflow Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Replaced docs-pages.yml with one canonical Pages deploy workflow.",
  "- Build job now always builds @noctra/docs from current HEAD.",
  "- Upload artifact path is explicitly apps/docs/dist.",
  "- Deploy job deploys exactly that uploaded artifact.",
  "- Added noctra-deploy-info.json marker into the artifact.",
  "- Removed hardcoded pnpm version to avoid packageManager conflicts."
].join("\n");

writeText(reportPath, report);

console.log(`Canonical Pages workflow patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Canonical Pages workflow patch failed.");
}
