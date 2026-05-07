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
import { getComponentDocsExampleCode } from "../data/componentDocsExamplesMap";
import { docsHref } from "../lib/docsRouting";
import { buildComponentSpecificCode, getComponentDocsDetail } from "../data/componentDocsDetailRegistry";

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
  const stateKey = [
    state.variant,
    state.tone,
    state.size,
    state.radius,
    state.disabled ? "disabled" : "enabled",
    state.loading ? "loading" : "idle",
    state.fullWidth ? "full" : "auto"
  ].join(":");

  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(true);

  if (slug === "button" || /button|icon-button|clipboard|link|toolbar|command|command-bar/.test(slug)) {
    const Component = runtimeComponent(slug);

    return (
      <div className="ncu-native-button" data-state-key={stateKey}>
        {createElement(
          Component,
          {
            key: stateKey,
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

  if (/modal|dialog|drawer|popover|hover-card|tooltip|menu|context-menu|portal/.test(slug)) {
    return (
      <div className={cls + " ncu-native-overlay-demo"} data-state-key={stateKey}>
        <button type="button" onClick={() => setOpened((value) => !value)}>
          {opened ? "Close " + label : "Open " + label}
        </button>

        {opened ? (
          <div className="ncu-native-overlay-panel" role="dialog" aria-modal="true">
            <header>
              <strong>{label}</strong>
              <button type="button" aria-label="Close" onClick={() => setOpened(false)}>×</button>
            </header>
            <p>Interactive overlay content is mounted from preview state.</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) {
    return (
      <div className={cls + " ncu-native-feedback-demo"} data-state-key={stateKey}>
        <button type="button" onClick={() => setVisible((value) => !value)}>
          {visible ? "Hide " + label : "Show " + label}
        </button>

        {visible ? (
          <div className="ncu-native-message">
            <strong>{label}</strong>
            <p>Feedback message is controlled by preview state.</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (/checkbox|radio|switch/.test(slug)) {
    return (
      <label className={cls + " ncu-native-check"} data-state-key={stateKey}>
        <input checked readOnly type={slug.includes("radio") ? "radio" : "checkbox"} />
        <span>{label}</span>
      </label>
    );
  }

  if (/segmented-control/.test(slug)) {
    return (
      <div className={cls + " ncu-native-segmented"} data-state-key={stateKey}>
        <button aria-pressed="true" type="button">React</button>
        <button type="button">CSS</button>
        <button type="button">Docs</button>
      </div>
    );
  }

  if (/aspect-ratio/.test(slug)) {
    return (
      <div className={cls + " ncu-native-aspect"} data-state-key={stateKey}>
        <div>
          <strong>16:9</strong>
          <span>{label}</span>
        </div>
      </div>
    );
  }

  if (/color-picker/.test(slug)) {
    return (
      <div className={cls + " ncu-native-color-picker"} data-state-key={stateKey}>
        <div className="ncu-color-plane"><span /></div>
        <div className="ncu-color-row"><span /><span /><span /><span /></div>
        <code>#8B5CF6</code>
      </div>
    );
  }

  if (/divider/.test(slug)) {
    return (
      <div className={cls + " ncu-native-divider"} data-state-key={stateKey}>
        <span>Before</span>
        <i />
        <span>After</span>
      </div>
    );
  }

  if (/dropzone/.test(slug)) {
    return (
      <div className={cls + " ncu-native-dropzone"} data-state-key={stateKey}>
        <strong>Drop files here</strong>
        <span>SVG, PNG, JPG or JSON</span>
      </div>
    );
  }

  if (/float-label/.test(slug)) {
    return (
      <div className={cls + " ncu-native-float-label"} data-state-key={stateKey}>
        <input readOnly value="Noctra" />
        <label>Floating label</label>
      </div>
    );
  }

  if (/form-field/.test(slug)) {
    return (
      <div className={cls + " ncu-native-form-field"} data-state-key={stateKey}>
        <label>Email address</label>
        <input readOnly placeholder="name@example.com" />
        <small>Helper text for validation and guidance.</small>
      </div>
    );
  }

  if (/prose/.test(slug)) {
    return (
      <article className={cls + " ncu-native-prose"} data-state-key={stateKey}>
        <h3>Readable content</h3>
        <p>Noctra prose styles keep documentation text calm, readable and aligned.</p>
      </article>
    );
  }

  if (/scroll-area/.test(slug)) {
    return (
      <div className={cls + " ncu-native-scroll-area"} data-state-key={stateKey}>
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
      <div className={cls + " ncu-native-spacer"} data-state-key={stateKey}>
        <span>Left</span>
        <i />
        <span>Right</span>
      </div>
    );
  }

  if (/status-bar/.test(slug)) {
    return (
      <div className={cls + " ncu-native-status-bar"} data-state-key={stateKey}>
        <span>Ready</span>
        <span>3 warnings</span>
        <span>v0.0.0</span>
      </div>
    );
  }

  if (/visually-hidden/.test(slug)) {
    return (
      <div className={cls + " ncu-native-visually-hidden"} data-state-key={stateKey}>
        <span aria-hidden="true">Visible label</span>
        <code>screen reader text</code>
      </div>
    );
  }

  if (/text-input|input|search-input|password-input|number-input|color-input|textarea|autocomplete|tags-input|pin-code|pin-input/.test(slug)) {
    return (
      <div className={cls + " ncu-native-field"} data-state-key={stateKey}>
        <label>{label}</label>
        <input disabled={state.disabled} placeholder={label + " value"} readOnly />
      </div>
    );
  }

  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list/.test(slug)) {
    return (
      <div className={cls + " ncu-native-listbox"} data-state-key={stateKey}>
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
      <article className={cls + " ncu-native-card"} data-state-key={stateKey}>
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

  if (/badge|code|inline-code|kbd|highlight/.test(slug)) {
    return <span className={cls + " ncu-native-badge"} data-state-key={stateKey}>{label}</span>;
  }

  if (/avatar/.test(slug)) {
    const initials = label
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return <span className={cls + " ncu-native-avatar"} data-state-key={stateKey}>{initials}</span>;
  }

  if (/slider|range-slider|progress|rating/.test(slug)) {
    return (
      <div className={cls + " ncu-native-meter"} data-state-key={stateKey}>
        <strong>{label}</strong>
        <div><span /></div>
      </div>
    );
  }

  if (/table|data-grid|table-of-contents/.test(slug)) {
    return (
      <div className={cls + " ncu-native-table"} data-state-key={stateKey}>
        <div><strong>Name</strong><strong>Status</strong><strong>Type</strong></div>
        <div><span>Noctra UI</span><span>Ready</span><span>Core</span></div>
        <div><span>Docs</span><span>Active</span><span>System</span></div>
      </div>
    );
  }

  if (/tabs/.test(slug)) {
    return (
      <div className={cls + " ncu-native-tabs"} data-state-key={stateKey}>
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
      <div className={cls + " ncu-native-accordion"} data-state-key={stateKey}>
        <strong>Component anatomy</strong>
        <p>Expandable content section.</p>
      </div>
    );
  }

  if (/breadcrumb|breadcrumbs/.test(slug)) {
    return <div className={cls + " ncu-native-breadcrumb"} data-state-key={stateKey}>Docs / Components / {label}</div>;
  }

  if (/pagination/.test(slug)) {
    return (
      <div className={cls + " ncu-native-pagination"} data-state-key={stateKey}>
        <button type="button">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
      </div>
    );
  }

  if (/timeline|stepper/.test(slug)) {
    return (
      <div className={cls + " ncu-native-timeline"} data-state-key={stateKey}>
        <span>Created</span>
        <span>Reviewed</span>
        <span>Released</span>
      </div>
    );
  }

  if (/loader|spinner/.test(slug)) {
    return <span className={cls + " ncu-native-spinner"} data-state-key={stateKey} aria-label={label} />;
  }

  if (/skeleton/.test(slug)) {
    return (
      <div className={cls + " ncu-native-skeleton"} data-state-key={stateKey}>
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (/grid|simple-grid|group|stack|flex|center|layout|layout-shell|app-shell|split-pane|resizable-panel|section|page|sidebar|dock|header|footer/.test(slug)) {
    return (
      <div className={cls + " ncu-native-layout"} data-state-key={stateKey}>
        <span>Header</span>
        <span>Content</span>
        <span>Aside</span>
      </div>
    );
  }

  if (/tree|tree-view/.test(slug)) {
    return (
      <div className={cls + " ncu-native-tree"} data-state-key={stateKey}>
        <span>Components</span>
        <span>Forms</span>
        <span>Overlays</span>
      </div>
    );
  }

  return <span className={cls + " ncu-native-generic"} data-state-key={stateKey}>{label}</span>;
}

function humanizeSlug(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
}

function buildCode(slug: string, label: string, state: VisualState) {
  return buildComponentSpecificCode(slug, label, {
    variant: state.variant,
    tone: state.tone,
    size: state.size,
    radius: state.radius,
    disabled: state.disabled,
    loading: state.loading,
    fullWidth: state.fullWidth
  });
}

function createPropsRows(slug: string, label: string): readonly NoctraDocsPropRow[] {
  const detail = getComponentDocsDetail(slug, label);

  return detail.props.map((prop) => ({
    name: prop.name,
    type: prop.type,
    defaultValue: prop.defaultValue,
    description: prop.required ? `${prop.description} Required.` : prop.description
  } as NoctraDocsPropRow));
}

function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
  const detail = getComponentDocsDetail(slug);

  return detail.styles.map((style) => ({
    selector: style.selector,
    value: style.value,
    description: style.description
  } as NoctraDocsStyleRow));
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
