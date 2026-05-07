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
  const quotedMatch = text.match(quotedPattern);
  const plainMatch = text.match(plainPattern);
  const match = quotedMatch ?? plainMatch;

  return match ? Number(match[1]) : 0;
}

function extractRegistryComponentNames(text) {
  const names = new Set();
  const registryStart = text.indexOf("export const componentExamples");

  if (registryStart === -1) return [];

  const registryText = text.slice(registryStart);

  for (const match of registryText.matchAll(/^\s{2}([A-Z][A-Za-z0-9]*)\s*:/gm)) {
    names.add(match[1]);
  }

  for (const match of registryText.matchAll(/^\s{2}([A-Z][A-Za-z0-9]*)\s*:/gm)) {
    names.add(match[1]);
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

const requiredFiles = [
  "apps/docs/src/main.tsx",
  "apps/docs/src/docs.css",
  "apps/docs/src/components/DocsChrome.tsx",
  "apps/docs/src/pages/OverviewPage.tsx",
  "apps/docs/src/pages/ComponentsPage.tsx",
  "apps/docs/src/pages/ComponentDetailPage.tsx",
  "apps/docs/src/pages/ArchitecturePage.tsx",
  "apps/docs/src/pages/ThemingPage.tsx",
  "apps/docs/src/pages/QualityPage.tsx",
  "apps/docs/src/pages/ReleasePage.tsx",
  "apps/docs/src/data/componentExamples.tsx",
  "apps/docs/src/data/propDescriptions.ts",
  "apps/docs/src/generated/noctra-professional-docs.generated.ts",
  "scripts/generate-professional-docs-data.mjs"
];

const coreComponents = [
  "Button",
  "Card",
  "Paper",
  "Stack",
  "Group",
  "Grid",
  "Flex",
  "Box",
  "Divider",
  "Spacer",
  "Section",
  "Alert",
  "Badge",
  "TextInput",
  "Textarea",
  "Select",
  "Checkbox",
  "Switch",
  "Radio",
  "Modal",
  "Drawer",
  "Tabs",
  "Table",
  "Accordion",
  "Tooltip",
  "Progress",
  "Skeleton",
  "CodeBlock"
];

const main = readText("apps/docs/src/main.tsx");
const css = readText("apps/docs/src/docs.css");
const chrome = readText("apps/docs/src/components/DocsChrome.tsx");
const detail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const examplesText = readText("apps/docs/src/data/componentExamples.tsx");
const propText = readText("apps/docs/src/data/propDescriptions.ts");
const generatedText = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");

const exampleComponents = extractRegistryComponentNames(examplesText);
const missingFiles = requiredFiles.filter((file) => !existsSync(file));
const missingCoreExamples = coreComponents.filter((name) => !examplesText.includes(`${name}: [`));

const routeChecks = [
  ["overview route", main.includes("OverviewPage")],
  ["components route", main.includes("ComponentsPage")],
  ["component detail route", main.includes("ComponentDetailPage")],
  ["architecture route", main.includes("ArchitecturePage")],
  ["theming route", main.includes("ThemingPage")],
  ["quality route", main.includes("QualityPage")],
  ["release route", main.includes("ReleasePage")]
];

const featureChecks = [
  ["copy button", chrome.includes("CopyButton")],
  ["example block", chrome.includes("ExampleBlock")],
  ["anchor list", chrome.includes("AnchorList")],
  ["coverage meter", chrome.includes("CoverageMeter")],
  ["component showcase", detail.includes("Showcase") && detail.includes("ExampleBlock")],
  ["props metadata", detail.includes("getPropDescription") && propText.includes("commonPropDescriptions")],
  ["related components", detail.includes("relatedComponents")],
  ["generated docs data", generatedText.includes("noctraDocsComponents")],
  ["docs CSS preview styles", css.includes(".nd-preview")],
  ["docs CSS responsive detail layout", css.includes("@media (max-width:1100px)")],
  ["professional docs data generator", existsSync("scripts/generate-professional-docs-data.mjs")]
];

const generatedComponentCount = generatedNumber(generatedText, "componentCount");
const generatedPropCount = generatedNumber(generatedText, "propCount");
const generatedTokenCount = generatedNumber(generatedText, "tokenCount");
const curatedExampleCount = countMatches(examplesText, /id:\s*"/g);
const propDescriptionCount = countMatches(propText, /description:\s*"/g);

const problems = [];
const warnings = [];

for (const file of missingFiles) {
  problems.push(`Missing required docs file: ${file}`);
}

for (const [label, ok] of routeChecks) {
  if (!ok) problems.push(`Missing docs route check: ${label}`);
}

for (const [label, ok] of featureChecks) {
  if (!ok) problems.push(`Missing professional docs feature: ${label}`);
}

if (generatedComponentCount < 100) {
  problems.push(`Generated docs component count is too low: ${generatedComponentCount}`);
}

if (curatedExampleCount < 25) {
  problems.push(`Curated docs example count is too low: ${curatedExampleCount}`);
}

if (propDescriptionCount < 60) {
  problems.push(`Prop description metadata count is too low: ${propDescriptionCount}`);
}

if (generatedPropCount < 1) {
  warnings.push(`Generated prop count looks low: ${generatedPropCount}`);
}

if (generatedTokenCount < 1) {
  warnings.push(`Generated token count looks low: ${generatedTokenCount}`);
}

for (const name of missingCoreExamples) {
  warnings.push(`Core component has no curated example yet: ${name}`);
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
  `Curated example components: ${exampleComponents.length}`,
  `Curated examples: ${curatedExampleCount}`,
  `Prop descriptions: ${propDescriptionCount}`,
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
  "## Curated Example Components",
  "",
  ...(exampleComponents.length > 0 ? exampleComponents.map((name) => `- ${name}`) : ["- None"]),
  "",
  "## Missing Core Examples",
  "",
  ...(missingCoreExamples.length > 0 ? missingCoreExamples.map((name) => `- ${name}`) : ["- None"]),
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
  "- Problems should be zero before GitHub publish.",
  "- Warnings are acceptable for alpha docs, but should be reduced before a stable v1 docs release.",
  "- This audit checks professional docs structure, not visual perfection."
].join("\n");

writeFileSync("professional-docs-audit-report.md", `${report}\n`, "utf8");

console.log(`Professional docs audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: professional-docs-audit-report.md`);

if (problems.length > 0) {
  console.error("Professional docs audit problems:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }

  throw new Error(`Professional docs audit failed with ${problems.length} problem(s). See professional-docs-audit-report.md`);
}