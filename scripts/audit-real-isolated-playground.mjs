import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const files = {
  frame: "apps/docs/src/components/PreviewFrame.tsx",
  demo: "apps/docs/src/components/InteractiveComponentDemo.tsx",
  adapters: "apps/docs/src/data/realDemoAdapters.ts",
  detail: "apps/docs/src/pages/ComponentDetailPage.tsx",
  css: "apps/docs/src/docs.css"
};

const problems = [];
const warnings = [];

for (const [name, file] of Object.entries(files)) {
  if (!existsSync(file)) {
    problems.push(`Missing ${name}: ${file}`);
  }
}

const frame = readText(files.frame);
const demo = readText(files.demo);
const adapters = readText(files.adapters);
const detail = readText(files.detail);
const css = readText(files.css);

if (!frame.includes("createPortal")) {
  problems.push("PreviewFrame does not use createPortal.");
}

if (!frame.includes("iframe")) {
  problems.push("PreviewFrame does not render iframe.");
}

if (!demo.includes("PreviewFrame")) {
  problems.push("InteractiveComponentDemo does not use PreviewFrame.");
}

if (!demo.includes("createElement(RuntimeComponent")) {
  problems.push("InteractiveComponentDemo does not render real runtime component.");
}

if (!adapters.includes("Accordion")) {
  problems.push("realDemoAdapters.ts does not include Accordion adapter.");
}

if (!adapters.includes("items: docsItems") && !adapters.includes("items: optionItems")) {
  problems.push("realDemoAdapters.ts does not pass real items for item-based components.");
}

if (!detail.includes("InteractiveComponentDemo")) {
  problems.push("ComponentDetailPage does not render InteractiveComponentDemo.");
}

if (!detail.includes("Real isolated component playground")) {
  problems.push("ComponentDetailPage does not expose real isolated playground section.");
}

if (!detail.includes("Legacy generated previews and mock examples are disabled")) {
  warnings.push("ComponentDetailPage does not include the current legacy-preview-disabled explanation text.");
}

if (detail.includes("Generated usage preview")) {
  problems.push("ComponentDetailPage still contains Generated usage preview.");
}

if (detail.includes("GeneratedExample")) {
  problems.push("ComponentDetailPage still contains GeneratedExample.");
}

if (detail.includes("getComponentExamples")) {
  problems.push("ComponentDetailPage still imports getComponentExamples.");
}

if (detail.includes("<ExampleBlock")) {
  problems.push("ComponentDetailPage still renders old ExampleBlock demos.");
}

if (!css.includes(".nd-preview-frame")) {
  problems.push("docs.css missing iframe preview frame styles.");
}

if (!css.includes(".nd-real-demo")) {
  problems.push("docs.css missing real demo styles.");
}

const report = [
  "# Real Isolated Component Playground Audit",
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
  "## Interpretation",
  "",
  "- Component pages should render only the real isolated playground, not mock examples.",
  "- PreviewFrame isolates component preview from docs CSS through an iframe.",
  "- realDemoAdapters provides component API data for item-based, input, overlay, table, media, and feedback components."
].join("\n");

writeFileSync("docs-real-playground-audit-report.md", `${report}\n`, "utf8");

console.log(`Real isolated playground audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-real-playground-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Real isolated playground audit failed with ${problems.length} problem(s).`);
}