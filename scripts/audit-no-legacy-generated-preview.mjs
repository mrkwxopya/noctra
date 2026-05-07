import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const detail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const main = readText("apps/docs/src/main.tsx");
const routing = readText("apps/docs/src/lib/docsRouting.ts");
const componentsPage = readText("apps/docs/src/pages/ComponentsPage.tsx");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");

const problems = [];

if (detail.includes("Generated usage preview")) {
  problems.push("ComponentDetailPage still contains Generated usage preview.");
}

if (detail.includes("GeneratedExample")) {
  problems.push("ComponentDetailPage still contains GeneratedExample.");
}

if (detail.includes("getComponentExamples")) {
  problems.push("ComponentDetailPage still imports or uses getComponentExamples.");
}

if (detail.includes("<ExampleBlock")) {
  problems.push("ComponentDetailPage still renders ExampleBlock.");
}

if (!detail.includes("<InteractiveComponentDemo component={component} />")) {
  problems.push("ComponentDetailPage does not render InteractiveComponentDemo.");
}

if (!detail.includes("Legacy generated previews and mock examples are disabled")) {
  problems.push("ComponentDetailPage does not declare legacy previews disabled.");
}

if (routing.includes("return `${base}#")) {
  problems.push("docsHref still returns hash links.");
}

if (main.includes('href="#/') || componentsPage.includes('href="#/') || chrome.includes('href="#/')) {
  problems.push("Raw hash href found in docs source.");
}

if (main.includes("/release#/components") || componentsPage.includes("/release#/components") || chrome.includes("/release#/components")) {
  problems.push("Broken release#/components route still exists.");
}

const report = [
  "# Legacy Generated Preview Cleanup Audit",
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
  "- Component detail pages use only `InteractiveComponentDemo` for live component demos.",
  "- Clean URLs use `/noctra/components/name`, not `#/components/name`.",
  "- Legacy generated previews and mock examples are not rendered on component pages."
].join("\n");

writeFileSync("docs-legacy-preview-cleanup-report.md", `${report}\n`, "utf8");

console.log(`Legacy preview cleanup audit completed. Problems: ${problems.length}. Report: docs-legacy-preview-cleanup-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Legacy preview cleanup audit failed with ${problems.length} problem(s).`);
}