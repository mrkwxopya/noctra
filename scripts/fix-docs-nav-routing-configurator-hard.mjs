import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import ts from "typescript";

const reportPath = "docs-nav-routing-configurator-hard-fix-report.md";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const staticPagePath = "apps/docs/src/pages/NoctraStaticDocsPage.tsx";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const routingPath = "apps/docs/src/lib/docsRouting.ts";
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const cssPath = "apps/docs/src/docs.css";
const fallbackGeneratorPath = "scripts/generate-static-route-fallbacks.mjs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function addSlash(href) {
  if (!href.startsWith("/")) return href;
  if (href === "/") return href;
  if (href.includes("?") || href.includes("#")) return href;
  if (/\.[a-z0-9]+$/i.test(href)) return href;

  return href.replace(/\/+$/, "") + "/";
}

function replaceFunctionBlock(source, name, replacement) {
  const candidates = [
    `export function ${name}`,
    `function ${name}`
  ];

  let start = -1;

  for (const candidate of candidates) {
    const index = source.indexOf(candidate);
    if (index >= 0) {
      start = index;
      break;
    }
  }

  if (start < 0) {
    throw new Error(`Could not find function ${name}.`);
  }

  const braceStart = source.indexOf("{", start);

  if (braceStart < 0) {
    throw new Error(`Could not find opening brace for ${name}.`);
  }

  let depth = 0;
  let end = -1;
  let quote = "";
  let escaped = false;

  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = "";
      }

      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      end = i + 1;
      break;
    }
  }

  if (end < 0) {
    throw new Error(`Could not find closing brace for ${name}.`);
  }

  return `${source.slice(0, start)}${replacement.trimEnd()}${source.slice(end)}`;
}

function replaceBetween(source, startNeedle, endNeedle, replacement) {
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

const beforePage = readText(pagePath);
const beforeStaticPage = readText(staticPagePath);
const beforeRuntime = readText(runtimePath);
const beforeRouting = readText(routingPath);
const beforeSidebar = readText(sidebarPath);
const beforeCss = readText(cssPath);
const beforeFallbackGenerator = readText(fallbackGeneratorPath);

let page = beforePage;
let staticPage = beforeStaticPage;
let runtime = beforeRuntime;
let routing = beforeRouting;
let sidebar = beforeSidebar;
let css = beforeCss;

const configuratorHelpers = `function humanizeSlug(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

type ComponentVisualProps = {
  slug?: string;
  label?: string;
  state?: VisualState;
  component?: {
    slug?: string;
    kebab?: string;
    name?: string;
    label?: string;
  };
  children?: ReactNode;
  [key: string]: unknown;
};

function fallbackVisualState(): VisualState {
  return {
    variant: "filled",
    tone: "primary",
    size: "md",
    radius: "md",
    disabled: false,
    loading: false,
    fullWidth: false
  };
}

function ComponentVisual({
  slug,
  label,
  state,
  component,
  children
}: ComponentVisualProps) {
  const resolvedSlug = slug ?? component?.slug ?? component?.kebab ?? "button";
  const resolvedLabel = label ?? component?.label ?? component?.name ?? humanizeSlug(resolvedSlug);
  const resolvedState = state ?? fallbackVisualState();

  return (
    <div className="ncu-component-visual">
      <NativeVisual slug={resolvedSlug} label={resolvedLabel} state={resolvedState} />
      {children ? <div className="ncu-component-visual-extra">{children}</div> : null}
    </div>
  );
}

type ControlGroupOption = string | {
  label?: ReactNode;
  value?: string;
  name?: string;
  disabled?: boolean;
  [key: string]: unknown;
};

type ControlGroupProps = {
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  selected?: string;
  options?: readonly ControlGroupOption[];
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  setValue?: (value: string) => void;
  children?: ReactNode;
  [key: string]: unknown;
};

function optionValue(option: ControlGroupOption) {
  if (typeof option === "string") return option;

  const raw = option.value ?? option.name ?? option.label;

  if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
    return String(raw);
  }

  return "";
}

function optionLabel(option: ControlGroupOption): ReactNode {
  if (typeof option === "string") return option;

  return option.label ?? option.name ?? option.value ?? "";
}

function emitControlChange(props: ControlGroupProps, value: string) {
  props.onChange?.(value);
  props.onValueChange?.(value);
  props.onSelect?.(value);
  props.setValue?.(value);
}

function ControlGroup(props: ControlGroupProps) {
  const {
    label,
    value,
    defaultValue,
    selected,
    options,
    children
  } = props;

  const currentValue = value ?? selected ?? defaultValue;

  if (children) {
    return (
      <div className="ncu-control-group">
        {label ? <span className="ncu-control-label">{label}</span> : null}
        <div className="ncu-control-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="ncu-control-group">
      {label ? <span className="ncu-control-label">{label}</span> : null}
      <div className="ncu-control-options">
        {(options ?? []).map((option, index) => {
          const resolvedValue = optionValue(option);

          return (
            <button
              key={resolvedValue || index}
              type="button"
              disabled={typeof option === "object" ? Boolean(option.disabled) : false}
              data-active={currentValue === resolvedValue ? "true" : undefined}
              onClick={() => emitControlChange(props, resolvedValue)}
            >
              {optionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type BooleanControlProps = {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  onCheckedChange?: (value: boolean) => void;
  setChecked?: (value: boolean) => void;
  children?: ReactNode;
  [key: string]: unknown;
};

function BooleanControl(props: BooleanControlProps) {
  const {
    label,
    checked,
    defaultChecked,
    value,
    children
  } = props;

  const isChecked = Boolean(checked ?? value ?? defaultChecked);

  function emit(value: boolean) {
    props.onChange?.(value);
    props.onCheckedChange?.(value);
    props.setChecked?.(value);
  }

  return (
    <label className="ncu-boolean-control">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(event) => emit(event.currentTarget.checked)}
      />
      <span>{children ?? label}</span>
    </label>
  );
}`;

if (page.includes("function humanizeSlug")) {
  page = replaceBetween(page, "function humanizeSlug", "function buildCode", `${configuratorHelpers}\n\n`);
} else if (page.includes("type ComponentVisualProps")) {
  page = replaceBetween(page, "type ComponentVisualProps", "function buildCode", `${configuratorHelpers}\n\n`);
} else {
  const marker = "function buildCode";

  if (!page.includes(marker)) {
    throw new Error("function buildCode marker not found.");
  }

  page = page.replace(marker, `${configuratorHelpers}\n\n${marker}`);
}

if (!runtime.includes("function safeAttr")) {
  runtime = runtime.replace(
    "function kebab(value: string)",
    `function safeAttr(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function kebab(value: string)`
  );
}

if (!runtime.includes("function boolAttr")) {
  runtime = runtime.replace(
    "function safeAttr(value: unknown): string | undefined",
    `function boolAttr(value: unknown): "true" | undefined {
  return value === true ? "true" : undefined;
}

function safeAttr(value: unknown): string | undefined`
  );
}

if (!runtime.includes("function mockStateClass")) {
  runtime = runtime.replace(
    "function createNoctraMock(displayName: string)",
    `function mockStateClass(displayName: string, props: Record<string, unknown>): string {
  const parts = ["ncr-mock", "ncr-mock-" + kebab(displayName)];
  const variant = safeAttr(props.variant);
  const tone = safeAttr(props.tone);
  const size = safeAttr(props.size);
  const radius = safeAttr(props.radius ?? props.radiusMode);

  if (variant) parts.push("ncr-variant-" + kebab(variant));
  if (tone) parts.push("ncr-tone-" + kebab(tone));
  if (size) parts.push("ncr-size-" + kebab(size));
  if (radius) parts.push("ncr-radius-" + kebab(radius));
  if (props.loading === true) parts.push("ncr-loading");
  if (props.disabled === true) parts.push("ncr-disabled");
  if (props.fullWidth === true) parts.push("ncr-full-width");

  return parts.join(" ");
}

function createNoctraMock(displayName: string)`
  );
}

runtime = runtime.replace(
  /className:\s*cx\("ncr-mock",\s*`ncr-mock-\$\{kebab\(displayName\)\}`,\s*className\)/g,
  'className: cx(mockStateClass(displayName, props as Record<string, unknown>), typeof className === "string" ? className : undefined)'
);

runtime = runtime.replace(
  /className:\s*cx\(mockStateClass\(displayName,\s*props as Record<string,\s*unknown>\),\s*className\)/g,
  'className: cx(mockStateClass(displayName, props as Record<string, unknown>), typeof className === "string" ? className : undefined)'
);

if (!runtime.includes('commonProps["data-variant"]')) {
  const marker = '    if (tag === "input" || tag === "textarea") {';
  const insert = `    commonProps["data-variant"] = safeAttr((props as Record<string, unknown>).variant);
    commonProps["data-tone"] = safeAttr((props as Record<string, unknown>).tone);
    commonProps["data-size"] = safeAttr((props as Record<string, unknown>).size);
    commonProps["data-radius"] = safeAttr((props as Record<string, unknown>).radius ?? (props as Record<string, unknown>).radiusMode);
    commonProps["data-loading"] = boolAttr((props as Record<string, unknown>).loading);
    commonProps["data-disabled"] = boolAttr((props as Record<string, unknown>).disabled);
    commonProps["data-full-width"] = boolAttr((props as Record<string, unknown>).fullWidth);

`;

  if (!runtime.includes(marker)) {
    throw new Error("Runtime input marker not found.");
  }

  runtime = runtime.replace(marker, insert + marker);
}

routing = routing.replace(
  /export function docsHref\(path = "\/"\): string \{[\s\S]*?\n\}/,
  `export function docsHref(path = "/"): string {
  const clean = cleanDocsPath(path);

  if (clean === "/") {
    return \`\${NOCTRA_DOCS_BASE}/\`;
  }

  return \`\${NOCTRA_DOCS_BASE}\${clean}/\`;
}`
);

routing = routing.replace(
  /componentSlug:\s*normalizeDocsComponentSlugAlias\(\s*clean\.replace\(["']\/components\/["'],\s*["']["']\)\s*\)/g,
  'componentSlug: normalizeDocsComponentSlugAlias(clean.replace(/^\\/components\\//, "").replace(/\\/+$/, ""))'
);

routing = routing.replace(
  /componentSlug:\s*clean\.replace\(["']\/components\/["'],\s*["']["']\)/g,
  'componentSlug: normalizeDocsComponentSlugAlias(clean.replace(/^\\/components\\//, "").replace(/\\/+$/, ""))'
);

sidebar = sidebar.replace(/(["']href["']\s*:\s*["'])(\/[^"']*?)(["'])/g, (_match, prefix, href, suffix) => {
  return prefix + addSlash(href) + suffix;
});

staticPage = staticPage.replace(
  /const docsLinks = \[[\s\S]*?\];/,
  `const docsLinks = [
  { label: "Overview", href: "/overview/" }
];`
);

const cssBlock = `
/* DOCS_NAV_ROUTING_CONFIGURATOR_HARD_FIX_START */

/* Docs left menu: keep only Overview. Component list remains visible. */
.nmx-left-rail a[href$="/components/"],
.nmx-left-rail a[href$="/architecture/"],
.nmx-left-rail a[href$="/theming/"],
.nmx-left-rail a[href$="/tokens/"],
.nmx-left-rail a[href$="/quality/"],
.nmx-left-rail a[href$="/release/"],
.nmx-left-rail a[href$="/getting-started/"],
.nmx-left-rail a[href$="/accessibility/"],
.ncd-left-rail a[href$="/components/"],
.ncd-left-rail a[href$="/architecture/"],
.ncd-left-rail a[href$="/theming/"],
.ncd-left-rail a[href$="/tokens/"],
.ncd-left-rail a[href$="/quality/"],
.ncd-left-rail a[href$="/release/"],
.ncd-left-rail a[href$="/getting-started/"],
.ncd-left-rail a[href$="/accessibility/"],
.ncd2-left-rail a[href$="/components/"],
.ncd2-left-rail a[href$="/architecture/"],
.ncd2-left-rail a[href$="/theming/"],
.ncd2-left-rail a[href$="/tokens/"],
.ncd2-left-rail a[href$="/quality/"],
.ncd2-left-rail a[href$="/release/"],
.ncd2-left-rail a[href$="/getting-started/"],
.ncd2-left-rail a[href$="/accessibility/"],
.ncd3-left-rail a[href$="/components/"],
.ncd3-left-rail a[href$="/architecture/"],
.ncd3-left-rail a[href$="/theming/"],
.ncd3-left-rail a[href$="/tokens/"],
.ncd3-left-rail a[href$="/quality/"],
.ncd3-left-rail a[href$="/release/"],
.ncd3-left-rail a[href$="/getting-started/"],
.ncd3-left-rail a[href$="/accessibility/"] {
  display: none !important;
}

/* Strong configurator visuals */
.ncu-control-group {
  display: grid;
  gap: 8px;
}

.ncu-control-label {
  color: var(--nmx-muted, #94a3b8);
  font-size: 12px;
  font-weight: 650;
}

.ncu-control-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ncu-control-options button,
.ncu-boolean-control {
  min-height: 30px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 9px;
  background: rgba(15, 23, 42, .58);
  color: var(--nmx-text, #f8fafc);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}

.ncu-control-options button {
  padding: 0 10px;
}

.ncu-control-options button[data-active="true"] {
  border-color: rgba(139, 92, 246, .62);
  background: rgba(139, 92, 246, .22);
  color: #ede9fe;
  box-shadow: 0 0 0 1px rgba(139, 92, 246, .22);
}

.ncu-control-options button:disabled {
  cursor: not-allowed;
  opacity: .45;
}

.ncu-boolean-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding: 0 10px;
}

.ncu-native-button [data-state-key],
.ncu-native-button .ncr-mock {
  transition: background .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease, min-height .16s ease;
}

.ncr-variant-outline,
.ncu-state-variant-outline {
  background: transparent !important;
  border-color: rgba(139, 92, 246, .62) !important;
  color: #ddd6fe !important;
}

.ncr-variant-light,
.ncu-state-variant-light {
  background: rgba(139, 92, 246, .14) !important;
  border-color: rgba(139, 92, 246, .28) !important;
  color: #ede9fe !important;
}

.ncr-variant-subtle,
.ncu-state-variant-subtle {
  background: transparent !important;
  border-color: transparent !important;
  color: #c4b5fd !important;
}

.ncr-tone-success,
.ncu-state-tone-success {
  border-color: rgba(34, 197, 94, .52) !important;
  color: #bbf7d0 !important;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, .18);
}

.ncr-tone-warning,
.ncu-state-tone-warning {
  border-color: rgba(245, 158, 11, .56) !important;
  color: #fde68a !important;
}

.ncr-tone-danger,
.ncu-state-tone-danger {
  border-color: rgba(239, 68, 68, .56) !important;
  color: #fecaca !important;
}

.ncr-size-xs,
.ncu-state-size-xs {
  min-height: 26px !important;
  font-size: 11px !important;
  padding-inline: 8px !important;
}

.ncr-size-sm,
.ncu-state-size-sm {
  min-height: 30px !important;
  font-size: 12px !important;
  padding-inline: 10px !important;
}

.ncr-size-lg,
.ncu-state-size-lg {
  min-height: 42px !important;
  font-size: 15px !important;
  padding-inline: 16px !important;
}

.ncr-size-xl,
.ncu-state-size-xl {
  min-height: 48px !important;
  font-size: 16px !important;
  padding-inline: 20px !important;
}

.ncr-radius-none,
.ncu-state-radius-none {
  border-radius: 0 !important;
}

.ncr-radius-sm,
.ncu-state-radius-sm {
  border-radius: 6px !important;
}

.ncr-radius-lg,
.ncu-state-radius-lg {
  border-radius: 14px !important;
}

.ncr-radius-xl,
.ncu-state-radius-xl {
  border-radius: 18px !important;
}

.ncr-radius-full,
.ncu-state-radius-full {
  border-radius: 999px !important;
}

.ncr-disabled,
.ncu-state-disabled {
  cursor: not-allowed !important;
  opacity: .48 !important;
}

.ncr-loading,
.ncu-state-loading {
  position: relative;
  opacity: .78;
}

.ncr-full-width,
.ncu-state-full-width {
  width: 100% !important;
  display: flex !important;
}

/* Hide Examples and bottom tail */
#examples,
[id="examples"],
[href="#examples"],
[aria-controls*="examples" i],
[data-section="examples"],
[data-panel="examples"],
[data-tab="examples"],
[data-value="examples"],
[value="examples"],
button[data-value="examples"],
button[value="examples"],
.nmx-examples,
.ncd-examples,
.ncd2-examples,
.ncd3-examples,
.ncu-examples,
.ncu-example-grid,
.ncu-example-card {
  display: none !important;
}

.nmx-prev-next,
.ncd-prev-next,
.ncd2-prev-next,
.ncd3-prev-next,
.nd-prev-next,
.ncd-docs-prev-next,
.ncd-page-prev-next,
[class*="previous-next"],
[class*="prev-next"] {
  display: none !important;
}

/* DOCS_NAV_ROUTING_CONFIGURATOR_HARD_FIX_END */
`;

const cssPattern = /\/\* DOCS_NAV_ROUTING_CONFIGURATOR_HARD_FIX_START \*\/[\s\S]*?\/\* DOCS_NAV_ROUTING_CONFIGURATOR_HARD_FIX_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

const fallbackGenerator = `import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const distRoot = "apps/docs/dist";
const indexPath = join(distRoot, "index.html");
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const reportPath = "static-route-fallbacks-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, \`\${content.trimEnd()}\\n\`, "utf8");
}

function cleanRoute(route) {
  if (!route || typeof route !== "string") return "/";
  let out = route.trim();

  if (!out.startsWith("/")) out = "/" + out;

  out = out.split("?")[0].split("#")[0];
  out = out.replace(/\\/+/g, "/");

  if (out !== "/") out = out.replace(/\\/+$/, "");

  return out || "/";
}

function addRoute(set, route) {
  const clean = cleanRoute(route);
  set.add(clean);

  if (clean !== "/") {
    set.add(clean + "/");
  }
}

function routeToIndexPath(route) {
  const clean = cleanRoute(route);

  if (clean === "/") return indexPath;

  return join(distRoot, clean.slice(1), "index.html");
}

function kebabToCompactAlias(slug) {
  return slug.replace(/-/g, "");
}

if (!existsSync(indexPath)) {
  throw new Error(\`Missing dist index: \${indexPath}\`);
}

const indexHtml = readText(indexPath);
const routes = new Set();

const generalRoutes = [
  "/",
  "/overview",
  "/getting-started",
  "/components",
  "/architecture",
  "/tokens",
  "/theming",
  "/quality",
  "/release",
  "/layout",
  "/accessibility"
];

for (const route of generalRoutes) {
  addRoute(routes, route);
}

const sidebar = readText(sidebarPath);
const hrefs = [...sidebar.matchAll(/href["']?\\s*:\\s*["']([^"']+)["']/g)]
  .map((match) => match[1])
  .filter((href) => href.startsWith("/"));

for (const href of hrefs) {
  addRoute(routes, href);

  if (href.startsWith("/components/")) {
    const slug = cleanRoute(href).replace("/components/", "");
    const compact = kebabToCompactAlias(slug);

    if (compact && compact !== slug) {
      addRoute(routes, \`/components/\${compact}\`);
    }
  }
}

const written = [];
const uniqueRoutes = [...routes]
  .map(cleanRoute)
  .filter((route, index, all) => all.indexOf(route) === index)
  .sort((a, b) => a.localeCompare(b));

for (const route of uniqueRoutes) {
  writeText(routeToIndexPath(route), indexHtml);
  written.push(route);

  if (route !== "/") {
    written.push(route + "/");
  }
}

writeText(join(distRoot, "404.html"), indexHtml);

const assetMatch = indexHtml.match(/assets\\/index-[^"]+\\.js/);
const asset = assetMatch ? assetMatch[0] : "";

const deployInfoPath = join(distRoot, "noctra-deploy-info.json");
let deployInfo = {};

if (existsSync(deployInfoPath)) {
  try {
    deployInfo = JSON.parse(readText(deployInfoPath));
  } catch {
    deployInfo = {};
  }
}

deployInfo = {
  ...deployInfo,
  generatedAt: new Date().toISOString(),
  sha: process.env.GITHUB_SHA || deployInfo.sha || "",
  asset: asset || deployInfo.asset || "",
  base: process.env.GITHUB_PAGES_BASE || deployInfo.base || "/noctra/",
  routeFallbacks: [...new Set(written)]
};

writeText(deployInfoPath, JSON.stringify(deployInfo, null, 2));

const important = [
  "/overview",
  "/overview/",
  "/components",
  "/components/",
  "/components/card",
  "/components/card/",
  "/components/modal",
  "/components/modal/",
  "/components/listbox",
  "/components/listbox/"
];

const problems = [];

for (const route of important) {
  const clean = cleanRoute(route);
  const outPath = routeToIndexPath(clean);

  if (!existsSync(outPath)) {
    problems.push(\`Missing generated fallback: \${route} -> \${outPath}\`);
  }
}

if (!asset) {
  problems.push("Could not detect Vite JS asset from index.html.");
}

const report = [
  "# Static Route Fallbacks Report",
  "",
  \`Generated: \${new Date().toISOString()}\`,
  "",
  \`Routes written: \${deployInfo.routeFallbacks.length}\`,
  \`Problems found: \${problems.length}\`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => \`- \${problem}\`) : ["- None"]),
  "",
  "## Important generated routes",
  "",
  ...important.map((route) => \`- \${route}\`),
  "",
  "## Applied",
  "",
  "- Generated general docs route fallbacks.",
  "- Generated component route fallbacks.",
  "- Generated compact aliases such as /components/listbox.",
  "- Recreated 404.html as SPA fallback.",
  "- Wrote routeFallbacks into noctra-deploy-info.json."
].join("\\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
`;

writeText(pagePath, page);
writeText(staticPagePath, staticPage);
writeText(runtimePath, runtime);
writeText(routingPath, routing);
writeText(sidebarPath, sidebar);
writeText(cssPath, css);
writeText(fallbackGeneratorPath, fallbackGenerator);

const afterPage = readText(pagePath);
const afterStaticPage = readText(staticPagePath);
const afterRuntime = readText(runtimePath);
const afterRouting = readText(routingPath);
const afterSidebar = readText(sidebarPath);
const afterCss = readText(cssPath);
const afterFallbackGenerator = readText(fallbackGeneratorPath);

const problems = [];

for (const marker of [
  "type ControlGroupOption",
  "onValueChange",
  "onSelect",
  "setValue",
  "onCheckedChange",
  "function ControlGroup",
  "function BooleanControl"
]) {
  if (!afterPage.includes(marker)) {
    problems.push(`Missing configurator marker: ${marker}`);
  }
}

for (const marker of [
  "mockStateClass(displayName",
  'commonProps["data-variant"]',
  'commonProps["data-full-width"]'
]) {
  if (!afterRuntime.includes(marker)) {
    problems.push(`Missing runtime marker: ${marker}`);
  }
}

for (const marker of [
  'return `${NOCTRA_DOCS_BASE}${clean}/`;',
  'replace(/^\\/components\\//, "").replace(/\\/+$/, "")'
]) {
  if (!afterRouting.includes(marker)) {
    problems.push(`Missing routing marker: ${marker}`);
  }
}

for (const marker of [
  'const docsLinks = [',
  '{ label: "Overview", href: "/overview/" }'
]) {
  if (!afterStaticPage.includes(marker)) {
    problems.push(`Missing static docs nav marker: ${marker}`);
  }
}

for (const marker of [
  "DOCS_NAV_ROUTING_CONFIGURATOR_HARD_FIX_START",
  'a[href$="/architecture/"]',
  ".ncu-control-options button[data-active=\"true\"]",
  "#examples",
  '[class*="prev-next"]'
]) {
  if (!afterCss.includes(marker)) {
    problems.push(`Missing CSS marker: ${marker}`);
  }
}

for (const marker of [
  "generalRoutes",
  "/components/card",
  "/components/card/",
  "routeFallbacks"
]) {
  if (!afterFallbackGenerator.includes(marker)) {
    problems.push(`Missing fallback generator marker: ${marker}`);
  }
}

for (const [file, source, kind] of [
  [pagePath, afterPage, ts.ScriptKind.TSX],
  [staticPagePath, afterStaticPage, ts.ScriptKind.TSX],
  [runtimePath, afterRuntime, ts.ScriptKind.TSX],
  [routingPath, afterRouting, ts.ScriptKind.TS],
  [sidebarPath, afterSidebar, ts.ScriptKind.TS],
  [fallbackGeneratorPath, afterFallbackGenerator, ts.ScriptKind.JS]
]) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Docs Nav Routing Configurator Hard Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${beforePage === afterPage ? "no" : "yes"}`,
  `NoctraStaticDocsPage changed: ${beforeStaticPage === afterStaticPage ? "no" : "yes"}`,
  `NoctraRuntimeMock changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `docsRouting changed: ${beforeRouting === afterRouting ? "no" : "yes"}`,
  `docsSidebarLinks changed: ${beforeSidebar === afterSidebar ? "no" : "yes"}`,
  `docs.css changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `fallback generator changed: ${beforeFallbackGenerator === afterFallbackGenerator ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Docs left menu now visually keeps only Overview in the Docs section.",
  "- Component list remains visible.",
  "- Static docs shell docsLinks now only contains Overview.",
  "- Configurator ControlGroup now supports string/object options and multiple change callback names.",
  "- BooleanControl now supports onChange, onCheckedChange and setChecked.",
  "- Runtime mock keeps variant/tone/size/radius/loading/disabled/fullWidth state classes and data attributes.",
  "- Internal docsHref output remains canonical trailing slash.",
  "- Component slug parser strips trailing slash before alias normalization.",
  "- Static route fallback generator includes general docs and component routes."
].join("\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
