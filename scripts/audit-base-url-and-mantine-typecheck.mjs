import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const vite = readText("apps/docs/vite.config.ts");
const routing = readText("apps/docs/src/lib/docsRouting.ts");
const mantine = readText("apps/docs/src/components/MantineStyleComponentDocs.tsx");
const components = readText("apps/docs/src/pages/ComponentsPage.tsx");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");

const problems = [];

if (!vite.includes('"/noctra/"')) {
  problems.push("vite.config.ts must force /noctra/ base fallback.");
}

if (!routing.includes("const REQUIRED_BASE = \"/noctra/\"")) {
  problems.push("docsRouting.ts must define REQUIRED_BASE as /noctra/.");
}

if (routing.includes("return `${base}#")) {
  problems.push("docsHref still creates hash links.");
}

if (!routing.includes("toNoctraDocsUrl")) {
  problems.push("docsRouting.ts missing toNoctraDocsUrl helper.");
}

if (!routing.includes('url.pathname === "/components"')) {
  problems.push("docsRouting.ts does not treat accidental /components links as internal.");
}

if (!mantine.includes("defaultVariant") || !mantine.includes("defaultSize")) {
  problems.push("MantineStyleComponentDocs must use non-undefined defaultVariant/defaultSize.");
}

if (mantine.includes("variants[0]") || mantine.includes("sizes[0]")) {
  problems.push("MantineStyleComponentDocs still uses unsafe variants[0] or sizes[0].");
}

if (!mantine.includes("variants.map") || !mantine.includes("sizes.map") || !mantine.includes("toneValues.map")) {
  problems.push("MantineStyleComponentDocs must render all variants, sizes, and tones.");
}

if (components.includes("`#/components/") || chrome.includes("`#/components/")) {
  problems.push("Source still contains raw template hash component links.");
}

if (components.includes('href="#/') || chrome.includes('href="#/')) {
  problems.push("Source still contains raw hash href links.");
}

const report = [
  "# Base URL and Mantine Typecheck Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Expected",
  "",
  "- Links must resolve under `/noctra/`.",
  "- Component pages must not link to root `/components/...`.",
  "- MantineStyleComponentDocs must not pass `undefined` to `Partial<DemoState>`.",
  "- All generated variants/sizes and standard tone sections must be rendered."
].join("\n");

writeFileSync("docs-base-url-audit-report.md", `${report}\n`, "utf8");

console.log(`Base URL and Mantine typecheck audit completed. Problems: ${problems.length}. Report: docs-base-url-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Base URL and Mantine typecheck audit failed with ${problems.length} problem(s).`);
}