import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

const main = readText("apps/docs/src/main.tsx");
const bridge = readText("apps/docs/src/noctra-style-bridge.css");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");
const css = readText("apps/docs/src/docs.css");
const examples = readText("apps/docs/src/data/componentExamples.tsx");

const problems = [];
const warnings = [];

if (!existsSync("apps/docs/src/noctra-style-bridge.css")) {
  problems.push("Missing apps/docs/src/noctra-style-bridge.css");
}

if (!main.includes("./noctra-style-bridge.css")) {
  problems.push("main.tsx does not import noctra-style-bridge.css");
}

const importCount = countMatches(bridge, /@import\s+"/g);

if (importCount < 1) {
  problems.push("noctra-style-bridge.css has no @import rules for package styles");
}

if (!chrome.includes("ExampleRuntimeNotice")) {
  problems.push("DocsChrome.tsx is missing ExampleRuntimeNotice");
}

if (!chrome.includes("activeTab")) {
  problems.push("ExampleBlock does not expose preview/code runtime tabs");
}

if (!css.includes(".nd-example-canvas")) {
  problems.push("docs.css is missing .nd-example-canvas styles");
}

if (!css.includes(".nd-noctra-runtime")) {
  problems.push("docs.css is missing .nd-noctra-runtime styles");
}

const curatedPreviewCount = countMatches(examples, /preview:\s*\(/g);
const mockCount = countMatches(examples, /Mock[A-Z][A-Za-z]+/g);

if (curatedPreviewCount < 20) {
  warnings.push(`Curated preview count is low: ${curatedPreviewCount}`);
}

if (mockCount > 80) {
  warnings.push(`Mock helper usage is high: ${mockCount}. Replace mocks with real component previews over time.`);
}

const report = [
  "# Docs Example Runtime Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Style bridge imports: ${importCount}`,
  `Curated preview blocks: ${curatedPreviewCount}`,
  `Mock helper references: ${mockCount}`,
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
  "## Interpretation",
  "",
  "- Problems block docs publish.",
  "- Warnings mean the docs can improve, especially by replacing mock previews with real curated component previews.",
  "- This audit ensures examples have a runtime preview area and Noctra styles are loaded."
].join("\n");

writeFileSync("docs-example-runtime-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs example runtime audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-example-runtime-audit-report.md`);

if (problems.length > 0) {
  throw new Error(`Docs example runtime audit failed with ${problems.length} problem(s). See docs-example-runtime-audit-report.md`);
}