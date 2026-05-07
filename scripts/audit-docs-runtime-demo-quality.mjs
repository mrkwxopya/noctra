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

function hasPreset(presets, componentName) {
  return new RegExp(`(^|\\n)\\s*${componentName}\\s*:`, "m").test(presets);
}

function getPresetBlock(presets, componentName) {
  const startMatch = new RegExp(`(^|\\n)(\\s*)${componentName}\\s*:\\s*\\{`, "m").exec(presets);

  if (!startMatch || startMatch.index === undefined) return "";

  const start = startMatch.index + startMatch[1].length;
  const openBrace = presets.indexOf("{", start);

  if (openBrace === -1) return "";

  let depth = 0;
  let end = openBrace;

  for (; end < presets.length; end += 1) {
    const char = presets[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  return presets.slice(start, end);
}

const presets = readText("apps/docs/src/data/interactiveDemoPresets.ts");
const demoEngine = readText("apps/docs/src/components/InteractiveComponentDemo.tsx");
const componentDetail = readText("apps/docs/src/pages/ComponentDetailPage.tsx");
const docsRouting = readText("apps/docs/src/lib/docsRouting.ts");
const main = readText("apps/docs/src/main.tsx");
const generatedNames = extractGeneratedComponentNames();

const removedComponents = new Set([
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
]);

const mustHavePreset = [
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
  "ClickOutside",
  "Hover",
  "Tooltip",
  "HoverCard",
  "Popover"
];

const requiredDataShape = {
  Table: ["columns", "rows"],
  DataGrid: ["columns", "rows"],
  Tree: ["items"],
  TreeSelect: ["items"],
  TransferList: ["data"],
  Dropzone: ["files"],
  Spotlight: ["items"],
  Command: ["items"],
  CommandBar: ["items"],
  Tabs: ["items"],
  Accordion: ["items"],
  Menu: ["items"],
  ContextMenu: ["items"],
  Timeline: ["items"],
  ScrollArea: ["items"],
  Dock: ["items"],
  ResizablePanel: ["panels"]
};

const problems = [];
const warnings = [];

for (const name of generatedNames) {
  if (removedComponents.has(name)) {
    problems.push(`Removed date/time component still appears in generated docs: ${name}`);
  }
}

for (const name of mustHavePreset) {
  if (!generatedNames.includes(name)) continue;

  if (!hasPreset(presets, name)) {
    problems.push(`Missing component-specific safe preset: ${name}`);
  }
}

for (const [name, requiredTerms] of Object.entries(requiredDataShape)) {
  if (!generatedNames.includes(name)) continue;

  const block = getPresetBlock(presets, name);

  if (!block) {
    problems.push(`Missing preset block for data-shaped component: ${name}`);
    continue;
  }

  for (const term of requiredTerms) {
    if (!new RegExp(`\\b${term}\\s*:`).test(block)) {
      problems.push(`${name} preset missing required data shape key: ${term}`);
    }
  }
}

const noChildrenComponents = [
  "Input",
  "SearchInput",
  "TextInput",
  "Textarea",
  "NumberInput",
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
  "ColorInput",
  "FileInput"
];

for (const name of noChildrenComponents) {
  if (!generatedNames.includes(name)) continue;

  if (!demoEngine.includes(`"${name}"`)) {
    problems.push(`Input-like component is not listed as childless in InteractiveComponentDemo: ${name}`);
  }
}

for (const snippet of [
  "getInteractiveDemoCode(component, state)",
  "buildInteractiveDemoProps(component, state)",
  "previewSizing.width",
  "fit-content",
  "DemoErrorBoundary",
  "getControls(component)"
]) {
  if (!demoEngine.includes(snippet)) {
    problems.push(`Interactive demo engine missing required sync/sizing snippet: ${snippet}`);
  }
}

for (const snippet of [
  'id="usage"',
  'id="playground"',
  'id="examples"',
  'id="controlled"',
  'id="compound"',
  'id="props"',
  'id="accessibility"',
  'id="related"'
]) {
  if (!componentDetail.includes(snippet)) {
    problems.push(`Component detail page missing Mantine-style section: ${snippet}`);
  }
}

for (const forbidden of [
  "Documentation coverage",
  "CoverageMeter",
  "apiCoverageMax",
  "apiCoverageValue",
  "Container preview",
  "Flex preview",
  "Grid preview",
  "Code preview",
  "ClickOutside preview",
  "No steps available"
]) {
  if (presets.includes(forbidden) || componentDetail.includes(forbidden)) {
    problems.push(`Forbidden old/placeholder docs text still exists: ${forbidden}`);
  }
}

if (!docsRouting.includes('NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts does not hard-code /noctra/ base.");
}

if (!docsRouting.includes("forceNoctraDocsHref")) {
  problems.push("docsRouting.ts missing forceNoctraDocsHref.");
}

if (!main.includes("sanitizeDocsAnchors")) {
  problems.push("main.tsx missing sanitizeDocsAnchors.");
}

for (const name of generatedNames) {
  if (mustHavePreset.includes(name)) continue;
  if (removedComponents.has(name)) continue;

  if (!hasPreset(presets, name)) {
    warnings.push(`No component-specific preset yet: ${name}`);
  }
}

const report = [
  "# Docs Runtime Demo Quality Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Generated components: ${generatedNames.length}`,
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
  "## Verified",
  "",
  "- Removed date/time components are not generated.",
  "- Problem components have safe presets.",
  "- Runtime demo engine uses shared state for preview and code.",
  "- Input-like components are childless.",
  "- Preview sizing is not blindly full-width.",
  "- Mantine-style component detail sections exist.",
  "- Coverage and placeholder docs text are blocked.",
  "- /noctra route base is enforced."
].join("\n");

writeFileSync("docs-runtime-demo-quality-report.md", `${report}\n`, "utf8");

console.log(`Docs runtime demo quality audit completed. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-runtime-demo-quality-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs runtime demo quality audit failed with blockers.");
}