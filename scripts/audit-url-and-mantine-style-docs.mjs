import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const routing = readText("apps/docs/src/lib/docsRouting.ts");
const vite = readText("apps/docs/vite.config.ts");
const detail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const mantine = readText("apps/docs/src/components/MantineStyleComponentDocs.tsx");
const components = readText("apps/docs/src/pages/ComponentsPage.tsx");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");
const css = readText("apps/docs/src/docs.css");

const problems = [];

if (!existsSync("apps/docs/src/components/MantineStyleComponentDocs.tsx")) {
  problems.push("Missing MantineStyleComponentDocs.tsx.");
}

if (!vite.includes('"/noctra/"')) {
  problems.push("vite.config.ts does not force /noctra/ base.");
}

if (!routing.includes('"/noctra/"')) {
  problems.push("docsRouting.ts does not fallback to /noctra/.");
}

if (!routing.includes('pathname === "/components"')) {
  problems.push("docsRouting.ts does not canonicalize accidental root /components links.");
}

if (routing.includes("return `${base}#")) {
  problems.push("docsHref still creates hash links.");
}

if (!detail.includes("MantineStyleComponentDocs")) {
  problems.push("ComponentDetailPage does not render MantineStyleComponentDocs.");
}

if (!mantine.includes("variants.map")) {
  problems.push("MantineStyleComponentDocs does not render all variants.");
}

if (!mantine.includes("sizes.map")) {
  problems.push("MantineStyleComponentDocs does not render all sizes.");
}

if (!mantine.includes("tones.map")) {
  problems.push("MantineStyleComponentDocs does not render all tones.");
}

if (!mantine.includes("PreviewFrame")) {
  problems.push("MantineStyleComponentDocs does not use PreviewFrame.");
}

if (components.includes("`#/components/")) {
  problems.push("ComponentsPage still contains raw template hash component links.");
}

if (components.includes('href="#/') || chrome.includes('href="#/')) {
  problems.push("Source still contains raw hash href links.");
}

if (!css.includes(".nd-ms-docs")) {
  problems.push("docs.css missing Mantine-style docs styles.");
}

const report = [
  "# Docs URL and Mantine-Style Documentation Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Required Behavior",
  "",
  "- Component links must use `/noctra/components/button`.",
  "- Root `/components/button` must canonicalize to `/noctra/components/button`.",
  "- Component docs must render Mantine-style sections.",
  "- Variants, sizes, tones, radius, and density groups must render all available generated values."
].join("\n");

writeFileSync("docs-url-and-mantine-style-report.md", `${report}\n`, "utf8");

console.log(`Docs URL and Mantine-style audit completed. Problems: ${problems.length}. Report: docs-url-and-mantine-style-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Docs URL and Mantine-style audit failed with ${problems.length} problem(s).`);
}
