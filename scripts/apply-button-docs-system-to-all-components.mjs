import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import ts from "typescript";

const universalPagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const detailPagePath = "apps/docs/src/pages/ComponentDetailPage.tsx";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "all-components-button-docs-system-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function ensureBefore(source, marker, block) {
  if (source.includes(block.trim().split("\n")[0])) return source;

  const index = source.indexOf(marker);

  if (index < 0) {
    throw new Error(`Marker not found: ${marker}`);
  }

  return `${source.slice(0, index)}${block.trimEnd()}\n\n${source.slice(index)}`;
}

const beforeDetail = readText(detailPagePath);
const beforeRuntime = readText(runtimePath);
const beforeCss = readText(cssPath);

const universalPage = `import { createElement, useMemo, useState, type ReactNode } from "react";
import {
  NoctraMantineDocs,
  NoctraDocsSection,
  NoctraDocsDemo,
  NoctraDocsPropsTable,
  NoctraDocsStylesTable,
  NoctraDocsCodeBlock,
  type NoctraDocsPropRow,
  type NoctraDocsStyleRow,
  type NoctraDocsTocItem
} from "../components/docs-system/NoctraMantineDocs";
import * as NoctraRuntime from "../components/docs-system/NoctraRuntimeMock";
import { docsComponentLinks } from "../data/docsSidebarLinks";
import { docsHref } from "../lib/docsRouting";

type UniversalComponentDocPageProps = {
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

type ControlOption = {
  label: string;
  value: string;
};

const variants: readonly ControlOption[] = [
  { label: "Filled", value: "filled" },
  { label: "Light", value: "light" },
  { label: "Outline", value: "outline" },
  { label: "Subtle", value: "subtle" },
  { label: "Ghost", value: "ghost" }
];

const tones: readonly ControlOption[] = [
  { label: "Primary", value: "primary" },
  { label: "Neutral", value: "neutral" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
  { label: "Info", value: "info" }
];

const sizes: readonly ControlOption[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" }
];

const radii: readonly ControlOption[] = [
  { label: "None", value: "none" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
  { label: "Full", value: "full" }
];

function slugify(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function pascalCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("");
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPathSlug(): string {
  if (typeof window === "undefined") return "button";

  const match = window.location.pathname.match(/\\/components\\/([^/?#]+)/);
  return match?.[1] ?? "button";
}

function resolveSlug(props: UniversalComponentDocPageProps): string {
  const direct = props.componentSlug ?? props.slug ?? props.component?.slug ?? props.component?.kebab ?? props.component?.name;

  if (direct && typeof direct === "string") {
    return slugify(direct.replace(/^\\/components\\//, ""));
  }

  return slugify(getPathSlug());
}

function resolveComponent(slug: string): any {
  const name = pascalCase(slug);
  const runtime = NoctraRuntime as Record<string, any>;

  return runtime[name] ?? runtime.DefaultNoctraMock ?? "div";
}

function isTextLike(slug: string): boolean {
  return /input|textarea|select|combobox|autocomplete|search|password|number|color/.test(slug);
}

function isChoiceLike(slug: string): boolean {
  return /checkbox|radio|switch/.test(slug);
}

function isLayoutLike(slug: string): boolean {
  return /grid|group|stack|simple-grid|container|box|paper|card|layout|shell|section|center|flex/.test(slug);
}

function createPreviewChildren(slug: string, label: string): ReactNode {
  if (isTextLike(slug)) return undefined;
  if (isChoiceLike(slug)) return label;
  if (slug.includes("avatar")) return label.slice(0, 2).toUpperCase();
  if (slug.includes("badge")) return label;
  if (slug.includes("loader") || slug.includes("spinner") || slug.includes("skeleton")) return undefined;
  if (isLayoutLike(slug)) return (
    <>
      <span className="ncu-sample-box">A</span>
      <span className="ncu-sample-box">B</span>
      <span className="ncu-sample-box">C</span>
    </>
  );

  return label;
}

function createPreviewProps(slug: string, label: string, state: Record<string, unknown>): Record<string, unknown> {
  const props: Record<string, unknown> = {
    variant: state.variant,
    tone: state.tone,
    size: state.size,
    radius: state.radius,
    disabled: state.disabled,
    loading: state.loading,
    fullWidth: state.fullWidth,
    title: label,
    label,
    description: \`\${label} preview\`
  };

  if (isTextLike(slug)) {
    props.placeholder = \`\${label} placeholder\`;
    props.value = "";
  }

  if (isChoiceLike(slug)) {
    props.checked = true;
  }

  return props;
}

function ControlGroup({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: readonly ControlOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="ncu-control-group">
      <label>{label}</label>
      <div className="ncu-control-options">
        {options.map((option) => (
          <button
            aria-pressed={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BooleanControl({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="ncu-boolean-control">
      <input
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function UniversalPreview({
  slug,
  label,
  state
}: {
  slug: string;
  label: string;
  state: Record<string, unknown>;
}) {
  const Component = resolveComponent(slug);
  const previewProps = createPreviewProps(slug, label, state);
  const children = createPreviewChildren(slug, label);

  return (
    <div className="ncu-preview-stage">
      {createElement(Component, previewProps, children)}
    </div>
  );
}

function buildCode(slug: string, label: string, state: Record<string, unknown>) {
  const name = pascalCase(slug);

  return \`import { \${name} } from "@noctra/react";

export function Demo() {
  return (
    <\${name}
      variant="\${state.variant}"
      tone="\${state.tone}"
      size="\${state.size}"
      radius="\${state.radius}"
    >
      \${label}
    </\${name}>
  );
}
\`;
}

function getComponentMeta(slug: string) {
  const link = docsComponentLinks.find((item) => item.href.endsWith(\`/\${slug}\`));
  const label = link?.label ?? titleCase(slug);

  return {
    label,
    href: link?.href ?? \`/components/\${slug}\`,
    description: \`\${label} component documentation with usage, configurator, examples, props and styles API.\`
  };
}

function createPropsRows(label: string): readonly NoctraDocsPropRow[] {
  return [
    { name: "variant", type: "filled | light | outline | subtle | ghost", defaultValue: "filled", description: "Controls the visual treatment." },
    { name: "tone", type: "primary | neutral | success | warning | danger | info", defaultValue: "primary", description: "Controls semantic color tone." },
    { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls component density and scale." },
    { name: "radius", type: "none | sm | md | lg | xl | full", defaultValue: "md", description: "Controls border radius." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: \`Disables the \${label} interaction.\` },
    { name: "children", type: "ReactNode", defaultValue: "—", description: "Main rendered content." }
  ];
}

function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
  return [
    { selector: \`.ncr-mock-\${slug}\`, description: "Root preview selector.", value: "Selector" },
    { selector: "[data-variant]", description: "Current variant state.", value: "Data attribute" },
    { selector: "[data-tone]", description: "Current tone state.", value: "Data attribute" },
    { selector: "[data-size]", description: "Current size state.", value: "Data attribute" },
    { selector: "[data-radius]", description: "Current radius state.", value: "Data attribute" }
  ];
}

export function UniversalComponentDocPage(props: UniversalComponentDocPageProps) {
  const slug = resolveSlug(props);
  const meta = getComponentMeta(slug);

  const [variant, setVariant] = useState("filled");
  const [tone, setTone] = useState("primary");
  const [size, setSize] = useState("md");
  const [radius, setRadius] = useState("md");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);

  const state = useMemo(
    () => ({
      variant,
      tone,
      size,
      radius,
      disabled,
      loading,
      fullWidth
    }),
    [variant, tone, size, radius, disabled, loading, fullWidth]
  );

  const toc: readonly NoctraDocsTocItem[] = [
    { href: "#usage", label: "Usage" },
    { href: "#configurator", label: "Configurator" },
    { href: "#examples", label: "Examples" },
    { href: "#props", label: "Props" },
    { href: "#styles-api", label: "Styles API" }
  ];

  const documentation = (
    <>
      <NoctraDocsSection
        description={\`Default \${meta.label} usage with Noctra's Mantine-like documentation pattern.\`}
        eyebrow="Usage"
        id="usage"
        title="Usage"
      >
        <NoctraDocsDemo
          code={buildCode(slug, meta.label, state)}
          preview={<UniversalPreview label={meta.label} slug={slug} state={state} />}
          title={meta.label}
        />
      </NoctraDocsSection>

      <NoctraDocsSection
        description="Change options and preview the result immediately."
        eyebrow="Live controls"
        id="configurator"
        title="Configurator"
      >
        <div className="ncu-configurator">
          <div className="ncu-configurator-preview">
            <UniversalPreview label={meta.label} slug={slug} state={state} />
          </div>

          <div className="ncu-configurator-controls">
            <ControlGroup label="Variant" onChange={setVariant} options={variants} value={variant} />
            <ControlGroup label="Tone" onChange={setTone} options={tones} value={tone} />
            <ControlGroup label="Size" onChange={setSize} options={sizes} value={size} />
            <ControlGroup label="Radius" onChange={setRadius} options={radii} value={radius} />

            <div className="ncu-boolean-grid">
              <BooleanControl checked={disabled} label="Disabled" onChange={setDisabled} />
              <BooleanControl checked={loading} label="Loading" onChange={setLoading} />
              <BooleanControl checked={fullWidth} label="Full width" onChange={setFullWidth} />
            </div>
          </div>
        </div>
      </NoctraDocsSection>

      <NoctraDocsSection
        description="Common visual combinations using the same docs system."
        eyebrow="Examples"
        id="examples"
        title="Examples"
      >
        <div className="ncu-example-grid">
          {[
            { variant: "filled", tone: "primary", size: "md", radius: "md" },
            { variant: "light", tone: "success", size: "md", radius: "lg" },
            { variant: "outline", tone: "warning", size: "lg", radius: "md" },
            { variant: "subtle", tone: "danger", size: "sm", radius: "full" }
          ].map((example) => (
            <div className="ncu-example-card" key={\`\${example.variant}-\${example.tone}-\${example.size}-\${example.radius}\`}>
              <UniversalPreview label={meta.label} slug={slug} state={{ ...state, ...example }} />
              <code>{example.variant} / {example.tone}</code>
            </div>
          ))}
        </div>
      </NoctraDocsSection>
    </>
  );

  const propsPanel = (
    <NoctraDocsSection
      description={\`Common \${meta.label} props exposed in the universal docs system.\`}
      eyebrow="Props"
      id="props"
      title="Props"
    >
      <NoctraDocsPropsTable rows={createPropsRows(meta.label)} />
    </NoctraDocsSection>
  );

  const stylesPanel = (
    <NoctraDocsSection
      description="Selectors and state attributes available for styling."
      eyebrow="Styles API"
      id="styles-api"
      title="Styles API"
    >
      <NoctraDocsStylesTable rows={createStylesRows(slug)} />
      <NoctraDocsCodeBlock code={\`.ncr-mock-\${slug}[data-variant="\${variant}"] {
  /* component state styling */
}\`} />
    </NoctraDocsSection>
  );

  return (
    <NoctraMantineDocs
      description={meta.description}
      links={[
        { label: "Package", value: "@noctra/react" },
        { label: "Import", value: \`import { \${pascalCase(slug)} } from "@noctra/react"\` },
        { label: "Source", value: "Component API", href: docsHref(meta.href) }
      ]}
      next={{ label: "Components", href: "/components" }}
      previous={{ label: "Overview", href: "/" }}
      props={propsPanel}
      documentation={documentation}
      styles={stylesPanel}
      title={meta.label}
      toc={toc}
    />
  );
}

export function ComponentDetailPage(props: UniversalComponentDocPageProps) {
  return <UniversalComponentDocPage {...props} />;
}

export default ComponentDetailPage;
`;

const detailPage = `import ComponentDetailPage, { UniversalComponentDocPage } from "./UniversalComponentDocPage";

export { UniversalComponentDocPage };

export { ComponentDetailPage };

export default ComponentDetailPage;
`;

writeText(universalPagePath, universalPage);
writeText(detailPagePath, detailPage);

let runtime = readText(runtimePath);

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

let css = readText(cssPath);

const cssBlock = `
/* ALL_COMPONENTS_BUTTON_DOCS_SYSTEM_START */
.ncd3-topbar{display:none!important}
.ncd3-content{min-height:100vh}
.ncu-preview-stage{display:flex;align-items:center;justify-content:center;min-height:120px;width:100%;padding:18px}
.ncu-configurator{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.24);overflow:hidden}
.ncu-configurator-preview{display:flex;align-items:center;justify-content:center;min-height:260px;padding:22px}
.ncu-configurator-controls{display:grid;align-content:start;gap:14px;padding:18px;border-left:1px solid var(--nmx-line);background:rgba(15,23,42,.20)}
.ncu-control-group{display:grid;gap:7px}.ncu-control-group>label{color:var(--nmx-muted);font-size:12px;font-weight:750}.ncu-control-options{display:flex;flex-wrap:wrap;gap:7px}.ncu-control-options button{appearance:none;border:1px solid var(--nmx-line);background:rgba(15,23,42,.38);color:var(--nmx-muted);border-radius:8px;padding:7px 10px;font:inherit;font-size:12px;cursor:pointer}.ncu-control-options button:hover{border-color:var(--nmx-line-strong);color:var(--nmx-text)}.ncu-control-options button[aria-pressed="true"]{border-color:rgba(139,92,246,.6);background:var(--nmx-accent-soft);color:#ddd6fe}
.ncu-boolean-grid{display:grid;gap:8px;padding-top:4px}.ncu-boolean-control{display:inline-flex;align-items:center;gap:8px;color:var(--nmx-muted);font-size:13px;cursor:pointer}.ncu-boolean-control input{accent-color:var(--nmx-accent)}
.ncu-example-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ncu-example-card{display:grid;gap:10px;align-items:center;justify-items:center;min-height:150px;padding:16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.22)}.ncu-example-card code{color:#c4b5fd}
.ncu-sample-box{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--nmx-line);border-radius:8px;background:rgba(148,163,184,.10);color:var(--nmx-text)}
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
@keyframes ncr-spin{to{transform:rotate(360deg)}}
@media (max-width:900px){.ncu-configurator{grid-template-columns:1fr}.ncu-configurator-controls{border-left:0;border-top:1px solid var(--nmx-line)}.ncu-example-grid{grid-template-columns:1fr}}
/* ALL_COMPONENTS_BUTTON_DOCS_SYSTEM_END */
`;

const cssPattern = /\/\* ALL_COMPONENTS_BUTTON_DOCS_SYSTEM_START \*\/[\s\S]*?\/\* ALL_COMPONENTS_BUTTON_DOCS_SYSTEM_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const afterUniversal = readText(universalPagePath);
const afterDetail = readText(detailPagePath);
const afterRuntime = readText(runtimePath);
const afterCss = readText(cssPath);

const problems = [];

for (const required of [
  "UniversalComponentDocPage",
  "NoctraMantineDocs",
  "Configurator",
  "NoctraDocsPropsTable",
  "NoctraDocsStylesTable",
  "docsComponentLinks",
  "resolveComponent"
]) {
  if (!afterUniversal.includes(required)) {
    problems.push(`Universal page missing: ${required}`);
  }
}

for (const required of [
  "ComponentDetailPage",
  "UniversalComponentDocPage"
]) {
  if (!afterDetail.includes(required)) {
    problems.push(`ComponentDetailPage wrapper missing: ${required}`);
  }
}

for (const required of [
  "mockStateClass(displayName",
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

for (const required of [
  "ALL_COMPONENTS_BUTTON_DOCS_SYSTEM_START",
  ".ncu-configurator",
  ".ncr-mock.ncr-tone-primary",
  ".ncr-mock.ncr-variant-outline",
  ".ncr-mock.ncr-size-xl",
  ".ncr-mock.ncr-radius-full"
]) {
  if (!afterCss.includes(required)) {
    problems.push(`CSS missing: ${required}`);
  }
}

for (const [file, source, kind] of [
  [universalPagePath, afterUniversal, ts.ScriptKind.TSX],
  [detailPagePath, afterDetail, ts.ScriptKind.TSX],
  [runtimePath, afterRuntime, ts.ScriptKind.TSX]
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
  "# All Components Button Docs System Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Universal page created: ${existsSync(universalPagePath) ? "yes" : "no"}`,
  `ComponentDetailPage changed: ${beforeDetail === afterDetail ? "no" : "yes"}`,
  `Runtime changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added UniversalComponentDocPage for all non-special component docs.",
  "- Replaced ComponentDetailPage with the universal Mantine-like docs system.",
  "- All component pages now get usage, configurator, examples, props and styles API.",
  "- Reused Button-like visual state system for variant, tone, size, radius, loading, disabled and fullWidth.",
  "- Applied state classes/data attributes to all runtime mock components, not only Button.",
  "- Hid docs top header globally."
].join("\n");

writeText(reportPath, report);

console.log(`All components button docs system completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("All components button docs system failed.");
}
