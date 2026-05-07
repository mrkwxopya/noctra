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

    if (/\.(html|js|css|json|txt|md)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

const problems = [];
const warnings = [];

const indexHtml = readText("apps/docs/dist/index.html");
const notFoundHtml = readText("apps/docs/dist/404.html");
const routing = readText("apps/docs/src/lib/docsRouting.ts");
const vite = readText("apps/docs/vite.config.ts");

if (!existsSync("apps/docs/dist/index.html")) {
  problems.push("Missing apps/docs/dist/index.html");
}

if (!existsSync("apps/docs/dist/404.html")) {
  problems.push("Missing apps/docs/dist/404.html");
}

if (!indexHtml.includes("/noctra/assets/")) {
  problems.push("dist/index.html asset paths are not under /noctra/assets/");
}

if (!notFoundHtml.includes("/noctra/assets/")) {
  problems.push("dist/404.html asset paths are not under /noctra/assets/");
}

if (!vite.includes('"/noctra/"')) {
  problems.push("apps/docs/vite.config.ts does not contain /noctra/ fallback base.");
}

if (!routing.includes('NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts does not hard-code NOCTRA_DOCS_BASE as /noctra/.");
}

if (!routing.includes("forceNoctraDocsHref")) {
  problems.push("docsRouting.ts is missing forceNoctraDocsHref.");
}

if (!routing.includes("sanitizeDocsAnchors")) {
  problems.push("docsRouting.ts is missing sanitizeDocsAnchors.");
}

for (const file of walk("apps/docs/dist")) {
  const text = readText(file);

  if (text.includes("https://mrkwxopya.github.io/components")) {
    problems.push(`Forbidden root GitHub components URL found in ${file}`);
  }

  if (text.includes('href="/components')) {
    problems.push(`Forbidden root href="/components found in ${file}`);
  }

  if (text.includes("href='/components")) {
    problems.push(`Forbidden root href='/components found in ${file}`);
  }

  if (text.includes("/release#/components")) {
    problems.push(`Forbidden /release#/components route found in ${file}`);
  }

  if (text.includes("#/components")) {
    warnings.push(`Hash component route text found in ${file}. Should only exist for backward compatibility if intentional.`);
  }
}

const report = [
  "# Docs Final Dist URL Audit",
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
  "## Expected",
  "",
  "- Public docs base: `/noctra/`",
  "- Component URL example: `/noctra/components/button`",
  "- Forbidden URL example: `/components/button`",
  "- GitHub Pages fallback file: `apps/docs/dist/404.html`"
].join("\n");

writeFileSync("docs-final-dist-url-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs final dist URL audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-final-dist-url-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Docs final dist URL audit failed with ${problems.length} problem(s).`);
}
