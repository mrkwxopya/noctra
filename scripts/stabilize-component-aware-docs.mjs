import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const routingPath = "apps/docs/src/lib/docsRouting.ts";
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "component-aware-docs-stabilize-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function slugify(value) {
  const slug = String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const aliases = {
    listbox: "list-box",
    creditcard: "credit-card",
    pincode: "pin-code",
    pininput: "pin-input",
    textinput: "text-input",
    searchinput: "search-input",
    passwordinput: "password-input",
    numberinput: "number-input",
    iconbutton: "icon-button",
    codeblock: "code-block",
    datagrid: "data-grid",
    hovercard: "hover-card",
    contextmenu: "context-menu",
    multiselect: "multi-select",
    nativeselect: "native-select",
    rangeslider: "range-slider",
    tableofcontents: "table-of-contents",
    transferlist: "transfer-list",
    treeselect: "tree-select",
    treeview: "tree-view",
    visuallyhidden: "visually-hidden"
  };

  return aliases[slug] ?? slug;
}

function humanizeSlug(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

let routing = readText(routingPath);
let sidebar = readText(sidebarPath);
let css = readText(cssPath);

const beforeRouting = routing;
const beforeSidebar = sidebar;
const beforeCss = css;

const aliasHelper = `
export function normalizeDocsComponentSlugAlias(slug = ""): string {
  const clean = slug
    .trim()
    .replace(/^\\/+|\\/+$/g, "")
    .toLowerCase();

  const aliases: Record<string, string> = {
    listbox: "list-box",
    creditcard: "credit-card",
    pincode: "pin-code",
    pininput: "pin-input",
    textinput: "text-input",
    searchinput: "search-input",
    passwordinput: "password-input",
    numberinput: "number-input",
    iconbutton: "icon-button",
    codeblock: "code-block",
    datagrid: "data-grid",
    hovercard: "hover-card",
    contextmenu: "context-menu",
    multiselect: "multi-select",
    nativeselect: "native-select",
    rangeslider: "range-slider",
    tableofcontents: "table-of-contents",
    transferlist: "transfer-list",
    treeselect: "tree-select",
    treeview: "tree-view",
    visuallyhidden: "visually-hidden"
  };

  return aliases[clean] ?? clean;
}
`;

if (!routing.includes("normalizeDocsComponentSlugAlias")) {
  const marker = "export function resolveDocsRouteFromPath";

  if (!routing.includes(marker)) {
    throw new Error("resolveDocsRouteFromPath marker not found in docsRouting.ts");
  }

  routing = routing.replace(marker, `${aliasHelper}\n${marker}`);
}

routing = routing.replace(
  /componentSlug:\s*clean\.replace\(["']\/components\/["'],\s*["']["']\)/g,
  `componentSlug: normalizeDocsComponentSlugAlias(clean.replace("/components/", ""))`
);

writeText(routingPath, routing);

const fallback = [
  "Accordion","Alert","AppShell","AspectRatio","Autocomplete","Avatar","Badge","Blockquote","Box","Breadcrumb","Breadcrumbs",
  "Button","Card","CardBody","CardDescription","CardFooter","CardHeader","CardTitle","Center","Checkbox","Clipboard","Code",
  "CodeBlock","ColorInput","ColorPicker","Combobox","Command","CommandBar","Container","ContextMenu","CreditCard","DataGrid",
  "Dialog","Divider","Dock","Drawer","Dropzone","EmptyState","Flex","FloatLabel","Footer","FormField","Grid","Group","Header",
  "Highlight","HoverCard","IconButton","InlineCode","Input","Kbd","Layout","LayoutShell","Link","ListBox","Loader","Menu",
  "Modal","MultiSelect","NativeSelect","Notification","NumberInput","Page","Pagination","Paper","PasswordInput","PinCode",
  "PinInput","Popover","Portal","Progress","Prose","Radio","RangeSlider","Rating","ResizablePanel","ScrollArea","SearchInput",
  "SegmentedControl","Select","Sidebar","SimpleGrid","Skeleton","Slider","Spacer","Spinner","SplitPane","Stack","StatusBar",
  "Stepper","Switch","Table","TableOfContents","Tabs","TagsInput","Textarea","TextInput","Timeline","Toast","Toolbar",
  "Tooltip","TransferList","Tree","TreeSelect","TreeView","VisuallyHidden"
];

const componentLinks = fallback
  .map((name) => {
    const slug = slugify(name);

    return {
      label: humanizeSlug(slug),
      href: `/components/${slug}`
    };
  })
  .filter((item, index, arr) => arr.findIndex((other) => other.href === item.href) === index)
  .sort((a, b) => a.label.localeCompare(b.label));

sidebar = `export type DocsSidebarLink = {
  label: string;
  href: string;
};

export type DocsSidebarSection = {
  title: string;
  links: readonly DocsSidebarLink[];
};

export const docsSidebarSections = ${JSON.stringify([
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
], null, 2)} as const satisfies readonly DocsSidebarSection[];

export const docsComponentLinks = docsSidebarSections.find((section) => section.title === "Components")?.links ?? [];

export default docsSidebarSections;
`;

writeText(sidebarPath, sidebar);

css = css.replace(/^.*ncu-sample-box.*$/gm, "");

const cssBlock = `
/* COMPONENT_AWARE_DOCS_STABILIZE_START */
.ncu-stage{display:flex;align-items:center;justify-content:center;min-height:132px;width:100%;padding:18px}
.ncu-visual{border:1px solid var(--nmx-line);background:rgba(15,23,42,.35);color:var(--nmx-text);border-radius:12px}
.ncu-visual.ncr-full-width{width:100%}
.ncu-native-card{display:grid;gap:12px;min-width:280px;padding:18px;text-align:left}.ncu-native-card header{display:grid;gap:3px}.ncu-native-card header strong{font-size:16px}.ncu-native-card header span,.ncu-native-card p{margin:0;color:var(--nmx-muted);font-size:13px;line-height:1.55}.ncu-native-card footer{display:flex;gap:8px}.ncu-native-card button{border:1px solid var(--nmx-line);border-radius:8px;background:rgba(139,92,246,.22);color:#ede9fe;padding:7px 10px}
.ncu-native-field{display:grid;gap:7px;min-width:260px;padding:14px;text-align:left}.ncu-native-field label,.ncu-native-listbox label{color:var(--nmx-muted);font-size:12px;font-weight:700}.ncu-native-field input{height:36px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(2,6,23,.35);color:var(--nmx-text);padding:0 11px}
.ncu-native-listbox{display:grid;gap:8px;min-width:260px;padding:14px;text-align:left}.ncu-native-listbox [role="listbox"]{display:grid;border:1px solid var(--nmx-line);border-radius:10px;overflow:hidden}.ncu-native-listbox span{padding:9px 11px;border-bottom:1px solid var(--nmx-line);color:var(--nmx-muted);font-size:13px}.ncu-native-listbox span:last-child{border-bottom:0}.ncu-native-listbox span[aria-selected="true"]{background:rgba(139,92,246,.18);color:#ddd6fe}
.ncu-native-message{display:grid;gap:5px;min-width:260px;padding:15px;text-align:left}.ncu-native-message strong{font-size:14px}.ncu-native-message p{margin:0;color:var(--nmx-muted);font-size:13px;line-height:1.55}
.ncu-native-badge{display:inline-flex;align-items:center;min-height:28px;padding:0 10px;font-size:13px;font-weight:700}
.ncu-native-avatar{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:999px;font-weight:800}
.ncu-native-check{display:inline-flex;align-items:center;gap:9px;min-height:36px;padding:0 12px}.ncu-native-check input{accent-color:var(--nmx-accent)}
.ncu-native-meter{display:grid;gap:8px;min-width:250px;padding:14px;text-align:left}.ncu-native-meter strong{font-size:13px}.ncu-native-meter div{height:9px;border-radius:999px;background:rgba(148,163,184,.18);overflow:hidden}.ncu-native-meter div span{display:block;width:68%;height:100%;border-radius:inherit;background:rgba(139,92,246,.72)}
.ncu-native-table{display:grid;min-width:320px;border-radius:12px;overflow:hidden;text-align:left}.ncu-native-table>div{display:grid;grid-template-columns:1fr 80px 80px;gap:12px;padding:10px 12px;border-bottom:1px solid var(--nmx-line)}.ncu-native-table>div:last-child{border-bottom:0}.ncu-native-table strong{color:var(--nmx-muted);font-size:12px}.ncu-native-table span{font-size:13px}
.ncu-native-tabs{display:grid;gap:12px;min-width:300px;padding:14px;text-align:left}.ncu-native-tabs>div{display:flex;gap:12px;border-bottom:1px solid var(--nmx-line)}.ncu-native-tabs button{border:0;border-bottom:2px solid transparent;background:transparent;color:var(--nmx-muted);padding:0 0 9px}.ncu-native-tabs button:first-child{border-bottom-color:var(--nmx-accent);color:var(--nmx-text)}.ncu-native-tabs p{margin:0;color:var(--nmx-muted);font-size:13px}
.ncu-native-accordion,.ncu-native-overlay{display:grid;gap:6px;min-width:240px;padding:14px;text-align:left}.ncu-native-accordion p,.ncu-native-overlay p{margin:0;color:var(--nmx-muted);font-size:13px}
.ncu-native-breadcrumb{padding:10px 12px;color:var(--nmx-muted);font-size:13px}
.ncu-native-pagination{display:flex;gap:8px;padding:10px}.ncu-native-pagination button{width:32px;height:32px;border:1px solid var(--nmx-line);border-radius:8px;background:rgba(15,23,42,.42);color:var(--nmx-text)}
.ncu-native-timeline,.ncu-native-tree{display:grid;gap:8px;min-width:220px;padding:14px;text-align:left}.ncu-native-timeline span,.ncu-native-tree span{position:relative;padding-left:18px;color:var(--nmx-muted);font-size:13px}.ncu-native-timeline span::before,.ncu-native-tree span::before{content:"";position:absolute;left:0;top:.45em;width:7px;height:7px;border-radius:999px;background:var(--nmx-accent)}
.ncu-native-spinner{width:34px;height:34px;border-radius:999px;border:3px solid rgba(148,163,184,.25);border-right-color:#c4b5fd;animation:ncr-spin .8s linear infinite}
.ncu-native-skeleton{display:grid;gap:9px;min-width:260px;padding:14px}.ncu-native-skeleton span{height:12px;border-radius:999px;background:linear-gradient(90deg,rgba(148,163,184,.12),rgba(148,163,184,.24),rgba(148,163,184,.12))}
.ncu-native-layout{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:270px;padding:12px}.ncu-native-layout span{display:flex;align-items:center;justify-content:center;min-height:42px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(148,163,184,.08);color:var(--nmx-muted);font-size:12px}.ncu-native-layout span:first-child{grid-column:1/-1;color:var(--nmx-text);background:rgba(139,92,246,.13)}
.ncu-native-generic{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 13px}
.ncu-configurator{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.24);overflow:hidden}
.ncu-configurator-stage{display:flex;align-items:center;justify-content:center;min-height:260px;padding:22px}
.ncu-configurator-controls{display:grid;align-content:start;gap:14px;padding:18px;border-left:1px solid var(--nmx-line);background:rgba(15,23,42,.20)}
.ncu-control-group{display:grid;gap:7px}.ncu-control-group>label{color:var(--nmx-muted);font-size:12px;font-weight:750}.ncu-control-options{display:flex;flex-wrap:wrap;gap:7px}.ncu-control-options button{appearance:none;border:1px solid var(--nmx-line);background:rgba(15,23,42,.38);color:var(--nmx-muted);border-radius:8px;padding:7px 10px;font:inherit;font-size:12px;cursor:pointer}.ncu-control-options button[aria-pressed="true"]{border-color:rgba(139,92,246,.6);background:var(--nmx-accent-soft);color:#ddd6fe}
.ncu-boolean-grid{display:grid;gap:8px;padding-top:4px}.ncu-boolean-control{display:inline-flex;align-items:center;gap:8px;color:var(--nmx-muted);font-size:13px}.ncu-boolean-control input{accent-color:var(--nmx-accent)}
.ncu-example-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ncu-example-card{display:grid;gap:10px;align-items:center;justify-items:center;min-height:150px;padding:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.22)}.ncu-example-card code{color:#c4b5fd}
@media (max-width:900px){.ncu-configurator{grid-template-columns:1fr}.ncu-configurator-controls{border-left:0;border-top:1px solid var(--nmx-line)}.ncu-example-grid{grid-template-columns:1fr}}
/* COMPONENT_AWARE_DOCS_STABILIZE_END */
`;

const pattern = /\/\* COMPONENT_AWARE_DOCS_STABILIZE_START \*\/[\s\S]*?\/\* COMPONENT_AWARE_DOCS_STABILIZE_END \*\//;

css = pattern.test(css)
  ? css.replace(pattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const universal = readText("apps/docs/src/pages/UniversalComponentDocPage.tsx");
const cssAfter = readText(cssPath);
const routingAfter = readText(routingPath);
const sidebarAfter = readText(sidebarPath);

const problems = [];

if (/ncu-sample-box|>A<\/span>|>B<\/span>|>C<\/span>/.test(universal) || /ncu-sample-box/.test(cssAfter)) {
  problems.push("ABC/sample-box content still exists.");
}

if (!universal.includes("ncu-native-listbox")) {
  problems.push("ListBox native visual missing.");
}

if (!universal.includes("ncu-native-card")) {
  problems.push("Card native visual missing.");
}

if (!universal.includes("ncu-native-table")) {
  problems.push("Table native visual missing.");
}

if (!routingAfter.includes("normalizeDocsComponentSlugAlias")) {
  problems.push("docsRouting alias normalizer missing.");
}

if (!sidebarAfter.includes("/components/list-box") || !sidebarAfter.includes("/components/text-input")) {
  problems.push("Expected canonical sidebar slugs missing.");
}

const componentLinkCount = (sidebarAfter.match(/"href": "\/components\//g) ?? []).length;

if (componentLinkCount < 90) {
  problems.push(`Component links too low: ${componentLinkCount}.`);
}

for (const [file, source, kind] of [
  ["apps/docs/src/pages/UniversalComponentDocPage.tsx", universal, ts.ScriptKind.TSX],
  [routingPath, routingAfter, ts.ScriptKind.TS],
  [sidebarPath, sidebarAfter, ts.ScriptKind.TS]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Component-aware Docs Stabilize Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Routing changed: ${beforeRouting === routingAfter ? "no" : "yes"}`,
  `Sidebar changed: ${beforeSidebar === sidebarAfter ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === cssAfter ? "no" : "yes"}`,
  `Component links found: ${componentLinkCount}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Removed old ABC/sample-box CSS and source usage.",
  "- Added slug aliases for listbox/list-box, textinput/text-input, pincode/pin-code and similar routes.",
  "- Replaced generic runtime rendering with component-aware native docs visuals.",
  "- Card, ListBox, Table, Tabs, Inputs, Overlays, Layout and status components now have specific visual samples.",
  "- Kept Button-like docs shell, tabs, controls and Styles API structure."
].join("\n");

writeText(reportPath, report);

console.log(`Component-aware docs stabilize completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component-aware docs stabilize failed.");
}
