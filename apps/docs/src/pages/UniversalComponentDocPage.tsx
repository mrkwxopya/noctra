import { createElement, useMemo, useState, type ReactNode } from "react";
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
    .replace(/[\s_]+/g, "-")
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

function safeComponentLabel(slug: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text || /\{[^}]*\}/.test(text) || /^item$/i.test(text) || /preview$/i.test(text)) {
    return titleCase(slug);
  }

  return text.replace(/\s+preview$/i, "");
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

  const match = window.location.pathname.match(/\/components\/([^/?#]+)/);
  return match?.[1] ?? "button";
}

function resolveSlug(props: UniversalComponentDocPageProps): string {
  const direct = props.componentSlug ?? props.slug ?? props.component?.slug ?? props.component?.kebab ?? props.component?.name;

  if (direct && typeof direct === "string") {
    return slugify(direct.replace(/^\/components\//, ""));
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
      };

  if (isTextLike(slug)) {
    props.placeholder = `${label} placeholder`;
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

  return `import { ${name} } from "@noctra/react";

export function Demo() {
  return (
    <${name}
      variant="${state.variant}"
      tone="${state.tone}"
      size="${state.size}"
      radius="${state.radius}"
    >
      ${label}
    </${name}>
  );
}
`;
}

function getComponentMeta(slug: string) {
  const link = docsComponentLinks.find((item) => item.href.endsWith(`/${slug}`));
  const label = safeComponentLabel(slug, link?.label ?? titleCase(slug));

  return {
    label,
    href: link?.href ?? `/components/${slug}`,
    description: `${label} component documentation with usage, configurator, examples, props and styles API.`
  };
}

function createPropsRows(label: string): readonly NoctraDocsPropRow[] {
  return [
    { name: "variant", type: "filled | light | outline | subtle | ghost", defaultValue: "filled", description: "Controls the visual treatment." },
    { name: "tone", type: "primary | neutral | success | warning | danger | info", defaultValue: "primary", description: "Controls semantic color tone." },
    { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls component density and scale." },
    { name: "radius", type: "none | sm | md | lg | xl | full", defaultValue: "md", description: "Controls border radius." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: `Disables the ${label} interaction.` },
    { name: "children", type: "ReactNode", defaultValue: "—", description: "Main rendered content." }
  ];
}

function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
  return [
    { selector: `.ncr-mock-${slug}`, description: "Root preview selector.", value: "Selector" },
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
        description={`Default ${meta.label} usage with Noctra's Mantine-like documentation pattern.`}
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
            <div className="ncu-example-card" key={`${example.variant}-${example.tone}-${example.size}-${example.radius}`}>
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
      description={`Common ${meta.label} props exposed in the universal docs system.`}
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
      <NoctraDocsCodeBlock code={`.ncr-mock-${slug}[data-variant="${variant}"] {
  /* component state styling */
}`} />
    </NoctraDocsSection>
  );

  return (
    <NoctraMantineDocs
      description={meta.description}
      links={[
        { label: "Package", value: "@noctra/react" },
        { label: "Import", value: `import { ${pascalCase(slug)} } from "@noctra/react"` },
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
