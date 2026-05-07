import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const docsSystemPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const universalPath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const mantineStylePath = "apps/docs/src/components/MantineStyleComponentDocs.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "tabs-separate-panels-all-components-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceFunction(source, name, replacement) {
  const start = source.indexOf(`export function ${name}`);

  if (start < 0) {
    throw new Error(`Could not find export function ${name}.`);
  }

  const nextExport = source.indexOf("\nexport ", start + 1);
  const end = nextExport >= 0 ? nextExport : source.length;

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end).trimStart()}`;
}

function ensureBefore(source, marker, block) {
  if (source.includes(block.trim().split("\n")[0])) return source;

  const index = source.indexOf(marker);

  if (index < 0) {
    throw new Error(`Marker not found: ${marker}`);
  }

  return `${source.slice(0, index)}${block.trimEnd()}\n\n${source.slice(index)}`;
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

function collectRuntimeComponentLinks(runtimeSource) {
  const exclude = new Set([
    "DefaultNoctraMock",
    "NoctraProvider"
  ]);

  const names = new Set();

  for (const match of runtimeSource.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9_]*)\b/g)) {
    const name = match[1];

    if (exclude.has(name)) continue;
    if (name.startsWith("Noctra")) continue;
    if (name.endsWith("Mock")) continue;

    names.add(name);
  }

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

  for (const name of fallback) names.add(name);

  return [...names]
    .map((name) => {
      const slug = slugify(name);

      return {
        label: humanizeSlug(slug),
        href: `/components/${slug}`
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

let docsSystem = readText(docsSystemPath);
let universal = readText(universalPath);
let runtime = readText(runtimePath);
let sidebar = readText(sidebarPath);
let css = readText(cssPath);

const beforeDocsSystem = docsSystem;
const beforeUniversal = universal;
const beforeRuntime = runtime;
const beforeSidebar = sidebar;
const beforeCss = css;

/* React import: useEffect gerekli */
docsSystem = docsSystem.replace(
  /import\s+\{\s*useMemo,\s*useState,/,
  "import { useEffect, useMemo, useState,"
);

docsSystem = docsSystem.replace(
  /import\s+\{\s*useEffect,\s*useEffect,\s*useMemo,\s*useState,/,
  "import { useEffect, useMemo, useState,"
);

/* Scroll helper */
const scrollHelper = `
const DOCS_SCROLL_EVENT = "noctra:docs-scroll-target";

function docsTabForTarget(id: string): "documentation" | "props-panel" | "styles-panel" {
  if (id === "props" || id === "props-panel") return "props-panel";
  if (id === "styles-api" || id === "styles-panel" || id === "styles") return "styles-panel";
  return "documentation";
}

function emitDocsScrollTarget(href: string): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(DOCS_SCROLL_EVENT, {
      detail: { href }
    })
  );
}

function scrollToDocsTarget(href: string): void {
  if (typeof window === "undefined") return;
  if (!href.startsWith("#")) return;

  const id = href.slice(1);
  if (!id) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.history.replaceState(null, "", href);
    });
  });
}
`;

docsSystem = ensureBefore(docsSystem, "function cx", scrollHelper);

/* Eski helper çiftlerini temizle */
docsSystem = docsSystem.replace(/function scrollToDocsTarget\(href: string\): void \{[\s\S]*?\n\}\n\nfunction cx/, `${scrollHelper}\nfunction cx`);

/* TOC: tıklayınca event ile doğru tab + scroll */
const tocReplacement = `
export function NoctraDocsToc({ items = [] }: { items?: readonly NoctraDocsTocItem[] }) {
  return (
    <aside className="nmx-right-toc" aria-label="Table of contents">
      <h2>Table of contents</h2>
      <nav>
        {items.length > 0 ? (
          items.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={(event) => {
                if (!item.href.startsWith("#")) return;

                event.preventDefault();
                emitDocsScrollTarget(item.href);
              }}
            >
              <span>{item.label}</span>
              {item.description ? <small>{item.description}</small> : null}
            </a>
          ))
        ) : (
          <span className="nmx-empty-note">No sections</span>
        )}
      </nav>
    </aside>
  );
}
`;

docsSystem = replaceFunction(docsSystem, "NoctraDocsToc", tocReplacement);

/* Tabs: sadece aktif panel gösterilecek, aşağıya tüm içerik dizilmeyecek */
const tabsReplacement = `
export function NoctraDocsTabs({
  documentation,
  props,
  styles
}: {
  documentation?: ReactNode | undefined;
  props?: ReactNode | undefined;
  styles?: ReactNode | undefined;
}) {
  const tabs = useMemo(
    () => [
      { id: "documentation", label: "Documentation", node: documentation },
      { id: "props-panel", label: "Props", node: props },
      { id: "styles-panel", label: "Styles API", node: styles }
    ].filter((tab) => hasNode(tab.node)),
    [documentation, props, styles]
  );

  const [active, setActive] = useState(() => tabs[0]?.id ?? "documentation");

  useEffect(() => {
    const handleDocsScroll = (event: Event) => {
      const customEvent = event as CustomEvent<{ href?: string }>;
      const href = customEvent.detail?.href;

      if (!href || !href.startsWith("#")) return;

      const targetId = href.slice(1);
      const nextTab = docsTabForTarget(targetId);

      if (tabs.some((tab) => tab.id === nextTab)) {
        setActive(nextTab);
      }

      scrollToDocsTarget(href);
    };

    const handleHashChange = () => {
      if (!window.location.hash) return;

      const targetId = window.location.hash.slice(1);
      const nextTab = docsTabForTarget(targetId);

      if (tabs.some((tab) => tab.id === nextTab)) {
        setActive(nextTab);
      }

      scrollToDocsTarget(window.location.hash);
    };

    window.addEventListener(DOCS_SCROLL_EVENT, handleDocsScroll as EventListener);
    window.addEventListener("hashchange", handleHashChange);

    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener(DOCS_SCROLL_EVENT, handleDocsScroll as EventListener);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [tabs]);

  if (tabs.length === 0) {
    return null;
  }

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="nmx-tabs-shell">
      <div className="nmx-tabs" role="tablist" aria-label="Docs sections">
        {tabs.map((tab) => (
          <button
            aria-selected={tab.id === current.id}
            key={tab.id}
            onClick={() => setActive(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="nmx-tab-panels">
        {tabs.map((tab) => (
          <section
            aria-hidden={tab.id === current.id ? "false" : "true"}
            aria-label={tab.label}
            className="nmx-tab-panel"
            data-active={tab.id === current.id ? "true" : "false"}
            id={tab.id}
            key={tab.id}
            role="tabpanel"
          >
            {tab.id === current.id ? tab.node : null}
          </section>
        ))}
      </div>
    </div>
  );
}
`;

docsSystem = replaceFunction(docsSystem, "NoctraDocsTabs", tabsReplacement);

writeText(docsSystemPath, docsSystem);

/* Universal page: invalid label ve preview yazıları temiz kalsın */
if (!universal.includes("function safeComponentLabel")) {
  universal = universal.replace(
    "function titleCase(slug: string): string {",
    `function safeComponentLabel(slug: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text || /\\{[^}]*\\}/.test(text) || /^item$/i.test(text) || /preview$/i.test(text)) {
    return titleCase(slug);
  }

  return text.replace(/\\s+preview$/i, "");
}

function titleCase(slug: string): string {`
  );
}

universal = universal.replace(
  /const label = link\?\.label \?\? titleCase\(slug\);/g,
  `const label = safeComponentLabel(slug, link?.label ?? titleCase(slug));`
);

universal = universal.replace(/description:\s*`[^`]*preview`,?\n/g, "");
universal = universal.replace(/description:\s*["'][^"']*preview["'],?\n/g, "");

writeText(universalPath, universal);

/* Runtime mock: description/list preview text yok, state class bütün componentlere uygulanıyor */
runtime = runtime.replace(/\n\s*const descriptionNode = safeNode\(description\);\s*\n/g, "\n");

runtime = runtime.replace(
  /\n\s*if\s*\(\s*descriptionNode\s*!==\s*undefined\s*\)\s*\{\s*childrenNodes\.push\(\s*createElement\(\s*["']small["']\s*,\s*\{\s*key:\s*["']description["']\s*\}\s*,\s*descriptionNode\s*\)\s*\)\s*;\s*\}\s*/g,
  "\n"
);

runtime = runtime.replace(
  /\n\s*if\s*\(\s*description\s*\)\s*\{\s*childrenNodes\.push\(\s*createElement\(\s*["']small["']\s*,\s*\{\s*key:\s*["']description["']\s*\}\s*,\s*description\s*\)\s*\)\s*;\s*\}\s*/g,
  "\n"
);

const runtimeHelperBlock = `
function safeAttr(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function boolAttr(value: unknown): string | undefined {
  return value === true ? "true" : undefined;
}

function mockStateClass(displayName: string, props: Record<string, unknown>): string {
  const parts = [
    "ncr-mock",
    \`ncr-mock-\${kebab(displayName)}\`
  ];

  const variant = safeAttr(props.variant);
  const tone = safeAttr(props.tone);
  const size = safeAttr(props.size);
  const radius = safeAttr(props.radius ?? props.radiusMode);

  if (variant) parts.push(\`ncr-variant-\${kebab(variant)}\`);
  if (tone) parts.push(\`ncr-tone-\${kebab(tone)}\`);
  if (size) parts.push(\`ncr-size-\${kebab(size)}\`);
  if (radius) parts.push(\`ncr-radius-\${kebab(radius)}\`);
  if (props.loading === true) parts.push("ncr-loading");
  if (props.disabled === true) parts.push("ncr-disabled");
  if (props.fullWidth === true) parts.push("ncr-full-width");

  return parts.join(" ");
}
`;

runtime = ensureBefore(runtime, "function createNoctraMock", runtimeHelperBlock);

const commonStart = runtime.indexOf("const commonProps: Record<string, any> = {");

if (commonStart >= 0) {
  const commonEnd = runtime.indexOf("\n    };", commonStart);

  if (commonEnd < 0) {
    throw new Error("commonProps block end not found.");
  }

  const commonReplacement = `const commonProps: Record<string, any> = {
      ...safeProps,
      ref,
      className: cx(mockStateClass(displayName, props as Record<string, unknown>), className),
      style: typeof style === "object" && style !== null && !Array.isArray(style) ? style : undefined,
      "data-variant": safeAttr((props as Record<string, unknown>).variant),
      "data-tone": safeAttr((props as Record<string, unknown>).tone),
      "data-size": safeAttr((props as Record<string, unknown>).size),
      "data-radius": safeAttr((props as Record<string, unknown>).radius ?? (props as Record<string, unknown>).radiusMode),
      "data-loading": boolAttr((props as Record<string, unknown>).loading),
      "data-disabled": boolAttr((props as Record<string, unknown>).disabled),
      "data-full-width": boolAttr((props as Record<string, unknown>).fullWidth)
    };`;

  runtime = `${runtime.slice(0, commonStart)}${commonReplacement}${runtime.slice(commonEnd + "\n    };".length)}`;
}

runtime = runtime.replace(
  /disabled: Boolean\(disabled\)/g,
  `disabled: Boolean(disabled || (props as Record<string, unknown>).loading === true)`
);

runtime = runtime.replace(
  /commonProps\.disabled = Boolean\(disabled(?: \|\| \(props as Record<string, unknown>\)\.loading === true)?\);/g,
  `commonProps.disabled = Boolean(disabled || (props as Record<string, unknown>).loading === true);`
);

writeText(runtimePath, runtime);

/* Sidebar: runtime export + fallback ile tüm componentleri yeniden yaz */
const componentLinks = collectRuntimeComponentLinks(runtime);

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

sidebar = `export type DocsSidebarLink = {
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

/* Eski MantineStyleComponentDocs varsa universal sisteme yönlendir */
if (existsSync(mantineStylePath)) {
  const mantineStyleWrapper = `import { UniversalComponentDocPage } from "../pages/UniversalComponentDocPage";

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

  writeText(mantineStylePath, mantineStyleWrapper);
}

/* CSS: inactive panel tamamen gizli */
const cssBlock = `
/* TABS_SEPARATE_PANELS_ALL_COMPONENTS_START */
html{scroll-behavior:smooth}
[id]{scroll-margin-top:28px}
.nmx-tab-panels{display:block}
.nmx-tab-panel{min-width:0}
.nmx-tab-panel[data-active="false"]{display:none!important}
.nmx-tab-panel[data-active="true"]{display:block}
.nmx-right-toc a{cursor:pointer}
.ncr-mock small,.ncr-mock-list{display:none!important}
.ncr-mock{transition:background .12s ease,border-color .12s ease,color .12s ease,transform .12s ease,opacity .12s ease,border-radius .12s ease;min-width:96px}
.ncr-mock:hover{transform:translateY(-1px)}
.ncr-mock.ncr-full-width{width:100%}
.ncr-mock.ncr-size-xs{min-height:26px;padding:0 9px;font-size:11px}
.ncr-mock.ncr-size-sm{min-height:30px;padding:0 11px;font-size:12px}
.ncr-mock.ncr-size-md{min-height:36px;padding:0 14px;font-size:13px}
.ncr-mock.ncr-size-lg{min-height:42px;padding:0 18px;font-size:14px}
.ncr-mock.ncr-size-xl{min-height:48px;padding:0 22px;font-size:15px}
.ncr-mock.ncr-radius-none{border-radius:0}
.ncr-mock.ncr-radius-xs{border-radius:4px}
.ncr-mock.ncr-radius-sm{border-radius:7px}
.ncr-mock.ncr-radius-md{border-radius:10px}
.ncr-mock.ncr-radius-lg{border-radius:14px}
.ncr-mock.ncr-radius-xl{border-radius:18px}
.ncr-mock.ncr-radius-full{border-radius:999px}
.ncr-mock.ncr-tone-neutral{background:rgba(148,163,184,.18);border-color:rgba(148,163,184,.35);color:#e5e7eb}
.ncr-mock.ncr-tone-primary{background:rgba(139,92,246,.34);border-color:rgba(139,92,246,.62);color:#ede9fe}
.ncr-mock.ncr-tone-success{background:rgba(34,197,94,.22);border-color:rgba(34,197,94,.50);color:#bbf7d0}
.ncr-mock.ncr-tone-warning{background:rgba(245,158,11,.22);border-color:rgba(245,158,11,.52);color:#fde68a}
.ncr-mock.ncr-tone-danger{background:rgba(239,68,68,.22);border-color:rgba(239,68,68,.52);color:#fecaca}
.ncr-mock.ncr-tone-info{background:rgba(56,189,248,.20);border-color:rgba(56,189,248,.50);color:#bae6fd}
.ncr-mock.ncr-variant-filled{box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.ncr-mock.ncr-variant-light{background:rgba(148,163,184,.10);border-color:rgba(148,163,184,.24)}
.ncr-mock.ncr-variant-outline{background:transparent}
.ncr-mock.ncr-variant-subtle{background:transparent;border-color:transparent}
.ncr-mock.ncr-variant-ghost{background:transparent;border-color:transparent;color:#c4b5fd}
.ncr-mock.ncr-loading{position:relative;color:transparent!important;pointer-events:none}
.ncr-mock.ncr-loading::after{content:"";position:absolute;width:14px;height:14px;border-radius:999px;border:2px solid currentColor;border-right-color:transparent;color:#fff;animation:ncr-spin .8s linear infinite}
.ncr-mock.ncr-disabled,.ncr-mock:disabled{opacity:.46;cursor:not-allowed;transform:none}
/* TABS_SEPARATE_PANELS_ALL_COMPONENTS_END */
`;

const cssPattern = /\/\* TABS_SEPARATE_PANELS_ALL_COMPONENTS_START \*\/[\s\S]*?\/\* TABS_SEPARATE_PANELS_ALL_COMPONENTS_END \*\//;

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
  "setActive(tab.id)"
]) {
  if (!afterDocsSystem.includes(required)) {
    problems.push(`NoctraMantineDocs missing: ${required}`);
  }
}

for (const required of [
  "safeComponentLabel",
  "const label = safeComponentLabel",
  "UniversalComponentDocPage"
]) {
  if (!afterUniversal.includes(required)) {
    problems.push(`UniversalComponentDocPage missing: ${required}`);
  }
}

if (/preview[`"']/.test(afterUniversal)) {
  problems.push("UniversalComponentDocPage still contains preview text.");
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

if (afterRuntime.includes('key: "description"') || afterRuntime.includes("key: 'description'")) {
  problems.push("Runtime mock still renders description small text.");
}

if (!afterSidebar.includes("docsSidebarSections") || !afterSidebar.includes("docsComponentLinks")) {
  problems.push("docsSidebarLinks missing required exports.");
}

if (componentLinks.length < 80) {
  problems.push(`Too few component links generated: ${componentLinks.length}.`);
}

for (const required of [
  "TABS_SEPARATE_PANELS_ALL_COMPONENTS_START",
  '.nmx-tab-panel[data-active="false"]{display:none!important}',
  '.nmx-tab-panel[data-active="true"]{display:block}',
  ".ncr-mock.ncr-tone-primary",
  ".ncr-mock.ncr-variant-outline"
]) {
  if (!afterCss.includes(required)) {
    problems.push(`CSS missing: ${required}`);
  }
}

if (existsSync(mantineStylePath) && !afterMantineStyle.includes("UniversalComponentDocPage")) {
  problems.push("MantineStyleComponentDocs not routed to UniversalComponentDocPage.");
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
  "# Tabs Separate Panels All Components Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraMantineDocs changed: ${beforeDocsSystem === afterDocsSystem ? "no" : "yes"}`,
  `UniversalComponentDocPage changed: ${beforeUniversal === afterUniversal ? "no" : "yes"}`,
  `Runtime changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `Sidebar changed: ${beforeSidebar === afterSidebar ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Component links generated: ${componentLinks.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Documentation / Props / Styles API now render as separate tab panels.",
  "- Inactive tab panels are not displayed below the active content.",
  "- TOC clicks activate the correct tab before scrolling.",
  "- Preview text like {item} preview is removed/sanitized.",
  "- Runtime state classes/data attributes remain active for all component previews.",
  "- Component sidebar links are regenerated from runtime exports plus fallback inventory.",
  "- MantineStyleComponentDocs is routed into the universal component docs system."
].join("\n");

writeText(reportPath, report);

console.log(`Tabs separate panels all components completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Tabs separate panels all components failed.");
}
