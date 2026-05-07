import { existsSync, readFileSync, writeFileSync } from "node:fs";

const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "component-aware-docs-system-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function slugify(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function humanizeSlug(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

const runtime = readText(runtimePath);
let css = readText(cssPath);

const fallback = [
  "Accordion","Alert","AppShell","AspectRatio","Autocomplete","Avatar","Badge","Blockquote","Box","Breadcrumb","Breadcrumbs",
  "Button","Card","CardBody","CardDescription","CardFooter","CardHeader","CardTitle","Center","Checkbox","Clipboard","Code",
  "CodeBlock","ColorInput","ColorPicker","Combobox","Command","CommandBar","Container","ContextMenu","CreditCard","DataGrid",
  "Dialog","Divider","Dock","Drawer","Dropzone","EmptyState","Flex","FloatLabel","Footer","FormField","Grid","Group","Header",
  "Highlight","HoverCard","IconButton","InlineCode","Input","Kbd","Layout","LayoutShell","Link","ListBox","Loader","Menu",
  "Modal","MultiSelect","NativeSelect","Notification","NumberInput","Page","Pagination","Paper","PasswordInput","PinCode",
  "PinInput","Popover","Portal","Progress","Prose","Radio","RangeSlider","Rating","ResizablePanel","ScrollArea","SearchInput",
  "SegmentedControl","Select","Sidebar","SimpleGrid","Skeleton","Slider","Spinner","SplitPane","Stack","StatusBar","Stepper",
  "Switch","Table","TableOfContents","Tabs","TagsInput","Textarea","TextInput","Timeline","Toast","Toolbar","Tooltip",
  "TransferList","Tree","TreeSelect","TreeView","VisuallyHidden"
];

const names = new Set(fallback);

for (const match of runtime.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9_]*)\b/g)) {
  const name = match[1];

  if (name === "DefaultNoctraMock") continue;
  if (name === "NoctraProvider") continue;
  if (name.startsWith("Noctra")) continue;
  if (name.endsWith("Mock")) continue;

  names.add(name);
}

const componentLinks = [...names]
  .map((name) => {
    const slug = slugify(name);

    return {
      label: humanizeSlug(slug),
      href: `/components/${slug}`
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const sidebarSections = [
  {
    title: "Docs",
    links: [
      { label: "Overview", href: "/" },
      { label: "Components", href: "/components" },
      { label: "Architecture", href: "/architecture" },
      { label: "Theming", href: "/theming" },
      { label: "Tokens", href: "/tokens" },
      { label: "Quality", href: "/quality" },
      { label: "Release", href: "/release" }
    ]
  },
  {
    title: "Components",
    links: componentLinks
  }
];

const sidebar = `export type DocsSidebarLink = {
  label: string;
  href: string;
};

export type DocsSidebarSection = {
  title: string;
  links: readonly DocsSidebarLink[];
};

export const docsSidebarSections = ${JSON.stringify(sidebarSections, null, 2)} as const satisfies readonly DocsSidebarSection[];

export const docsComponentLinks = docsSidebarSections.find((section) => section.title === "Components")?.links ?? [];

export default docsSidebarSections;
`;

writeText(sidebarPath, sidebar);

const cssBlock = `
/* COMPONENT_AWARE_DOCS_SYSTEM_START */
.ncu-stage{display:flex;align-items:center;justify-content:center;min-height:124px;width:100%;padding:18px}
.ncu-card-sample{display:grid;gap:8px;min-width:220px;text-align:left}.ncu-card-sample strong{font-size:15px}.ncu-card-sample span{color:var(--nmx-muted);font-size:13px}.ncu-card-sample button{justify-self:start;border:1px solid var(--nmx-line);border-radius:8px;background:rgba(139,92,246,.22);color:#ede9fe;padding:7px 10px}
.ncu-message-sample{display:grid;gap:4px;text-align:left}.ncu-message-sample strong{font-size:14px}.ncu-message-sample span{color:var(--nmx-muted);font-size:13px}
.ncu-table-sample{display:grid;min-width:260px;border:1px solid var(--nmx-line);border-radius:10px;overflow:hidden;text-align:left}.ncu-table-sample>div{display:grid;grid-template-columns:1fr 90px;gap:12px;padding:9px 11px;border-bottom:1px solid var(--nmx-line)}.ncu-table-sample>div:last-child{border-bottom:0}.ncu-table-sample strong{color:var(--nmx-muted);font-size:12px}.ncu-table-sample span{font-size:13px}
.ncu-tabs-sample{display:grid;gap:10px;min-width:230px}.ncu-tabs-sample>div{display:flex;gap:8px;border-bottom:1px solid var(--nmx-line)}.ncu-tabs-sample button{border:0;border-bottom:2px solid transparent;background:transparent;color:var(--nmx-muted);padding:0 0 8px}.ncu-tabs-sample button:first-child{border-bottom-color:var(--nmx-accent);color:var(--nmx-text)}.ncu-tabs-sample p{margin:0;color:var(--nmx-muted);font-size:13px}
.ncu-timeline-sample{display:grid;gap:8px;text-align:left}.ncu-timeline-sample span{position:relative;padding-left:18px;color:var(--nmx-muted);font-size:13px}.ncu-timeline-sample span::before{content:"";position:absolute;left:0;top:.45em;width:7px;height:7px;border-radius:999px;background:var(--nmx-accent)}
.ncu-overlay-sample{display:grid;gap:6px;min-width:220px;text-align:left}.ncu-overlay-sample strong{font-size:15px}.ncu-overlay-sample span{color:var(--nmx-muted);font-size:13px}
.ncu-accordion-sample{display:grid;gap:6px;text-align:left}.ncu-accordion-sample strong{font-size:14px}.ncu-accordion-sample span{color:var(--nmx-muted);font-size:13px}
.ncu-layout-sample{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:240px}.ncu-layout-sample span{display:flex;align-items:center;justify-content:center;min-height:38px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(148,163,184,.08);color:var(--nmx-muted);font-size:12px}.ncu-layout-sample span:first-child{grid-column:1/-1;color:var(--nmx-text);background:rgba(139,92,246,.13)}
.ncu-configurator{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.24);overflow:hidden}
.ncu-configurator-stage{display:flex;align-items:center;justify-content:center;min-height:260px;padding:22px}
.ncu-configurator-controls{display:grid;align-content:start;gap:14px;padding:18px;border-left:1px solid var(--nmx-line);background:rgba(15,23,42,.20)}
.ncu-control-group{display:grid;gap:7px}.ncu-control-group>label{color:var(--nmx-muted);font-size:12px;font-weight:750}.ncu-control-options{display:flex;flex-wrap:wrap;gap:7px}.ncu-control-options button{appearance:none;border:1px solid var(--nmx-line);background:rgba(15,23,42,.38);color:var(--nmx-muted);border-radius:8px;padding:7px 10px;font:inherit;font-size:12px;cursor:pointer}.ncu-control-options button:hover{border-color:var(--nmx-line-strong);color:var(--nmx-text)}.ncu-control-options button[aria-pressed="true"]{border-color:rgba(139,92,246,.6);background:var(--nmx-accent-soft);color:#ddd6fe}
.ncu-boolean-grid{display:grid;gap:8px;padding-top:4px}.ncu-boolean-control{display:inline-flex;align-items:center;gap:8px;color:var(--nmx-muted);font-size:13px;cursor:pointer}.ncu-boolean-control input{accent-color:var(--nmx-accent)}
.ncu-example-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ncu-example-card{display:grid;gap:10px;align-items:center;justify-items:center;min-height:150px;padding:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.22)}.ncu-example-card code{color:#c4b5fd}
.ncu-sample-box{display:none!important}
@media (max-width:900px){.ncu-configurator{grid-template-columns:1fr}.ncu-configurator-controls{border-left:0;border-top:1px solid var(--nmx-line)}.ncu-example-grid{grid-template-columns:1fr}}
/* COMPONENT_AWARE_DOCS_SYSTEM_END */
`;

const pattern = /\/\* COMPONENT_AWARE_DOCS_SYSTEM_START \*\/[\s\S]*?\/\* COMPONENT_AWARE_DOCS_SYSTEM_END \*\//;

css = pattern.test(css)
  ? css.replace(pattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const universal = readText("apps/docs/src/pages/UniversalComponentDocPage.tsx");
const sidebarAfter = readText(sidebarPath);
const cssAfter = readText(cssPath);

const problems = [];

if (/A<\/span>|B<\/span>|C<\/span>|ncu-sample-box">A|ncu-sample-box">B|ncu-sample-box">C/.test(universal)) {
  problems.push("ABC placeholder content still exists in UniversalComponentDocPage.");
}

if (!universal.includes("createVisualChildren")) {
  problems.push("Component-aware createVisualChildren missing.");
}

if (!universal.includes("ncu-card-sample")) {
  problems.push("Card-specific sample missing.");
}

if (!universal.includes("ncu-table-sample")) {
  problems.push("Table-specific sample missing.");
}

if (!universal.includes("ncu-layout-sample")) {
  problems.push("Layout-specific sample missing.");
}

if (!sidebarAfter.includes("docsComponentLinks")) {
  problems.push("docsComponentLinks export missing.");
}

const componentLinkCount = (sidebarAfter.match(/"href": "\/components\//g) ?? []).length;

if (componentLinkCount < 100) {
  problems.push(`Component links too low: ${componentLinkCount}.`);
}

if (!cssAfter.includes("COMPONENT_AWARE_DOCS_SYSTEM_START")) {
  problems.push("Component-aware CSS block missing.");
}

if (!cssAfter.includes(".ncu-sample-box{display:none!important}")) {
  problems.push("ABC sample-box CSS fallback missing.");
}

const report = [
  "# Component-aware Docs System Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Component links generated: ${componentLinkCount}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Removed generic ABC placeholders.",
  "- Added component-aware visual samples for Card, Table, Tabs, Alert, Overlay, Layout and more.",
  "- Re-routed component detail wrappers to the universal docs page.",
  "- Regenerated sidebar component links from runtime exports plus fallback inventory.",
  "- Added final CSS fallback to hide old sample boxes."
].join("\n");

writeText(reportPath, report);

console.log(`Component-aware docs system completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component-aware docs system failed.");
}
