import type { ReactNode } from "react";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";

export type InteractiveDemoPreset = {
  title: string;
  description: string;
  children?: ReactNode;
  props?: Record<string, unknown>;
};

const sampleItems = [
  { value: "overview", label: "Overview" },
  { value: "components", label: "Components" },
  { value: "release", label: "Release" }
];

const sampleOptions = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "stable", label: "Stable" }
];

const sampleRows = [
  ["@noctra/react", "Ready"],
  ["@noctra/styles", "Ready"],
  ["@noctra/tokens", "Ready"]
];

const sampleColumns = ["Package", "Status"];

function svgDataUri(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><rect width="640" height="360" rx="32" fill="#050a12"/><rect x="24" y="24" width="592" height="312" rx="28" fill="url(#g)" opacity=".26"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="42" font-weight="700" fill="#f8fafc">${label}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function componentSupports(component: NoctraDocsComponent, propName: string) {
  return component.props.some((prop) => prop.name === propName);
}

export function getInteractiveDemoPreset(component: NoctraDocsComponent): InteractiveDemoPreset {
  const name = component.name;

  const base: InteractiveDemoPreset = {
    title: `${name} interactive demo`,
    description: `Real ${name} component rendered from @noctra/react with live controls.`,
    children: `${name} content`,
    props: {}
  };

  const byName: Record<string, InteractiveDemoPreset> = {
    Button: {
      title: "Button actions",
      description: "Real Button rendered with interactive state controls.",
      children: "Save changes",
      props: { type: "button" }
    },
    Card: {
      title: "Card surface",
      description: "Real Card rendered as a documentation/product surface.",
      children: "Use cards for dashboards, docs blocks, settings panels, and product surfaces.",
      props: { title: "Noctra Card", description: "Composable component surface." }
    },
    Alert: {
      title: "Alert feedback",
      description: "Real Alert rendered with status content.",
      children: "All release checks completed successfully.",
      props: { title: "Build passed" }
    },
    Badge: {
      title: "Badge status",
      description: "Real Badge rendered as a compact status indicator.",
      children: "Published",
      props: {}
    },
    TextInput: {
      title: "Text input",
      description: "Real TextInput rendered with label and placeholder.",
      props: { label: "Project name", placeholder: "Noctra", defaultValue: "Noctra" }
    },
    Textarea: {
      title: "Textarea",
      description: "Real Textarea rendered for longer content.",
      props: { label: "Release summary", placeholder: "Describe this release", defaultValue: "Professional docs and release gates." }
    },
    Select: {
      title: "Select",
      description: "Real Select rendered with sample options when supported.",
      props: { label: "Release channel", placeholder: "Select channel", options: sampleOptions, data: sampleOptions, items: sampleOptions, defaultValue: "alpha" }
    },
    Checkbox: {
      title: "Checkbox",
      description: "Real Checkbox rendered as a boolean control.",
      props: { label: "Enable professional docs", defaultChecked: true }
    },
    Radio: {
      title: "Radio",
      description: "Real Radio rendered as a single choice control.",
      props: { label: "Default density", name: "density", defaultChecked: true }
    },
    Switch: {
      title: "Switch",
      description: "Real Switch rendered as an on/off setting.",
      props: { label: "Dark mode", defaultChecked: true }
    },
    Slider: {
      title: "Slider",
      description: "Real Slider rendered with numeric bounds.",
      props: { label: "Progress", defaultValue: 60, min: 0, max: 100, step: 5 }
    },
    NumberInput: {
      title: "Number input",
      description: "Real NumberInput rendered with numeric bounds.",
      props: { label: "Package count", defaultValue: 4, min: 0, max: 20 }
    },
    PinCode: {
      title: "Pin code",
      description: "Real PinCode rendered for segmented input.",
      props: { length: 6, defaultValue: "123456" }
    },
    FileInput: {
      title: "File input",
      description: "Real FileInput rendered for upload flows.",
      props: { label: "Upload artifact", placeholder: "Select file" }
    },
    Dropzone: {
      title: "Dropzone",
      description: "Real Dropzone rendered for drag-and-drop upload flows.",
      children: "Drop release artifact here",
      props: { label: "Upload files" }
    },
    ColorPicker: {
      title: "Color picker",
      description: "Real ColorPicker rendered with default accent color.",
      props: { defaultValue: "#8b5cf6" }
    },
      title: "Date picker",
      props: { label: "Release date" }
    },
      title: "Date range picker",
      props: { label: "Release window" }
    },
    Modal: {
      title: "Modal",
      description: "Real Modal rendered with controlled open state.",
      children: "Confirm that all release gates passed before publishing.",
      props: { title: "Publish package" }
    },
    Drawer: {
      title: "Drawer",
      description: "Real Drawer rendered with controlled open state.",
      children: "Configure component settings, density, radius, and tokens.",
      props: { title: "Component settings" }
    },
    Popover: {
      title: "Popover",
      description: "Real Popover rendered with sample content.",
      children: "Popover content",
      props: { label: "Open popover", title: "Popover" }
    },
    Tooltip: {
      title: "Tooltip",
      description: "Real Tooltip rendered around a simple trigger.",
      children: "Hover target",
      props: { label: "Copy import statement" }
    },
    HoverCard: {
      title: "Hover card",
      description: "Real HoverCard rendered with docs content.",
      children: "Hover target",
      props: { title: "Noctra", description: "Component details" }
    },
    Dialog: {
      title: "Dialog",
      description: "Real Dialog rendered as a decision surface.",
      children: "Dialog content",
      props: { title: "Confirm action" }
    },
    Tabs: {
      title: "Tabs",
      description: "Real Tabs rendered with sample items when supported.",
      props: { items: sampleItems.map((item) => ({ ...item, content: `${item.label} panel` })), defaultValue: "overview" }
    },
    Menu: {
      title: "Menu",
      description: "Real Menu rendered with action items.",
      props: { items: sampleItems }
    },
    Command: {
      title: "Command",
      description: "Real Command rendered with command items.",
      props: { items: sampleItems, placeholder: "Search command..." }
    },
    TreeView: {
      title: "Tree view",
      description: "Real TreeView rendered with nested docs nodes.",
      props: { items: [{ value: "docs", label: "Docs", children: sampleItems }] }
    },
    Breadcrumbs: {
      title: "Breadcrumbs",
      description: "Real Breadcrumbs rendered with docs path.",
      props: { items: [{ label: "Docs", href: "/" }, { label: "Components", href: "/components" }, { label: component.name }] }
    },
    Pagination: {
      title: "Pagination",
      description: "Real Pagination rendered with sample page state.",
      props: { page: 2, total: 8, defaultPage: 2 }
    },
    Stepper: {
      title: "Stepper",
      description: "Real Stepper rendered with release steps.",
      props: { active: 1, items: sampleItems }
    },
    Table: {
      title: "Table",
      description: "Real Table rendered with package data.",
      props: { columns: sampleColumns, rows: sampleRows, data: sampleRows }
    },
    DataTable: {
      title: "Data table",
      description: "Real DataTable rendered with package data.",
      props: { columns: sampleColumns, rows: sampleRows, data: sampleRows }
    },
    Timeline: {
      title: "Timeline",
      description: "Real Timeline rendered with release milestones.",
      props: { items: sampleItems }
    },
    Accordion: {
      title: "Accordion",
      description: "Real Accordion rendered with expandable docs content.",
      props: { items: sampleItems.map((item) => ({ ...item, content: `${item.label} content` })) }
    },
    Avatar: {
      title: "Avatar",
      description: "Real Avatar rendered with generated initials.",
      props: { name: "Noctra", alt: "Noctra", src: svgDataUri("N") }
    },
    Image: {
      title: "Image",
      description: "Real Image rendered with generated SVG source.",
      props: { src: svgDataUri("Noctra"), alt: "Noctra preview" }
    },
    List: {
      title: "List",
      description: "Real List rendered with docs items.",
      props: { items: sampleItems },
      children: "Overview, Components, Release"
    },
    CodeBlock: {
      title: "Code block",
      description: "Real CodeBlock rendered with import example.",
      props: { code: 'import { Button } from "@noctra/react";' },
      children: 'import { Button } from "@noctra/react";'
    },
    InlineCode: {
      title: "Inline code",
      description: "Real InlineCode rendered with package name.",
      children: "@noctra/react",
      props: {}
    },
    Progress: {
      title: "Progress",
      description: "Real Progress rendered with completion value.",
      props: { value: 72, label: "Release readiness" }
    },
    RingProgress: {
      title: "Ring progress",
      description: "Real RingProgress rendered with completion value.",
      props: { value: 72, label: "Docs" }
    },
    Skeleton: {
      title: "Skeleton",
      description: "Real Skeleton rendered as loading placeholder.",
      props: {}
    },
    Loader: {
      title: "Loader",
      description: "Real Loader rendered as pending state.",
      props: { label: "Loading..." }
    },
    EmptyState: {
      title: "Empty state",
      description: "Real EmptyState rendered as no-content state.",
      props: { title: "No examples yet", description: "Add curated demos to improve this component page." }
    },
    Result: {
      title: "Result",
      description: "Real Result rendered as outcome state.",
      props: { title: "Release ready", description: "All checks passed." }
    },
    Kbd: {
      title: "Keyboard key",
      description: "Real Kbd rendered with shortcut content.",
      children: "Ctrl K",
      props: {}
    },
    Clipboard: {
      title: "Clipboard",
      description: "Real Clipboard rendered with copy value.",
      props: { value: "pnpm add @noctra/react", label: "Copy install command" }
    },
    CreditCard: {
      title: "Credit card",
      description: "Real CreditCard rendered with sample display data.",
      props: { brand: "Noctra", number: "4242 4242 4242 4242", name: "Noctra UI", expiry: "12/30" }
    },
    TransferList: {
      title: "Transfer list",
      description: "Real TransferList rendered with sample items.",
      props: { items: sampleItems, data: sampleItems }
    },
    ListBox: {
      title: "List box",
      description: "Real ListBox rendered with selectable items.",
      props: { items: sampleItems, options: sampleOptions, defaultValue: "overview" }
    }
  };

  return byName[name] ?? {
    ...base,
    children: `${name} preview`,
    props: {}
  };
}

export function buildInteractiveDemoProps(component: NoctraDocsComponent, state: {
  variant?: string;
  tone?: string;
  size?: string;
  radius?: string;
  density?: string;
  disabled?: boolean;
  open?: boolean;
}) {
  const preset = getInteractiveDemoPreset(component);
  const props: Record<string, unknown> = { ...(preset.props ?? {}) };

  const setIfSupported = (name: string, value: unknown) => {
    if (componentSupports(component, name) && value !== undefined && value !== "") {
      props[name] = value;
    }
  };

  setIfSupported("variant", state.variant);
  setIfSupported("tone", state.tone);
  setIfSupported("size", state.size);
  setIfSupported("radius", state.radius);
  setIfSupported("density", state.density);
  setIfSupported("disabled", state.disabled);
  setIfSupported("loading", false);
  setIfSupported("selected", false);
  setIfSupported("active", true);
  setIfSupported("open", state.open);
  setIfSupported("defaultOpen", state.open);

  setIfSupported("title", props.title ?? `${component.name} demo`);
  setIfSupported("description", props.description ?? component.description);
  setIfSupported("label", props.label ?? `${component.name} label`);
  setIfSupported("placeholder", props.placeholder ?? `${component.name} placeholder`);
  setIfSupported("items", props.items ?? sampleItems);
  setIfSupported("options", props.options ?? sampleOptions);
  setIfSupported("data", props.data ?? sampleItems);
  setIfSupported("columns", props.columns ?? sampleColumns);
  setIfSupported("rows", props.rows ?? sampleRows);
  setIfSupported("value", props.value);
  setIfSupported("defaultValue", props.defaultValue ?? "overview");
  setIfSupported("defaultChecked", props.defaultChecked ?? true);
  setIfSupported("src", props.src ?? svgDataUri(component.name));
  setIfSupported("alt", props.alt ?? `${component.name} preview`);

  if (componentSupports(component, "onOpenChange")) {
    props.onOpenChange = () => undefined;
  }

  if (componentSupports(component, "onChange")) {
    props.onChange = () => undefined;
  }

  return props;
}

export function getInteractiveDemoCode(component: NoctraDocsComponent) {
  const preset = getInteractiveDemoPreset(component);

  return `import { ${component.name} } from "@noctra/react";

export function Example() {
  return (
    <${component.name}>
      ${typeof preset.children === "string" ? preset.children : `${component.name} content`}
    </${component.name}>
  );
}`;
}
