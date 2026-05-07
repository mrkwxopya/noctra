import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function extractGeneratedComponentNames() {
  const generated = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
  const names = new Set();

  for (const match of generated.matchAll(/name:\s*"([A-Z][A-Za-z0-9]*)"/g)) {
    if (match[1]) names.add(match[1]);
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

const problems = [];
const warnings = [];

const componentDetail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const presets = readText("apps/docs/src/data/interactiveDemoPresets.ts");
const routing = readText("apps/docs/src/lib/docsRouting.ts");
const main = readText("apps/docs/src/main.tsx");
const generated = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");

const removedComponents = [
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
];

for (const name of removedComponents) {
  if (new RegExp(`name:\\s*"${name}"`).test(generated)) {
    problems.push(`Removed component still exists in generated docs data: ${name}`);
  }

  if (new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m").test(presets)) {
    problems.push(`Removed component still exists as interactive preset key: ${name}`);
  }
}

for (const term of ["Documentation coverage", "CoverageMeter", "apiCoverageMax", "apiCoverageValue"]) {
  if (componentDetail.includes(term)) {
    problems.push(`Public component detail page still contains coverage term: ${term}`);
  }
}

if (!routing.includes('NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts must hard-code /noctra/ base.");
}

if (!routing.includes("forceNoctraDocsHref")) {
  problems.push("docsRouting.ts missing forceNoctraDocsHref.");
}

if (!main.includes("sanitizeDocsAnchors")) {
  problems.push("main.tsx must sanitize docs anchors.");
}

const genericControlPattern = /controls:\s*\[\s*["']Canvas["']\s*,\s*["']center["']\s*,\s*["']Variant["']\s*,\s*["']Tone["']\s*,\s*["']Size["']\s*,\s*["']Radius["']\s*,\s*["']Density["']\s*\]/i;

if (genericControlPattern.test(presets)) {
  problems.push("Interactive presets still contain universal generic controls.");
}

const requiredPresetCandidates = [
  "Input",
  "SearchInput",
  "TextInput",
  "Textarea",
  "NumberInput",
  "ListBox",
  "Select",
  "MultiSelect",
  "Combobox",
  "Autocomplete",
  "TagsInput",
  "Checkbox",
  "Radio",
  "Switch",
  "Slider",
  "Pagination",
  "Tabs",
  "Accordion",
  "Menu",
  "ContextMenu",
  "Command",
  "CommandBar",
  "Spotlight",
  "Tree",
  "TreeSelect",
  "TransferList",
  "Dropzone",
  "Modal",
  "Drawer",
  "Dialog",
  "Table",
  "DataGrid",
  "TableOfContents",
  "Timeline",
  "Toolbar",
  "Anchor",
  "Avatar",
  "Clipboard",
  "Code",
  "ColorInput",
  "CreditCard",
  "FileInput",
  "FloatLabel",
  "Container",
  "Flex",
  "Grid",
  "ResizablePanel",
  "SplitPane",
  "ScrollArea",
  "ScrollLock",
  "Skeleton",
  "VisuallyHidden",
  "Dock",
  "ClickOutside"
];

const generatedNames = extractGeneratedComponentNames();

for (const name of requiredPresetCandidates) {
  if (!generatedNames.includes(name)) continue;

  const hasPreset = new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m").test(presets);

  if (!hasPreset) {
    warnings.push(`Generated component needs component-specific safe preset: ${name}`);
  }
}

const bannedPlaceholderTexts = [
  "Container preview",
  "Flex preview",
  "Grid preview",
  "Code preview",
  "ClickOutside preview",
  "No steps available"
];

for (const item of bannedPlaceholderTexts) {
  if (presets.includes(item) || componentDetail.includes(item)) {
    warnings.push(`Placeholder-style docs text still exists: ${item}`);
  }
}

const requiredApiExports = [
  "buildInteractiveDemoProps",
  "componentSupports",
  "getInteractiveDemoCode",
  "getInteractiveDemoPreset"
];

for (const exportName of requiredApiExports) {
  if (!presets.includes(`export function ${exportName}`)) {
    problems.push(`interactiveDemoPresets.ts missing export: ${exportName}`);
  }
}

const report = [
  "# Docs Mantine-Style Audit Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  `Generated components: ${generatedNames.length}`,
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
  "- Problems are blockers.",
  "- Warnings identify remaining component-specific docs work.",
  "- Missing safe presets should be completed in the next dedicated docs implementation step."
].join("\n");

writeFileSync("docs-mantine-style-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs Mantine-style audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-mantine-style-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs Mantine-style audit failed with blockers.");
}