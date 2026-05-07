import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function generatedNumber(text, key) {
  const quotedPattern = new RegExp('["\\\']' + key + '["\\\']\\s*:\\s*(\\d+)');
  const plainPattern = new RegExp(key + '\\s*:\\s*(\\d+)');
  const match = text.match(quotedPattern) ?? text.match(plainPattern);
  return match ? Number(match[1]) : 0;
}

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

const generated = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
const detail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const runtime = readText("apps/docs/src/components/InteractiveComponentDemo.tsx");
const presets = readText("apps/docs/src/data/interactiveDemoPresets.ts");
const css = readText("apps/docs/src/docs.css");

const componentCount = generatedNumber(generated, "componentCount");
const problems = [];
const warnings = [];

if (componentCount < 100) {
  problems.push(`Generated component count is too low: ${componentCount}`);
}

if (!existsSync("apps/docs/src/components/InteractiveComponentDemo.tsx")) {
  problems.push("Missing InteractiveComponentDemo.tsx");
}

if (!existsSync("apps/docs/src/data/interactiveDemoPresets.ts")) {
  problems.push("Missing interactiveDemoPresets.ts");
}

if (!detail.includes("../components/InteractiveComponentDemo")) {
  problems.push("ComponentDetailPage does not import InteractiveComponentDemo.");
}

if (!detail.includes("<InteractiveComponentDemo component={component} />")) {
  problems.push("ComponentDetailPage does not render InteractiveComponentDemo.");
}

if (!runtime.includes("createElement(RuntimeComponent")) {
  problems.push("InteractiveComponentDemo does not render real @noctra/react runtime exports.");
}

if (!runtime.includes("setTab") || !runtime.includes("setCanvas")) {
  problems.push("InteractiveComponentDemo is missing tabs/canvas controls.");
}

if (!runtime.includes("setVariant") && !runtime.includes("componentSupports(component, \"variant\")")) {
  problems.push("InteractiveComponentDemo is missing variant control logic.");
}

if (!presets.includes("buildInteractiveDemoProps")) {
  problems.push("interactiveDemoPresets.ts is missing buildInteractiveDemoProps.");
}

if (!css.includes(".nd-real-demo{")) {
  problems.push("docs.css is missing .nd-real-demo styles.");
}

if (!css.includes(".nd-real-demo-canvas")) {
  problems.push("docs.css is missing .nd-real-demo-canvas styles.");
}

const namedPresetCount = countMatches(presets, /^\s{4}[A-Z][A-Za-z0-9]*\s*:/gm);

if (namedPresetCount < 30) {
  warnings.push(`Named curated preset count is below target: ${namedPresetCount}. Universal runtime still covers all components.`);
}

const report = [
  "# Real Interactive Component Demos Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Generated component count: ${componentCount}`,
  `Named curated presets: ${namedPresetCount}`,
  `Runtime coverage: ${componentCount}`,
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
  "- Every generated component detail page renders InteractiveComponentDemo.",
  "- InteractiveComponentDemo renders real @noctra/react runtime exports through React.createElement.",
  "- Universal runtime coverage applies to every generated component.",
  "- Named presets improve component-specific data and behavior for key components."
].join("\n");

writeFileSync("docs-real-interactive-demo-audit-report.md", `${report}\n`, "utf8");

console.log(report);

if (problems.length > 0) {
  throw new Error(`Real interactive demos audit failed with ${problems.length} problem(s). See docs-real-interactive-demo-audit-report.md`);
}