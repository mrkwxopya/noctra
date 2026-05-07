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

const slugAliases: Record<string, string> = {
  listbox: "list-box",
  creditcard: "credit-card",
  pincode: "pin-code",
  pininput: "pin-input",
  textinput: "text-input",
  searchinput: "search-input",
  passwordinput: "password-input",
  numberinput: "number-input",
  colorinput: "color-input",
  colorpicker: "color-picker",
  iconbutton: "icon-button",
  codeblock: "code-block",
  commandbar: "command-bar",
  datagrid: "data-grid",
  hovercard: "hover-card",
  contextmenu: "context-menu",
  multiselect: "multi-select",
  nativeselect: "native-select",
  segmentedcontrol: "segmented-control",
  rangeslider: "range-slider",
  scrollarea: "scroll-area",
  scrolllock: "scroll-lock",
  simplegrid: "simple-grid",
  statubar: "status-bar",
  tableofcontents: "table-of-contents",
  tagsinput: "tags-input",
  transferlist: "transfer-list",
  treeselect: "tree-select",
  treeview: "tree-view",
  visuallyhidden: "visually-hidden"
};

function slugify(value: string): string {
  const slug = value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return slugAliases[slug] ?? slug;
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

  return slugify(match?.[1] ?? "button");
}

function resolveSlug(props: UniversalComponentDocPageProps): string {
  const direct = props.componentSlug ?? props.slug ?? props.component?.slug ?? props.component?.kebab ?? props.component?.name;

  if (direct && typeof direct === "string") {
    return slugify(direct.replace(/^\/components\//, ""));
  }

  return getPathSlug();
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

function stateClass(state: VisualState): string {
  return [
    "ncu-visual",
    `ncr-variant-${state.variant}`,
    `ncr-tone-${state.tone}`,
    `ncr-size-${state.size}`,
    `ncr-radius-${state.radius}`,
    state.disabled ? "ncr-disabled" : "",
    state.loading ? "ncr-loading" : "",
    state.fullWidth ? "ncr-full-width" : ""
  ].filter(Boolean).join(" ");
}

type ComponentDocKind =
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
}

function runtimeComponent(slug: string): any {
  const name = pascalCase(slug);
  const runtime = NoctraRuntime as Record<string, any>;

  return runtime[name] ?? runtime.DefaultNoctraMock ?? "div";
}

function isButtonLike(slug: string): boolean {
  return /button|icon-button|clipboard|link|toolbar|command|command-bar/.test(slug);
}

function NativeVisual({
  slug,
  label,
  state
}: {
  slug: string;
  label: string;
  state: VisualState;
}) {
  const cls = stateClass(state);

  if (slug === "button" || isButtonLike(slug)) {
    const Component = runtimeComponent(slug);

    return (
      <div className="ncu-native-button">
        {createElement(
          Component,
          {
            variant: state.variant,
            tone: state.tone,
            size: state.size,
            radius: state.radius,
            disabled: state.disabled,
            loading: state.loading,
            fullWidth: state.fullWidth
          },
          label
        )}
      </div>
    );
  }

  if (/checkbox|radio|switch/.test(slug)) {
    return (
      <label className={`${cls} ncu-native-check`}>
        <input checked readOnly type={slug.includes("radio") ? "radio" : "checkbox"} />
        <span>{label}</span>
      </label>
    );
  }

  if (/segmented-control/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-segmented`}>
        <button aria-pressed="true" type="button">React</button>
        <button type="button">CSS</button>
        <button type="button">Docs</button>
      </div>
    );
  }

  if (/aspect-ratio/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-aspect`}>
        <div>
          <strong>16:9</strong>
          <span>{label}</span>
        </div>
      </div>
    );
  }

  if (/color-picker/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-color-picker`}>
        <div className="ncu-color-plane"><span /></div>
        <div className="ncu-color-row"><span /><span /><span /><span /></div>
        <code>#8B5CF6</code>
      </div>
    );
  }

  if (/divider/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-divider`}>
        <span>Before</span>
        <i />
        <span>After</span>
      </div>
    );
  }

  if (/dropzone/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-dropzone`}>
        <strong>Drop files here</strong>
        <span>SVG, PNG, JPG or JSON</span>
      </div>
    );
  }

  if (/float-label/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-float-label`}>
        <input readOnly value="Noctra" />
        <label>Floating label</label>
      </div>
    );
  }

  if (/form-field/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-form-field`}>
        <label>Email address</label>
        <input readOnly placeholder="name@example.com" />
        <small>Helper text for validation and guidance.</small>
      </div>
    );
  }

  if (/portal/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-portal`}>
        <span>Page</span>
        <strong>Portal layer</strong>
      </div>
    );
  }

  if (/prose/.test(slug)) {
    return (
      <article className={`${cls} ncu-native-prose`}>
        <h3>Readable content</h3>
        <p>Noctra prose styles keep documentation text calm, readable and aligned.</p>
      </article>
    );
  }

  if (/scroll-area/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-scroll-area`}>
        <span>Components</span>
        <span>Props</span>
        <span>Styles API</span>
        <span>Accessibility</span>
        <span>Examples</span>
      </div>
    );
  }

  if (/spacer/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-spacer`}>
        <span>Left</span>
        <i />
        <span>Right</span>
      </div>
    );
  }

  if (/status-bar/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-status-bar`}>
        <span>Ready</span>
        <span>3 warnings</span>
        <span>v0.0.0</span>
      </div>
    );
  }

  if (/visually-hidden/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-visually-hidden`}>
        <span aria-hidden="true">Visible label</span>
        <code>screen reader text</code>
      </div>
    );
  }

  if (/text-input|input|search-input|password-input|number-input|color-input|textarea|autocomplete|tags-input|pin-code|pin-input/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-field`}>
        <label>{label}</label>
        <input disabled={state.disabled} placeholder={`${label} value`} readOnly />
      </div>
    );
  }

  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-listbox`}>
        <label>{label}</label>
        <div role="listbox">
          <span aria-selected="true">Documentation</span>
          <span>Components</span>
          <span>Styles API</span>
        </div>
      </div>
    );
  }

  if (/card|paper|box|container|credit-card/.test(slug)) {
    return (
      <article className={`${cls} ncu-native-card`}>
        <header>
          <strong>{label}</strong>
          <span>Surface component</span>
        </header>
        <p>Structured content area for product interfaces.</p>
        <footer>
          <button type="button">Primary action</button>
          <button type="button">Secondary</button>
        </footer>
      </article>
    );
  }

  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-message`}>
        <strong>{label}</strong>
        <p>Clear feedback message with title and supporting text.</p>
      </div>
    );
  }

  if (/badge|code|inline-code|kbd|highlight/.test(slug)) {
    return <span className={`${cls} ncu-native-badge`}>{label}</span>;
  }

  if (/avatar/.test(slug)) {
    const initials = label
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return <span className={`${cls} ncu-native-avatar`}>{initials}</span>;
  }

  if (/slider|range-slider|progress|rating/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-meter`}>
        <strong>{label}</strong>
        <div><span /></div>
      </div>
    );
  }

  if (/table|data-grid|table-of-contents/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-table`}>
        <div><strong>Name</strong><strong>Status</strong><strong>Type</strong></div>
        <div><span>Noctra UI</span><span>Ready</span><span>Core</span></div>
        <div><span>Docs</span><span>Active</span><span>System</span></div>
      </div>
    );
  }

  if (/tabs/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-tabs`}>
        <div>
          <button type="button">Documentation</button>
          <button type="button">Props</button>
          <button type="button">Styles API</button>
        </div>
        <p>Active tab content is displayed here.</p>
      </div>
    );
  }

  if (/accordion/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-accordion`}>
        <strong>Component anatomy</strong>
        <p>Expandable content section.</p>
      </div>
    );
  }

  if (/breadcrumb|breadcrumbs/.test(slug)) {
    return <div className={`${cls} ncu-native-breadcrumb`}>Docs / Components / {label}</div>;
  }

  if (/pagination/.test(slug)) {
    return <div className={`${cls} ncu-native-pagination`}><button>1</button><button>2</button><button>3</button></div>;
  }

  if (/timeline|stepper/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-timeline`}>
        <span>Created</span>
        <span>Reviewed</span>
        <span>Released</span>
      </div>
    );
  }

  if (/modal|dialog|drawer|popover|hover-card|tooltip|menu|context-menu/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-overlay`}>
        <strong>{label}</strong>
        <p>Layered floating surface.</p>
      </div>
    );
  }

  if (/loader|spinner/.test(slug)) {
    return <span className={`${cls} ncu-native-spinner`} aria-label={label} />;
  }

  if (/skeleton/.test(slug)) {
    return <div className={`${cls} ncu-native-skeleton`}><span /><span /><span /></div>;
  }

  if (/grid|simple-grid|group|stack|flex|center|layout|layout-shell|app-shell|split-pane|resizable-panel|section|page|sidebar|dock|header|footer/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-layout`}>
        <span>Header</span>
        <span>Content</span>
        <span>Aside</span>
      </div>
    );
  }

  if (/tree|tree-view/.test(slug)) {
    return (
      <div className={`${cls} ncu-native-tree`}>
        <span>Components</span>
        <span>Forms</span>
        <span>Overlays</span>
      </div>
    );
  }

  return <span className={`${cls} ncu-native-generic`}>{label}</span>;
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
  return (
    <div className="ncu-stage">
      <NativeVisual label={label} slug={slug} state={state} />
    </div>
  );
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

function buildCode(slug: string, label: string, state: VisualState) {
  const name = pascalCase(slug);
  const kind = getComponentDocKind(slug);
  const lines: string[] = [];

  lines.push(`import { ${name} } from "@noctra/react";`);
  lines.push("");
  lines.push("export function Demo() {");
  lines.push("  return (");

  if (kind === "field") {
    lines.push(`    <${name}`);
    lines.push(`      label="${label}"`);
    lines.push('      placeholder="Enter value"');
    lines.push('      description="Helpful description"');
    lines.push(`      size="${state.size}"`);
    lines.push(`      radius="${state.radius}"`);
    lines.push("    />");
  } else if (kind === "selection") {
    lines.push(`    <${name}`);
    lines.push(`      label="${label}"`);
    lines.push('      placeholder="Pick one"');
    lines.push('      data={["Documentation", "Components", "Styles API"]}');
    lines.push(`      size="${state.size}"`);
    lines.push(`      radius="${state.radius}"`);
    lines.push("    />");
  } else if (kind === "overlay") {
    lines.push(`    <${name} opened title="${label}" onClose={() => {}}>`);
    lines.push("      Layered content goes here.");
    lines.push(`    </${name}>`);
  } else if (kind === "surface") {
    lines.push(`    <${name} withBorder padding="md" radius="${state.radius}">`);
    lines.push(`      <strong>${label}</strong>`);
    lines.push("      <p>Structured content surface.</p>");
    lines.push(`    </${name}>`);
  } else if (kind === "data") {
    lines.push(`    <${name}>`);
    lines.push("      <thead>");
    lines.push("        <tr><th>Name</th><th>Status</th></tr>");
    lines.push("      </thead>");
    lines.push("      <tbody>");
    lines.push("        <tr><td>Noctra UI</td><td>Ready</td></tr>");
    lines.push("      </tbody>");
    lines.push(`    </${name}>`);
  } else if (kind === "tabs") {
    lines.push(`    <${name} defaultValue="documentation">`);
    lines.push(`      <${name}.List>`);
    lines.push(`        <${name}.Tab value="documentation">Documentation</${name}.Tab>`);
    lines.push(`        <${name}.Tab value="props">Props</${name}.Tab>`);
    lines.push(`      </${name}.List>`);
    lines.push(`    </${name}>`);
  } else if (kind === "feedback") {
    lines.push(`    <${name} tone="${state.tone}" title="${label}">`);
    lines.push("      Feedback message content.");
    lines.push(`    </${name}>`);
  } else if (kind === "layout") {
    lines.push(`    <${name} gap="md">`);
    lines.push("      <div>Header</div>");
    lines.push("      <div>Content</div>");
    lines.push(`    </${name}>`);
  } else {
    lines.push(`    <${name}`);
    lines.push(`      variant="${state.variant}"`);
    lines.push(`      tone="${state.tone}"`);
    lines.push(`      size="${state.size}"`);
    lines.push(`      radius="${state.radius}"`);
    lines.push("    >");
    lines.push(`      ${label}`);
    lines.push(`    </${name}>`);
  }

  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function createPropsRows(slug: string, label: string): readonly NoctraDocsPropRow[] {
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
      { name: "disabled", type: "boolean", defaultValue: "false", description: `Disables the ${label} interaction.` },
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
}

function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
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
      <NoctraDocsPropsTable rows={createPropsRows(slug, meta.label)} />
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
      <NoctraDocsCodeBlock code={`.ncu-native-${slug}[data-variant="${variant}"] {
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
