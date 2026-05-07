import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

function generatedNumber(text, key) {
  const quotedPattern = new RegExp('["\\\']' + key + '["\\\']\\s*:\\s*(\\d+)');
  const plainPattern = new RegExp(key + '\\s*:\\s*(\\d+)');
  const match = text.match(quotedPattern) ?? text.match(plainPattern);

  return match ? Number(match[1]) : 0;
}

function hasAny(text, values) {
  return values.some((value) => text.includes(value));
}

function extractRuntimeAdapterNames(text) {
  const names = new Set();

  for (const match of text.matchAll(/^\s{4}([A-Z][A-Za-z0-9]*)\s*:\s*\(\)\s*=>/gm)) {
    names.add(match[1]);
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

const requiredFiles = [
  "apps/docs/src/main.tsx",
  "apps/docs/src/docs.css",
  "apps/docs/src/components/DocsChrome.tsx",
  "apps/docs/src/components/PreviewFrame.tsx",
  "apps/docs/src/components/InteractiveComponentDemo.tsx",
  "apps/docs/src/pages/OverviewPage.tsx",
  "apps/docs/src/pages/ComponentsPage.tsx",
  "apps/docs/src/pages/ComponentDetailPage.tsx",
  "apps/docs/src/pages/ArchitecturePage.tsx",
  "apps/docs/src/pages/ThemingPage.tsx",
  "apps/docs/src/pages/QualityPage.tsx",
  "apps/docs/src/pages/ReleasePage.tsx",
  "apps/docs/src/data/propDescriptions.ts",
  "apps/docs/src/data/realDemoAdapters.ts",
  "apps/docs/src/generated/noctra-professional-docs.generated.ts",
  "apps/docs/src/lib/docsRouting.ts",
  "scripts/generate-professional-docs-data.mjs"
];

const main = readText("apps/docs/src/main.tsx");
const css = readText("apps/docs/src/docs.css");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");
const frame = readText("apps/docs/src/components/PreviewFrame.tsx");
const runtimeDemo = readText("apps/docs/src/components/InteractiveComponentDemo.tsx");
const realAdapters = readText("apps/docs/src/data/realDemoAdapters.ts");
const detail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const componentsPage = readText("apps/docs/src/pages/ComponentsPage.tsx");
const propText = readText("apps/docs/src/data/propDescriptions.ts");
const generatedText = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
const routing = readText("apps/docs/src/lib/docsRouting.ts");

const generatedComponentCount = generatedNumber(generatedText, "componentCount");
const generatedPropCount = generatedNumber(generatedText, "propCount");
const generatedTokenCount = generatedNumber(generatedText, "tokenCount");
const propDescriptionCount = countMatches(propText, /description:\s*"/g);
const adapterNames = extractRuntimeAdapterNames(realAdapters);

const problems = [];
const warnings = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    problems.push(`Missing required docs file: ${file}`);
  }
}

const routeChecks = [
  ["overview route", main.includes("OverviewPage")],
  ["components route", main.includes("ComponentsPage")],
  ["component detail route", main.includes("ComponentDetailPage")],
  ["architecture route", main.includes("ArchitecturePage")],
  ["theming route", main.includes("ThemingPage")],
  ["quality route", main.includes("QualityPage")],
  ["release route", main.includes("ReleasePage")]
];

for (const [label, ok] of routeChecks) {
  if (!ok) problems.push(`Missing docs route check: ${label}`);
}

const featureChecks = [
  ["copy button", chrome.includes("CopyButton")],
  ["anchor list", chrome.includes("AnchorList")],
  ["coverage meter", chrome.includes("CoverageMeter")],
  ["props metadata", detail.includes("getPropDescription") && propText.includes("commonPropDescriptions")],
  ["related components", detail.includes("relatedComponents")],
  ["generated docs data", generatedText.includes("noctraDocsComponents")],
  ["clean path routing", routing.includes("docsHref") && routing.includes("canonicalizeDocsCleanRoute")],
  ["internal link interception", main.includes("isInternalDocsUrl") && main.includes("window.history.pushState")],
  ["real isolated playground", detail.includes("InteractiveComponentDemo")],
  ["preview iframe", frame.includes("iframe") && frame.includes("createPortal")],
  ["real runtime render", runtimeDemo.includes("createElement(RuntimeComponent")],
  ["real demo adapters", realAdapters.includes("createRealDemoAdapter") || realAdapters.includes("function createRealDemoAdapter")],
  ["component API presets", hasAny(realAdapters, ["items: docsItems", "items: optionItems"]) && hasAny(realAdapters, ["columns: tableColumns", "rows: tableRows"])],
  ["preview frame styles", css.includes(".nd-preview-frame")],
  ["real demo styles", css.includes(".nd-real-demo")]
];

for (const [label, ok] of featureChecks) {
  if (!ok) problems.push(`Missing professional docs feature: ${label}`);
}

if (generatedComponentCount < 100) {
  problems.push(`Generated docs component count is too low: ${generatedComponentCount}`);
}

if (propDescriptionCount < 50) {
  warnings.push(`Prop description metadata count is lower than ideal: ${propDescriptionCount}`);
}

if (generatedPropCount < 1) {
  warnings.push(`Generated prop count looks low: ${generatedPropCount}`);
}

if (generatedTokenCount < 1) {
  warnings.push(`Generated token count looks low: ${generatedTokenCount}`);
}

if (adapterNames.length < 15) {
  warnings.push(`Named real demo adapter count is low: ${adapterNames.length}. Universal adapter still covers all generated components.`);
}

if (detail.includes("<ExampleBlock")) {
  warnings.push("ComponentDetailPage still references old ExampleBlock demos. Real playground is the primary standard now.");
}

if (detail.includes("getComponentExamples")) {
  warnings.push("ComponentDetailPage still references old componentExamples registry. Real playground is the primary standard now.");
}

if (componentsPage.includes('href="#/')) {
  problems.push("ComponentsPage still contains raw hash links.");
}

if (componentsPage.includes("`#/components/")) {
  problems.push("ComponentsPage still contains raw template hash component links.");
}

if (main.includes("/release#/components")) {
  problems.push("main.tsx still contains broken /release#/components pattern.");
}

const report = [
  "# Noctra Professional Docs Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Required files checked: ${requiredFiles.length}`,
  `Generated components: ${generatedComponentCount}`,
  `Generated props: ${generatedPropCount}`,
  `Generated tokens: ${generatedTokenCount}`,
  `Prop descriptions: ${propDescriptionCount}`,
  `Named real demo adapters: ${adapterNames.length}`,
  `Runtime demo coverage: ${generatedComponentCount}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Required Files",
  "",
  ...requiredFiles.map((file) => `- ${existsSync(file) ? "OK" : "MISSING"} ${file}`),
  "",
  "## Route Checks",
  "",
  ...routeChecks.map(([label, ok]) => `- ${ok ? "OK" : "MISSING"} ${label}`),
  "",
  "## Feature Checks",
  "",
  ...featureChecks.map(([label, ok]) => `- ${ok ? "OK" : "MISSING"} ${label}`),
  "",
  "## Real Demo Adapters",
  "",
  ...(adapterNames.length > 0 ? adapterNames.map((name) => `- ${name}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Publish Interpretation",
  "",
  "- Problems must be zero before GitHub Pages or npm release.",
  "- Warnings are acceptable during alpha docs hardening.",
  "- Current docs standard: real isolated component playground, clean path routing, generated props/tokens/anatomy, and premium static docs pages."
].join("\n");

writeFileSync("professional-docs-audit-report.md", `${report}\n`, "utf8");

console.log(`Professional docs audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: professional-docs-audit-report.md`);

if (problems.length > 0) {
  console.log("");
  console.log("Professional docs audit problems:");
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }
  console.log("");
  throw new Error(`Professional docs audit failed with ${problems.length} problem(s). See professional-docs-audit-report.md`);
}