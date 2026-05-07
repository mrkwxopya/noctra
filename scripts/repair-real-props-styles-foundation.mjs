import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const reportPath = "real-props-styles-foundation-repair-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceBlockBetween(source, startNeedle, endNeedle, replacement) {
  const start = source.indexOf(startNeedle);

  if (start < 0) {
    throw new Error(`Start marker not found: ${startNeedle}`);
  }

  const end = source.indexOf(endNeedle, start + startNeedle.length);

  if (end < 0) {
    throw new Error(`End marker not found after ${startNeedle}: ${endNeedle}`);
  }

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end)}`;
}

function replaceFunctionByNext(source, name, nextName, replacement) {
  return replaceBlockBetween(
    source,
    `function ${name}`,
    `function ${nextName}`,
    `${replacement.trimEnd()}\n\n`
  );
}

let page = readText(pagePath);
const before = page;

const componentDocKind = `type ComponentDocKind =
  | "button-like"
  | "field"
  | "selection"
  | "choice"
  | "surface"
  | "feedback"
  | "inline-display"
  | "avatar"
  | "meter"
  | "data"
  | "tabs"
  | "accordion"
  | "breadcrumb"
  | "pagination"
  | "timeline"
  | "overlay"
  | "spinner"
  | "skeleton"
  | "layout"
  | "tree"
  | "special";

function getComponentDocKind(slug: string): ComponentDocKind {
  if (/button|icon-button|clipboard|link|toolbar|command|command-bar/.test(slug)) return "button-like";
  if (/checkbox|radio|switch/.test(slug)) return "choice";
  if (/text-input|input|search-input|password-input|number-input|color-input|textarea|autocomplete|tags-input|pin-code|pin-input|float-label|form-field/.test(slug)) return "field";
  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list|segmented-control/.test(slug)) return "selection";
  if (/card|paper|box|container|credit-card/.test(slug)) return "surface";
  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) return "feedback";
  if (/badge|code|inline-code|kbd|highlight|prose/.test(slug)) return "inline-display";
  if (/avatar/.test(slug)) return "avatar";
  if (/slider|range-slider|progress|rating|color-picker/.test(slug)) return "meter";
  if (/table|data-grid|table-of-contents/.test(slug)) return "data";
  if (/tabs/.test(slug)) return "tabs";
  if (/accordion/.test(slug)) return "accordion";
  if (/breadcrumb|breadcrumbs/.test(slug)) return "breadcrumb";
  if (/pagination/.test(slug)) return "pagination";
  if (/timeline|stepper/.test(slug)) return "timeline";
  if (/modal|dialog|drawer|popover|hover-card|tooltip|menu|context-menu|portal/.test(slug)) return "overlay";
  if (/loader|spinner/.test(slug)) return "spinner";
  if (/skeleton/.test(slug)) return "skeleton";
  if (/grid|simple-grid|group|stack|flex|center|layout|layout-shell|app-shell|split-pane|resizable-panel|section|page|sidebar|dock|header|footer|aspect-ratio|divider|spacer|scroll-area|status-bar/.test(slug)) return "layout";
  if (/tree|tree-view/.test(slug)) return "tree";

  return "special";
}`;

if (page.includes("function getComponentDocKind")) {
  page = replaceBlockBetween(page, page.includes("type ComponentDocKind") ? "type ComponentDocKind" : "function getComponentDocKind", "function runtimeComponent", `${componentDocKind}\n\n`);
} else {
  const runtimeIndex = page.indexOf("function runtimeComponent");

  if (runtimeIndex < 0) {
    throw new Error("function runtimeComponent marker not found.");
  }

  page = `${page.slice(0, runtimeIndex)}${componentDocKind}\n\n${page.slice(runtimeIndex)}`;
}

const buildCode = `function buildCode(slug: string, label: string, state: VisualState) {
  const name = pascalCase(slug);
  const kind = getComponentDocKind(slug);
  const lines: string[] = [];

  lines.push(\`import { \${name} } from "@noctra/react";\`);
  lines.push("");
  lines.push("export function Demo() {");
  lines.push("  return (");

  if (kind === "field") {
    lines.push(\`    <\${name}\`);
    lines.push(\`      label="\${label}"\`);
    lines.push('      placeholder="Enter value"');
    lines.push('      description="Helpful description"');
    lines.push(\`      size="\${state.size}"\`);
    lines.push(\`      radius="\${state.radius}"\`);
    lines.push("    />");
  } else if (kind === "selection") {
    lines.push(\`    <\${name}\`);
    lines.push(\`      label="\${label}"\`);
    lines.push('      placeholder="Pick one"');
    lines.push('      data={["Documentation", "Components", "Styles API"]}');
    lines.push(\`      size="\${state.size}"\`);
    lines.push(\`      radius="\${state.radius}"\`);
    lines.push("    />");
  } else if (kind === "overlay") {
    lines.push(\`    <\${name} opened title="\${label}" onClose={() => {}}>\`);
    lines.push("      Layered content goes here.");
    lines.push(\`    </\${name}>\`);
  } else if (kind === "surface") {
    lines.push(\`    <\${name} withBorder padding="md" radius="\${state.radius}">\`);
    lines.push(\`      <strong>\${label}</strong>\`);
    lines.push("      <p>Structured content surface.</p>");
    lines.push(\`    </\${name}>\`);
  } else if (kind === "data") {
    lines.push(\`    <\${name}>\`);
    lines.push("      <thead>");
    lines.push("        <tr><th>Name</th><th>Status</th></tr>");
    lines.push("      </thead>");
    lines.push("      <tbody>");
    lines.push("        <tr><td>Noctra UI</td><td>Ready</td></tr>");
    lines.push("      </tbody>");
    lines.push(\`    </\${name}>\`);
  } else if (kind === "tabs") {
    lines.push(\`    <\${name} defaultValue="documentation">\`);
    lines.push(\`      <\${name}.List>\`);
    lines.push(\`        <\${name}.Tab value="documentation">Documentation</\${name}.Tab>\`);
    lines.push(\`        <\${name}.Tab value="props">Props</\${name}.Tab>\`);
    lines.push(\`      </\${name}.List>\`);
    lines.push(\`    </\${name}>\`);
  } else if (kind === "feedback") {
    lines.push(\`    <\${name} tone="\${state.tone}" title="\${label}">\`);
    lines.push("      Feedback message content.");
    lines.push(\`    </\${name}>\`);
  } else if (kind === "layout") {
    lines.push(\`    <\${name} gap="md">\`);
    lines.push("      <div>Header</div>");
    lines.push("      <div>Content</div>");
    lines.push(\`    </\${name}>\`);
  } else {
    lines.push(\`    <\${name}\`);
    lines.push(\`      variant="\${state.variant}"\`);
    lines.push(\`      tone="\${state.tone}"\`);
    lines.push(\`      size="\${state.size}"\`);
    lines.push(\`      radius="\${state.radius}"\`);
    lines.push("    >");
    lines.push(\`      \${label}\`);
    lines.push(\`    </\${name}>\`);
  }

  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\\n");
}`;

const createPropsRows = `function createPropsRows(slug: string, label: string): readonly NoctraDocsPropRow[] {
  const kind = getComponentDocKind(slug);

  const commonRows: NoctraDocsPropRow[] = [
    { name: "className", type: "string", defaultValue: "—", description: "Adds a class to the root element." },
    { name: "style", type: "CSSProperties", defaultValue: "—", description: "Adds inline styles to the root element." },
    { name: "children", type: "ReactNode", defaultValue: "—", description: "Main rendered content." }
  ];

  if (kind === "button-like") {
    return [
      { name: "variant", type: "filled | light | outline | subtle | ghost", defaultValue: "filled", description: "Controls button visual treatment." },
      { name: "tone", type: "primary | neutral | success | warning | danger | info", defaultValue: "primary", description: "Controls semantic color tone." },
      { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls height, padding and typography." },
      { name: "radius", type: "none | sm | md | lg | xl | full", defaultValue: "md", description: "Controls border radius." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Shows loading state and disables interaction." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: \`Disables the \${label} interaction.\` },
      { name: "leftSection", type: "ReactNode", defaultValue: "—", description: "Content rendered before the label." },
      { name: "rightSection", type: "ReactNode", defaultValue: "—", description: "Content rendered after the label." },
      ...commonRows
    ];
  }

  if (kind === "field") {
    return [
      { name: "label", type: "ReactNode", defaultValue: "—", description: "Field label." },
      { name: "description", type: "ReactNode", defaultValue: "—", description: "Supporting text below the label." },
      { name: "error", type: "ReactNode", defaultValue: "—", description: "Validation error message." },
      { name: "placeholder", type: "string", defaultValue: "—", description: "Placeholder displayed when empty." },
      { name: "value", type: "string", defaultValue: "—", description: "Controlled value." },
      { name: "defaultValue", type: "string", defaultValue: "—", description: "Uncontrolled default value." },
      { name: "required", type: "boolean", defaultValue: "false", description: "Marks the field as required." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables user input." },
      { name: "readOnly", type: "boolean", defaultValue: "false", description: "Prevents editing while preserving focus." },
      ...commonRows
    ];
  }

  if (kind === "selection") {
    return [
      { name: "data", type: "Array<string | SelectItem>", defaultValue: "[]", description: "Selectable options." },
      { name: "value", type: "string | string[]", defaultValue: "—", description: "Controlled selected value." },
      { name: "defaultValue", type: "string | string[]", defaultValue: "—", description: "Uncontrolled selected value." },
      { name: "placeholder", type: "string", defaultValue: "—", description: "Placeholder displayed before selection." },
      { name: "searchable", type: "boolean", defaultValue: "false", description: "Enables filtering options." },
      { name: "clearable", type: "boolean", defaultValue: "false", description: "Shows clear action when selected." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables selection." },
      ...commonRows
    ];
  }

  if (kind === "overlay") {
    return [
      { name: "opened", type: "boolean", defaultValue: "false", description: "Controls visibility." },
      { name: "onClose", type: "() => void", defaultValue: "—", description: "Called when close is requested." },
      { name: "title", type: "ReactNode", defaultValue: "—", description: "Overlay title." },
      { name: "size", type: "xs | sm | md | lg | xl | full", defaultValue: "md", description: "Controls overlay width or scale." },
      { name: "centered", type: "boolean", defaultValue: "false", description: "Centers the overlay in the viewport." },
      { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Allows Escape key to close." },
      { name: "closeOnClickOutside", type: "boolean", defaultValue: "true", description: "Allows outside click to close." },
      ...commonRows
    ];
  }

  if (kind === "surface") {
    return [
      { name: "withBorder", type: "boolean", defaultValue: "false", description: "Adds a border to the surface." },
      { name: "padding", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls internal spacing." },
      { name: "radius", type: "none | sm | md | lg | xl", defaultValue: "md", description: "Controls border radius." },
      { name: "shadow", type: "none | sm | md | lg", defaultValue: "none", description: "Controls elevation shadow." },
      { name: "tone", type: "neutral | primary | success | warning | danger", defaultValue: "neutral", description: "Optional semantic tone." },
      ...commonRows
    ];
  }

  if (kind === "data") {
    return [
      { name: "data", type: "readonly object[]", defaultValue: "[]", description: "Rows used by data-driven variants." },
      { name: "columns", type: "readonly Column[]", defaultValue: "[]", description: "Column definitions." },
      { name: "striped", type: "boolean", defaultValue: "false", description: "Applies alternating row background." },
      { name: "highlightOnHover", type: "boolean", defaultValue: "false", description: "Highlights rows on hover." },
      { name: "stickyHeader", type: "boolean", defaultValue: "false", description: "Keeps header visible while scrolling." },
      ...commonRows
    ];
  }

  if (kind === "layout") {
    return [
      { name: "gap", type: "xs | sm | md | lg | xl | number", defaultValue: "md", description: "Controls spacing between children." },
      { name: "align", type: "start | center | end | stretch", defaultValue: "stretch", description: "Controls cross-axis alignment." },
      { name: "justify", type: "start | center | end | between", defaultValue: "start", description: "Controls main-axis distribution." },
      { name: "cols", type: "number | responsive object", defaultValue: "—", description: "Column count for grid-like components." },
      { name: "breakpoints", type: "responsive object", defaultValue: "—", description: "Responsive layout configuration." },
      ...commonRows
    ];
  }

  return [
    { name: "variant", type: "string", defaultValue: "default", description: "Controls visual variant." },
    { name: "tone", type: "string", defaultValue: "neutral", description: "Controls semantic tone." },
    { name: "size", type: "string", defaultValue: "md", description: "Controls component scale." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction when supported." },
    ...commonRows
  ];
}`;

const createStylesRows = `function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
  const kind = getComponentDocKind(slug);

  const shared: NoctraDocsStyleRow[] = [
    { selector: "[data-variant]", description: "Variant state attribute.", value: "Data attribute" },
    { selector: "[data-tone]", description: "Tone state attribute.", value: "Data attribute" },
    { selector: "[data-size]", description: "Size state attribute.", value: "Data attribute" },
    { selector: "[data-disabled]", description: "Disabled state attribute.", value: "Data attribute" }
  ];

  if (kind === "button-like") {
    return [
      { selector: "root", description: "Button root element.", value: "Selector" },
      { selector: "label", description: "Button label wrapper.", value: "Selector" },
      { selector: "leftSection", description: "Left content slot.", value: "Selector" },
      { selector: "rightSection", description: "Right content slot.", value: "Selector" },
      { selector: "loader", description: "Loading indicator slot.", value: "Selector" },
      { selector: "--button-height", description: "Resolved button height.", value: "CSS variable" },
      { selector: "--button-radius", description: "Resolved button border radius.", value: "CSS variable" },
      ...shared
    ];
  }

  if (kind === "field" || kind === "selection") {
    return [
      { selector: "root", description: "Field root wrapper.", value: "Selector" },
      { selector: "label", description: "Field label.", value: "Selector" },
      { selector: "description", description: "Description text.", value: "Selector" },
      { selector: "input", description: "Native input or trigger element.", value: "Selector" },
      { selector: "error", description: "Validation error text.", value: "Selector" },
      { selector: "dropdown", description: "Options dropdown when available.", value: "Selector" },
      { selector: "--input-height", description: "Resolved input height.", value: "CSS variable" },
      { selector: "--input-radius", description: "Resolved input border radius.", value: "CSS variable" },
      ...shared
    ];
  }

  if (kind === "overlay") {
    return [
      { selector: "root", description: "Overlay root.", value: "Selector" },
      { selector: "overlay", description: "Backdrop layer.", value: "Selector" },
      { selector: "content", description: "Floating content surface.", value: "Selector" },
      { selector: "header", description: "Header area.", value: "Selector" },
      { selector: "title", description: "Title text.", value: "Selector" },
      { selector: "close", description: "Close button.", value: "Selector" },
      { selector: "--overlay-z-index", description: "Overlay stack level.", value: "CSS variable" },
      ...shared
    ];
  }

  if (kind === "surface") {
    return [
      { selector: "root", description: "Surface root.", value: "Selector" },
      { selector: "header", description: "Optional header section.", value: "Selector" },
      { selector: "body", description: "Main content section.", value: "Selector" },
      { selector: "footer", description: "Optional footer section.", value: "Selector" },
      { selector: "--surface-padding", description: "Resolved surface padding.", value: "CSS variable" },
      { selector: "--surface-radius", description: "Resolved surface radius.", value: "CSS variable" },
      ...shared
    ];
  }

  if (kind === "data") {
    return [
      { selector: "root", description: "Data component root.", value: "Selector" },
      { selector: "table", description: "Table element.", value: "Selector" },
      { selector: "thead", description: "Table header group.", value: "Selector" },
      { selector: "tbody", description: "Table body group.", value: "Selector" },
      { selector: "tr", description: "Row element.", value: "Selector" },
      { selector: "th", description: "Header cell.", value: "Selector" },
      { selector: "td", description: "Body cell.", value: "Selector" },
      ...shared
    ];
  }

  if (kind === "layout") {
    return [
      { selector: "root", description: "Layout root.", value: "Selector" },
      { selector: "inner", description: "Inner layout wrapper.", value: "Selector" },
      { selector: "section", description: "Layout section.", value: "Selector" },
      { selector: "--layout-gap", description: "Resolved spacing gap.", value: "CSS variable" },
      { selector: "--layout-cols", description: "Resolved column count.", value: "CSS variable" },
      ...shared
    ];
  }

  return [
    { selector: "root", description: "Component root selector.", value: "Selector" },
    { selector: "label", description: "Primary text or label slot when available.", value: "Selector" },
    { selector: "section", description: "Internal section slot when available.", value: "Selector" },
    ...shared
  ];
}`;

page = replaceFunctionByNext(page, "buildCode", "createPropsRows", buildCode);
page = replaceFunctionByNext(page, "createPropsRows", "createStylesRows", createPropsRows);
page = replaceFunctionByNext(page, "createStylesRows", "UniversalComponentDocPage", createStylesRows);

page = page.replace(/<NoctraDocsPropsTable rows=\{createPropsRows\(meta\.label\)\} \/>/g, "<NoctraDocsPropsTable rows={createPropsRows(slug, meta.label)} />");

writeText(pagePath, page);

const after = readText(pagePath);
const problems = [];

for (const required of [
  "type ComponentDocKind",
  "function getComponentDocKind",
  "function buildCode",
  "function createPropsRows",
  "function createStylesRows",
  "createPropsRows(slug, meta.label)",
  "leftSection",
  "rightSection",
  "opened",
  "onClose",
  "withBorder",
  "columns",
  "stickyHeader",
  "--button-height",
  "--input-height",
  "--overlay-z-index",
  "--surface-padding",
  "--layout-gap"
]) {
  if (!after.includes(required)) {
    problems.push(`Missing real docs foundation marker: ${required}`);
  }
}

if (after.includes("createPropsRows(meta.label)")) {
  problems.push("Old createPropsRows(meta.label) call remains.");
}

const sourceFile = ts.createSourceFile(
  pagePath,
  after,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  problems.push(`${pagePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Real Props Styles Foundation Repair Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Repaired invalid TSX generated by STEP 307.",
  "- Replaced complex nested template examples with parser-safe line-array code generation.",
  "- Simplified component category return type into a reusable ComponentDocKind type.",
  "- Preserved category-aware Props and Styles API foundation."
].join("\n");

writeText(reportPath, report);

console.log(`Real props/styles foundation repair completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Real props/styles foundation repair failed.");
}
