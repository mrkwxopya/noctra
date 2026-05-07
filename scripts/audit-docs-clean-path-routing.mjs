import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function walk(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walk(fullPath));
      continue;
    }

    if (/\.(tsx|ts|html)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

const problems = [];
const warnings = [];

const requiredFiles = [
  "apps/docs/src/lib/docsRouting.ts",
  "apps/docs/src/main.tsx",
  "apps/docs/src/components/DocsChrome.tsx",
  "apps/docs/src/pages/ComponentsPage.tsx",
  "apps/docs/src/pages/ComponentDetailPage.tsx"
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    problems.push(`Missing required routing file: ${file}`);
  }
}

const routing = readText("apps/docs/src/lib/docsRouting.ts");
const main = readText("apps/docs/src/main.tsx");

if (!routing.includes("docsHref(path =")) {
  problems.push("docsRouting.ts does not expose clean docsHref.");
}

if (routing.includes("return `${base}#")) {
  problems.push("docsHref still returns hash route URLs.");
}

if (!routing.includes("canonicalizeDocsCleanRoute")) {
  problems.push("docsRouting.ts is missing canonicalizeDocsCleanRoute.");
}

if (!main.includes("isInternalDocsUrl")) {
  problems.push("main.tsx does not intercept internal clean path links.");
}

if (!main.includes("window.history.pushState")) {
  problems.push("main.tsx does not use pushState for clean path routing.");
}

if (!main.includes("popstate")) {
  problems.push("main.tsx does not listen to popstate.");
}

const sourceText = walk("apps/docs/src")
  .filter((file) => !file.endsWith("docsRouting.ts"))
  .map((file) => readText(file))
  .join("\n");

if (sourceText.includes('href="#/')) {
  problems.push('Source still contains href="#/" hash links.');
}

if (sourceText.includes("`#/components/")) {
  problems.push("Source still contains template hash component links.");
}

if (sourceText.includes("/release#/components")) {
  problems.push("Source still contains broken /release#/components pattern.");
}

if (sourceText.includes("github.io/noctra/#/")) {
  warnings.push("Source still mentions hash GitHub Pages URLs.");
}

let distIndex = "";

if (existsSync("apps/docs/dist/index.html")) {
  distIndex = readText("apps/docs/dist/index.html");

  if (!distIndex.includes("/noctra/assets/")) {
    problems.push("dist index.html does not contain /noctra/assets paths.");
  }
} else {
  warnings.push("apps/docs/dist/index.html not found yet. Build before final routing verification.");
}

if (existsSync("apps/docs/dist/404.html")) {
  const dist404 = readText("apps/docs/dist/404.html");

  if (!dist404.includes("/noctra/assets/")) {
    problems.push("dist 404.html does not contain /noctra/assets paths.");
  }
} else {
  warnings.push("apps/docs/dist/404.html not found yet. Copy index.html to 404.html after build.");
}

const report = [
  "# Docs Clean Path Routing Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Expected URL Forms",
  "",
  "- `https://mrkwxopya.github.io/noctra/`",
  "- `https://mrkwxopya.github.io/noctra/components/container`",
  "- `https://mrkwxopya.github.io/noctra/components/breadcrumbs`",
  "- `https://mrkwxopya.github.io/noctra/release`",
  "",
  "## Forbidden URL Forms",
  "",
  "- `https://mrkwxopya.github.io/noctra/#/components/container`",
  "- `https://mrkwxopya.github.io/noctra/release#/components/container`"
].join("\n");

writeFileSync("docs-clean-path-routing-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs clean path routing audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-clean-path-routing-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Docs clean path routing audit failed with ${problems.length} problem(s).`);
}
