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

    if (/\.(ts|tsx|js|jsx|md|json)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

const routingPath = "apps/docs/src/lib/docsRouting.ts";
const mainPath = "apps/docs/src/main.tsx";

const routing = readText(routingPath);
const main = readText(mainPath);

const files = walk("apps/docs/src").filter((file) => {
  if (file.includes("/generated/")) return false;
  if (file.endsWith("docsRouting.ts")) return false;

  return true;
});

const problems = [];

if (!routing.includes('export const NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts does not define hard /noctra/ base.");
}

if (!routing.includes("forceNoctraDocsHref")) {
  problems.push("docsRouting.ts missing forceNoctraDocsHref.");
}

if (!routing.includes("sanitizeDocsAnchors")) {
  problems.push("docsRouting.ts missing sanitizeDocsAnchors.");
}

if (!routing.includes('url.pathname === "/components"')) {
  problems.push("docsRouting.ts must recognize accidental root /components links.");
}

if (!routing.includes('url.pathname.startsWith("/components/")')) {
  problems.push("docsRouting.ts must recognize accidental root /components/* links.");
}

if (!routing.includes("return docsHref(url.pathname);")) {
  problems.push("forceNoctraDocsHref must convert root /components paths through docsHref.");
}

if (!main.includes("forceNoctraDocsHref")) {
  problems.push("main.tsx does not force clicked internal links through /noctra.");
}

if (!main.includes("sanitizeDocsAnchors")) {
  problems.push("main.tsx does not sanitize rendered anchors.");
}

if (!main.includes("MutationObserver")) {
  problems.push("main.tsx does not watch late-rendered anchors.");
}

for (const file of files) {
  const text = readText(file);

  if (text.includes("https://mrkwxopya.github.io/components")) {
    problems.push(`Root GitHub components URL found in ${file}`);
  }

  if (text.includes('href="/components')) {
    problems.push(`Raw href="/components found in ${file}`);
  }

  if (text.includes("href='/components")) {
    problems.push(`Raw href='/components found in ${file}`);
  }

  if (text.includes('href: "/components')) {
    problems.push(`Raw href: "/components found in ${file}`);
  }

  if (text.includes("`/components/${") && !text.includes("docsHref(`/components/")) {
    problems.push(`Raw template /components link found in ${file}`);
  }
}

const report = [
  "# Hard Docs Base URL Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Scanned files: ${files.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Required",
  "",
  "- No user-facing link should navigate to `https://mrkwxopya.github.io/components/...`.",
  "- All component links must resolve to `/noctra/components/...`.",
  "- Runtime click handling must canonicalize root `/components/...` to `/noctra/components/...`.",
  "- Rendered anchors must be sanitized after render.",
  "- `docsRouting.ts` is allowed to contain route parser strings such as `/components/${slug}` because it canonicalizes them."
].join("\n");

writeFileSync("docs-hard-base-url-audit-report.md", `${report}\n`, "utf8");

console.log(report);

if (problems.length > 0) {
  throw new Error(`Hard docs base URL audit failed with ${problems.length} problem(s). See docs-hard-base-url-audit-report.md`);
}
