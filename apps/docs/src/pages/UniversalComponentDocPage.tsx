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

type VisualState = {
  variant: string;
  tone: string;
  size: string;
  radius: string;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
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

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function safeComponentLabel(slug: string, value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text || /\{[^}]*\}/.test(text) || /^item$/i.test(text) || /preview$/i.test(text)) {
    return titleCase(slug);
  }

  return text.replace(/\s+preview$/i, "");
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

function getComponentMeta(slug: string) {
  const link = docsComponentLinks.find((item) => item.href.endsWith(`/${slug}`));
  const label = safeComponentLabel(slug, link?.label ?? titleCase(slug));

  return {
    label,
    href: link?.href ?? `/components/${slug}`,
    description: `${label} component documentation with usage, live controls, examples, props and styles API.`
  };
}

function isTextLike(slug: string): boolean {
  return /input|textarea|select|combobox|autocomplete|search|password|number|color|pin-code|pin-input|tags-input|multi-select|native-select/.test(slug);
}

function isChoiceLike(slug: string): boolean {
  return /checkbox|radio|switch|segmented-control|rating|slider|range-slider/.test(slug);
}

function isStatusLike(slug: string): boolean {
  return /badge|alert|notification|toast|progress|loader|spinner|skeleton|empty-state/.test(slug);
}

function isOverlayLike(slug: string): boolean {
  return /modal|dialog|drawer|popover|tooltip|hover-card|context-menu|menu|dropdown/.test(slug);
}

function isNavigationLike(slug: string): boolean {
  return /tabs|breadcrumb|breadcrumbs|pagination|stepper|timeline|table-of-contents|sidebar|dock|toolbar|command|command-bar/.test(slug);
}

function isDataLike(slug: string): boolean {
  return /table|data-grid|list-box|tree|tree-view|tree-select|transfer-list/.test(slug);
}

function isLayoutLike(slug: string): boolean {
  return /grid|group|stack|simple-grid|container|box|paper|card|layout|shell|section|center|flex|app-shell|split-pane|resizable-panel/.test(slug);
}

function createVisualChildren(slug: string, label: string): ReactNode {
  if (isTextLike(slug)) {
    return undefined;
  }

  if (slug.includes("card") || slug.includes("paper")) {
    return (
      <div className="ncu-card-sample">
        <strong>{label}</strong>
        <span>Clean content container for product interfaces.</span>
        <button type="button">Action</button>
      </div>
    );
  }

  if (slug.includes("avatar")) {
    return label
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (slug.includes("badge")) {
    return "Status";
  }

  if (slug.includes("alert") || slug.includes("notification") || slug.includes("toast")) {
    return (
      <div className="ncu-message-sample">
        <strong>{label}</strong>
        <span>Important interface feedback message.</span>
      </div>
    );
  }

  if (slug.includes("table") || slug.includes("data-grid")) {
    return (
      <div className="ncu-table-sample">
        <div><strong>Name</strong><strong>Status</strong></div>
        <div><span>Noctra UI</span><span>Ready</span></div>
        <div><span>Docs System</span><span>Active</span></div>
      </div>
    );
  }

  if (slug.includes("tabs")) {
    return (
      <div className="ncu-tabs-sample">
        <div><button type="button">Overview</button><button type="button">Settings</button></div>
        <p>Selected tab content</p>
      </div>
    );
  }

  if (slug.includes("breadcrumb")) {
    return "Docs / Components / Current";
  }

  if (slug.includes("pagination")) {
    return "1 2 3";
  }

  if (slug.includes("timeline")) {
    return (
      <div className="ncu-timeline-sample">
        <span>Created</span>
        <span>Reviewed</span>
        <span>Released</span>
      </div>
    );
  }

  if (slug.includes("modal") || slug.includes("dialog") || slug.includes("drawer")) {
    return (
      <div className="ncu-overlay-sample">
        <strong>{label}</strong>
        <span>Layered surface content</span>
      </div>
    );
  }

  if (slug.includes("menu") || slug.includes("popover") || slug.includes("tooltip") || slug.includes("hover-card")) {
    return "Open menu";
  }

  if (slug.includes("progress")) {
    return "68%";
  }

  if (slug.includes("loader") || slug.includes("spinner") || slug.includes("skeleton")) {
    return undefined;
  }

  if (slug.includes("accordion")) {
    return (
      <div className="ncu-accordion-sample">
        <strong>Section title</strong>
        <span>Expandable content</span>
      </div>
    );
  }

  if (isLayoutLike(slug)) {
    return (
      <div className="ncu-layout-sample">
        <span>Header</span>
        <span>Content</span>
        <span>Aside</span>
      </div>
    );
  }

  if (isChoiceLike(slug)) {
    return label;
  }

  if (isNavigationLike(slug) || isDataLike(slug) || isStatusLike(slug) || isOverlayLike(slug)) {
    return label;
  }

  return label;
}

function createVisualProps(slug: string, label: string, state: VisualState): Record<string, unknown> {
  const props: Record<string, unknown> = {
    variant: state.variant,
    tone: state.tone,
    size: state.size,
    radius: state.radius,
    disabled: state.disabled,
    loading: state.loading,
    fullWidth: state.fullWidth,
    title: label,
    label
  };

  if (isTextLike(slug)) {
    props.placeholder = `${label} value`;
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

function ComponentVisual({
  slug,
  label,
  state
}: {
  slug: string;
  label: string;
  state: VisualState;
}) {
  const Component = resolveComponent(slug);
  const props = createVisualProps(slug, label, state);
  const children = createVisualChildren(slug, label);

  return (
    <div className="ncu-stage">
      {createElement(Component, props, children)}
    </div>
  );
}

function buildCode(slug: string, label: string, state: VisualState) {
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
    { selector: `.ncr-mock-${slug}`, description: "Root selector.", value: "Selector" },
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

  const state = useMemo<VisualState>(
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
        description={`Default ${meta.label} usage with the shared Noctra documentation pattern.`}
        eyebrow="Usage"
        id="usage"
        title="Usage"
      >
        <NoctraDocsDemo
          code={buildCode(slug, meta.label, state)}
          preview={<ComponentVisual label={meta.label} slug={slug} state={state} />}
          title={meta.label}
        />
      </NoctraDocsSection>

      <NoctraDocsSection
        description="Change options and see the result immediately."
        eyebrow="Live controls"
        id="configurator"
        title="Configurator"
      >
        <div className="ncu-configurator">
          <div className="ncu-configurator-stage">
            <ComponentVisual label={meta.label} slug={slug} state={state} />
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
              <ComponentVisual label={meta.label} slug={slug} state={{ ...state, ...example }} />
              <code>{example.variant} / {example.tone}</code>
            </div>
          ))}
        </div>
      </NoctraDocsSection>
    </>
  );

  const propsPanel = (
    <NoctraDocsSection
      description={`Common ${meta.label} props exposed in the shared docs system.`}
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
