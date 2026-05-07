import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const docsSystemPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const universalPath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";
const mantineStylePath = "apps/docs/src/components/MantineStyleComponentDocs.tsx";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "toc-preview-universal-system-fix-report.md";

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

let docsSystem = readText(docsSystemPath);
let universal = readText(universalPath);
let runtime = readText(runtimePath);
let css = readText(cssPath);

const beforeDocsSystem = docsSystem;
const beforeUniversal = universal;
const beforeRuntime = runtime;
const beforeCss = css;

/* 1) TOC gerçek scroll yapsın */
const scrollHelper = `
function scrollToDocsTarget(href: string): void {
  if (typeof window === "undefined") return;
  if (!href.startsWith("#")) return;

  const id = href.slice(1);
  if (!id) return;

  window.requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    window.history.replaceState(null, "", href);
  });
}
`;

docsSystem = ensureBefore(docsSystem, "function cx", scrollHelper);

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
                scrollToDocsTarget(item.href);
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

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="nmx-tabs-shell">
      <div className="nmx-tabs" role="tablist" aria-label="Docs sections">
        {tabs.map((tab) => (
          <button
            aria-selected={tab.id === active}
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              scrollToDocsTarget(\`#\${tab.id}\`);
            }}
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
            aria-label={tab.label}
            className="nmx-tab-panel"
            data-active={tab.id === active ? "true" : "false"}
            id={tab.id}
            key={tab.id}
            role="tabpanel"
          >
            {tab.node}
          </section>
        ))}
      </div>
    </div>
  );
}
`;

docsSystem = replaceFunction(docsSystem, "NoctraDocsTabs", tabsReplacement);

writeText(docsSystemPath, docsSystem);

/* 2) Universal component page: label temizle, {item} preview açıklamasını kaldır */
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
  /const label = link\?\.label \?\? titleCase\(slug\);/,
  `const label = safeComponentLabel(slug, link?.label ?? titleCase(slug));`
);

universal = universal.replace(
  /description: `\$\{label\} preview`,?\n/g,
  ""
);

universal = universal.replace(
  /description: `\$\{label\} preview`/g,
  ""
);

writeText(universalPath, universal);

/* 3) Runtime mock: description küçük yazısını tamamen kaldır; state class kesin uygulansın */
runtime = runtime.replace(
  /    if \(description\) \{\s*childrenNodes\.push\(createElement\("small", \{ key: "description" \}, description\)\);\s*\}\s*/g,
  ""
);

const helperBlock = `
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

runtime = ensureBefore(runtime, "function createNoctraMock", helperBlock);

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

/* 4) Eski generated/MantineStyleComponentDocs kullanılıyorsa onu da universal sisteme bağla */
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

if (existsSync(mantineStylePath)) {
  writeText(mantineStylePath, mantineStyleWrapper);
}

/* 5) CSS: tab panelleri DOM'da görünür olsun, TOC scroll offset, preview text yok */
const cssBlock = `
/* TOC_PREVIEW_UNIVERSAL_SYSTEM_FIX_START */
html{scroll-behavior:smooth}
[id]{scroll-margin-top:26px}
.nmx-tab-panels{display:grid;gap:38px}
.nmx-tab-panel{min-width:0}
.nmx-tab-panel[data-active="false"]{display:block}
.nmx-tab-panel:not(:last-child){padding-bottom:4px;border-bottom:1px solid var(--nmx-line)}
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
/* TOC_PREVIEW_UNIVERSAL_SYSTEM_FIX_END */
`;

const cssPattern = /\/\* TOC_PREVIEW_UNIVERSAL_SYSTEM_FIX_START \*\/[\s\S]*?\/\* TOC_PREVIEW_UNIVERSAL_SYSTEM_FIX_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const afterDocsSystem = readText(docsSystemPath);
const afterUniversal = readText(universalPath);
const afterRuntime = readText(runtimePath);
const afterCss = readText(cssPath);
const afterMantineStyle = existsSync(mantineStylePath) ? readText(mantineStylePath) : "";

const problems = [];

for (const required of [
  "scrollToDocsTarget",
  "onClick={(event)",
  "nmx-tab-panels",
  "data-active"
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

if (afterUniversal.includes("preview`,") || afterUniversal.includes("preview`")) {
  problems.push("UniversalComponentDocPage still contains preview description template.");
}

for (const required of [
  "className: cx(mockStateClass",
  '"data-variant"',
  '"data-tone"',
  '"data-size"',
  '"data-radius"'
]) {
  if (!afterRuntime.includes(required)) {
    problems.push(`Runtime mock missing: ${required}`);
  }
}

if (afterRuntime.includes('key: "description"')) {
  problems.push("Runtime mock still renders description small text.");
}

for (const required of [
  "TOC_PREVIEW_UNIVERSAL_SYSTEM_FIX_START",
  ".ncr-mock small,.ncr-mock-list{display:none!important}",
  ".nmx-tab-panels",
  "scroll-behavior:smooth"
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
  "# TOC Preview Universal System Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraMantineDocs changed: ${beforeDocsSystem === afterDocsSystem ? "no" : "yes"}`,
  `UniversalComponentDocPage changed: ${beforeUniversal === afterUniversal ? "no" : "yes"}`,
  `Runtime mock changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Fixed right Table of contents clicks with real smooth scrolling.",
  "- Rendered Documentation / Props / Styles sections in DOM so TOC can scroll to all of them.",
  "- Removed preview description text from runtime mock.",
  "- Sanitized invalid labels like {item}.",
  "- Forced MantineStyleComponentDocs to use UniversalComponentDocPage.",
  "- Re-applied state classes/data attributes for all component previews."
].join("\n");

writeText(reportPath, report);

console.log(`TOC preview universal system fix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("TOC preview universal system fix failed.");
}
