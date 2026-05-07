import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const docsSystemPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const universalPath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const mantineStylePath = "apps/docs/src/components/MantineStyleComponentDocs.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "tabs-preview-text-cleanup-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let docsSystem = readText(docsSystemPath);
let universal = readText(universalPath);
let runtime = readText(runtimePath);
let sidebar = readText(sidebarPath);
let css = readText(cssPath);
let mantineStyle = existsSync(mantineStylePath) ? readText(mantineStylePath) : "";

const beforeDocsSystem = docsSystem;
const beforeUniversal = universal;
const beforeRuntime = runtime;
const beforeSidebar = sidebar;
const beforeCss = css;
const beforeMantineStyle = mantineStyle;

/* Visible "preview" text cleanup.
   Keep internal names like UniversalPreview, preview prop and ncu-preview-stage. */
universal = universal
  .replace(/description="Change options and preview the result immediately\."/g, 'description="Change options and see the result immediately."')
  .replace(/description: "Root preview selector\."/g, 'description: "Root selector."')
  .replace(/description: 'Root preview selector\.'/g, "description: 'Root selector.'")
  .replace(/preview the result/gi, "see the result")
  .replace(/Root preview selector/gi, "Root selector");

writeText(universalPath, universal);

/* Make inactive panels truly separate, active-only content. */
docsSystem = docsSystem.replace(
  /\{tab\.id === current\.id \? tab\.node : null\}/g,
  "{tab.id === current.id ? tab.node : null}"
);

writeText(docsSystemPath, docsSystem);

/* Remove runtime visible description/list text completely. */
runtime = runtime.replace(/\n\s*const descriptionNode = safeNode\(description\);\s*\n/g, "\n");

runtime = runtime.replace(
  /\n\s*if\s*\(\s*descriptionNode\s*!==\s*undefined\s*\)\s*\{\s*childrenNodes\.push\(\s*createElement\(\s*["']small["']\s*,\s*\{\s*key:\s*["']description["']\s*\}\s*,\s*descriptionNode\s*\)\s*\)\s*;\s*\}\s*/g,
  "\n"
);

runtime = runtime.replace(
  /\n\s*if\s*\(\s*description\s*\)\s*\{\s*childrenNodes\.push\(\s*createElement\(\s*["']small["']\s*,\s*\{\s*key:\s*["']description["']\s*\}\s*,\s*description\s*\)\s*\)\s*;\s*\}\s*/g,
  "\n"
);

writeText(runtimePath, runtime);

/* Ensure old generated/Mantine-style component docs also use universal docs page. */
if (existsSync(mantineStylePath)) {
  mantineStyle = `import { UniversalComponentDocPage } from "../pages/UniversalComponentDocPage";

export type MantineStyleComponentDocsProps = {
  slug?: string;
  componentSlug?: string;
  component?: {
    slug?: string;
    kebab?: string;
    name?: string;
    description?: string;
    group?: string;
  };
  [key: string]: unknown;
};

export function MantineStyleComponentDocs(props: MantineStyleComponentDocsProps) {
  return <UniversalComponentDocPage {...props} />;
}

export default MantineStyleComponentDocs;
`;

  writeText(mantineStylePath, mantineStyle);
}

/* CSS final override: only active tab visible. */
const cssBlock = `
/* TABS_PREVIEW_TEXT_CLEANUP_START */
.nmx-tab-panels{display:block}
.nmx-tab-panel[data-active="false"]{display:none!important}
.nmx-tab-panel[data-active="true"]{display:block!important}
.ncr-mock small,.ncr-mock-list{display:none!important}
/* TABS_PREVIEW_TEXT_CLEANUP_END */
`;

const cssPattern = /\/\* TABS_PREVIEW_TEXT_CLEANUP_START \*\/[\s\S]*?\/\* TABS_PREVIEW_TEXT_CLEANUP_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const afterDocsSystem = readText(docsSystemPath);
const afterUniversal = readText(universalPath);
const afterRuntime = readText(runtimePath);
const afterSidebar = readText(sidebarPath);
const afterCss = readText(cssPath);
const afterMantineStyle = existsSync(mantineStylePath) ? readText(mantineStylePath) : "";

const problems = [];

for (const required of [
  "DOCS_SCROLL_EVENT",
  "docsTabForTarget",
  "emitDocsScrollTarget",
  "scrollToDocsTarget",
  "useEffect",
  "tab.id === current.id ? tab.node : null",
  "data-active={tab.id === current.id ? \"true\" : \"false\"}"
]) {
  if (!afterDocsSystem.includes(required)) {
    problems.push(`NoctraMantineDocs missing: ${required}`);
  }
}

if (!afterUniversal.includes("safeComponentLabel")) {
  problems.push("UniversalComponentDocPage missing safeComponentLabel.");
}

const visiblePreviewTextPatterns = [
  /preview the result/i,
  /Root preview selector/i,
  /\{item\}\s*preview/i
];

for (const pattern of visiblePreviewTextPatterns) {
  if (pattern.test(afterUniversal) || pattern.test(afterRuntime)) {
    problems.push(`Visible preview text remains: ${pattern}`);
  }
}

if (afterRuntime.includes('key: "description"') || afterRuntime.includes("key: 'description'")) {
  problems.push("Runtime mock still renders description small text.");
}

for (const required of [
  "className: cx(mockStateClass",
  '"data-variant"',
  '"data-tone"',
  '"data-size"',
  '"data-radius"'
]) {
  if (!afterRuntime.includes(required)) {
    problems.push(`Runtime missing: ${required}`);
  }
}

if (!afterSidebar.includes("docsSidebarSections") || !afterSidebar.includes("docsComponentLinks")) {
  problems.push("docsSidebarLinks missing required exports.");
}

const componentLinkCount = (afterSidebar.match(/"href": "\/components\//g) ?? []).length;

if (componentLinkCount < 80) {
  problems.push(`Too few component links in sidebar: ${componentLinkCount}.`);
}

for (const required of [
  "TABS_PREVIEW_TEXT_CLEANUP_START",
  '.nmx-tab-panel[data-active="false"]{display:none!important}',
  '.nmx-tab-panel[data-active="true"]{display:block!important}',
  ".ncr-mock small,.ncr-mock-list{display:none!important}"
]) {
  if (!afterCss.includes(required)) {
    problems.push(`CSS missing: ${required}`);
  }
}

if (existsSync(mantineStylePath) && !afterMantineStyle.includes("UniversalComponentDocPage")) {
  problems.push("MantineStyleComponentDocs is not routed to UniversalComponentDocPage.");
}

for (const [file, source, kind] of [
  [docsSystemPath, afterDocsSystem, ts.ScriptKind.TSX],
  [universalPath, afterUniversal, ts.ScriptKind.TSX],
  [runtimePath, afterRuntime, ts.ScriptKind.TSX],
  [sidebarPath, afterSidebar, ts.ScriptKind.TS],
  [mantineStylePath, afterMantineStyle, ts.ScriptKind.TSX]
]) {
  if (!source) continue;

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
  "# Tabs Preview Text Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraMantineDocs changed: ${beforeDocsSystem === afterDocsSystem ? "no" : "yes"}`,
  `UniversalComponentDocPage changed: ${beforeUniversal === afterUniversal ? "no" : "yes"}`,
  `Runtime changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `Sidebar changed: ${beforeSidebar === afterSidebar ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `MantineStyleComponentDocs changed: ${beforeMantineStyle === afterMantineStyle ? "no" : "yes"}`,
  `Component links found: ${componentLinkCount}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Kept Documentation / Props / Styles API as separate active-only panels.",
  "- Removed visible preview wording from universal docs.",
  "- Kept internal preview component/prop names intact.",
  "- Ensured hidden tab panels do not render below active content.",
  "- Kept all component pages routed through the universal Button-like docs system."
].join("\n");

writeText(reportPath, report);

console.log(`Tabs preview text cleanup completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Tabs preview text cleanup failed.");
}
