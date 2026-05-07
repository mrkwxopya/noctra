import type { ReactNode } from "react";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";

export type DemoState = {
  variant: string;
  tone: string;
  size: string;
  radius: string;
  density: string;
  disabled: boolean;
  open: boolean;
  checked: boolean;
  value: string;
};

export type DemoAdapterResult = {
  title: string;
  description: string;
  props: Record<string, unknown>;
  children?: ReactNode;
};

export function hasProp(component: NoctraDocsComponent, propName: string) {
  return component.props.some((prop) => prop.name === propName);
}

const docsItems = [
  { value: "install", label: "Install", content: "Install @noctra/react and @noctra/styles." },
  { value: "theme", label: "Theme", content: "Override CSS variables to customize Noctra." },
  { value: "release", label: "Release", content: "Run release gates before publishing." }
];

const optionItems = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "stable", label: "Stable" }
];

const treeItems = [
  {
    value: "docs",
    label: "Docs",
    children: [
      { value: "overview", label: "Overview" },
      { value: "components", label: "Components" },
      { value: "release", label: "Release" }
    ]
  }
];

const tableColumns = ["Package", "Status", "Role"];

const tableRows = [
  ["@noctra/react", "Ready", "Components"],
  ["@noctra/styles", "Ready", "Styles"],
  ["@noctra/tokens", "Ready", "Tokens"]
];

function svgDataUri(label: string) {
  const safeLabel = label.replace(/[<>&"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><rect width="640" height="360" rx="32" fill="#050a12"/><rect x="24" y="24" width="592" height="312" rx="28" fill="url(#g)" opacity=".34"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="42" font-weight="800" fill="#f8fafc">${safeLabel}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setIfSupported(component: NoctraDocsComponent, props: Record<string, unknown>, key: string, value: unknown) {
  if (hasProp(component, key) && value !== undefined) {
    props[key] = value;
  }
}

function applyCommonProps(component: NoctraDocsComponent, props: Record<string, unknown>, state: DemoState) {
  setIfSupported(component, props, "variant", state.variant);
  setIfSupported(component, props, "tone", state.tone);
  setIfSupported(component, props, "size", state.size);
  setIfSupported(component, props, "radius", state.radius);
  setIfSupported(component, props, "density", state.density);
  setIfSupported(component, props, "disabled", state.disabled);
  setIfSupported(component, props, "open", state.open);
  setIfSupported(component, props, "defaultOpen", state.open);
  setIfSupported(component, props, "checked", state.checked);
  setIfSupported(component, props, "defaultChecked", state.checked);

  if (hasProp(component, "onChange")) props.onChange = () => undefined;
  if (hasProp(component, "onOpenChange")) props.onOpenChange = () => undefined;
  if (hasProp(component, "onClick")) props.onClick = () => undefined;
}

export function createRealDemoAdapter(component: NoctraDocsComponent, state: DemoState): DemoAdapterResult {
  const name = component.name;
  const props: Record<string, unknown> = {};

  applyCommonProps(component, props, state);

  const result: DemoAdapterResult = {
    title: `${name} playground`,
    description: `Real ${name} component rendered from @noctra/react in an isolated iframe preview.`,
    props,
    children: `${name} content`
  };

  const byName: Record<string, () => DemoAdapterResult> = {
    Accordion: () => ({
      ...result,
      title: "Accordion playground",
      description: "Real Accordion with item data.",
      props: { ...props, items: docsItems, data: docsItems, defaultValue: "install" },
      children: undefined
    }),

    Tabs: () => ({
      ...result,
      title: "Tabs playground",
      description: "Real Tabs with panels and default selected tab.",
      props: { ...props, items: docsItems, data: docsItems, defaultValue: "install" },
      children: undefined
    }),

    Table: () => ({
      ...result,
      title: "Table playground",
      description: "Real Table using rows and columns.",
      props: { ...props, columns: tableColumns, rows: tableRows, data: tableRows },
      children: undefined
    }),

    DataTable: () => ({
      ...result,
      title: "DataTable playground",
      description: "Real DataTable using package rows.",
      props: { ...props, columns: tableColumns, rows: tableRows, data: tableRows },
      children: undefined
    }),

    Breadcrumbs: () => ({
      ...result,
      title: "Breadcrumbs playground",
      description: "Real Breadcrumbs using docs path items.",
      props: {
        ...props,
        items: [
          { label: "Docs", href: "/noctra/" },
          { label: "Components", href: "/noctra/components" },
          { label: name }
        ]
      },
      children: undefined
    }),

    Select: () => ({
      ...result,
      title: "Select playground",
      description: "Real Select using option data.",
      props: {
        ...props,
        label: "Release channel",
        placeholder: "Select channel",
        options: optionItems,
        items: optionItems,
        data: optionItems,
        defaultValue: "alpha"
      },
      children: undefined
    }),

    ListBox: () => ({
      ...result,
      title: "ListBox playground",
      description: "Real ListBox using selectable option data.",
      props: { ...props, options: optionItems, items: optionItems, data: optionItems, defaultValue: "alpha" },
      children: undefined
    }),

    Menu: () => ({
      ...result,
      title: "Menu playground",
      description: "Real Menu using action items.",
      props: { ...props, items: optionItems, data: optionItems, label: "Actions" },
      children: undefined
    }),

    Command: () => ({
      ...result,
      title: "Command playground",
      description: "Real Command using command items.",
      props: { ...props, items: optionItems, data: optionItems, placeholder: "Search command..." },
      children: undefined
    }),

    TreeView: () => ({
      ...result,
      title: "TreeView playground",
      description: "Real TreeView using nested items.",
      props: { ...props, items: treeItems, data: treeItems },
      children: undefined
    }),

    Modal: () => ({
      ...result,
      title: "Modal playground",
      description: "Real Modal opened inside the isolated preview frame.",
      props: { ...props, open: state.open, defaultOpen: state.open, title: "Publish package" },
      children: "Confirm that all release gates passed before publishing."
    }),

    Drawer: () => ({
      ...result,
      title: "Drawer playground",
      description: "Real Drawer opened inside the isolated preview frame.",
      props: { ...props, open: state.open, defaultOpen: state.open, title: "Component settings" },
      children: "Configure density, radius, tone, and variant."
    }),

    Popover: () => ({
      ...result,
      title: "Popover playground",
      description: "Real Popover with trigger/content props when supported.",
      props: { ...props, open: state.open, defaultOpen: state.open, label: "Open popover", title: "Popover" },
      children: "Popover trigger"
    }),

    Tooltip: () => ({
      ...result,
      title: "Tooltip playground",
      description: "Real Tooltip with label and child trigger.",
      props: { ...props, label: "Copy import statement" },
      children: "Hover target"
    }),

    TextInput: () => ({
      ...result,
      title: "TextInput playground",
      description: "Real TextInput with label, placeholder, and value.",
      props: { ...props, label: "Project name", placeholder: "Noctra", value: state.value, onChange: () => undefined },
      children: undefined
    }),

    Textarea: () => ({
      ...result,
      title: "Textarea playground",
      description: "Real Textarea with label and value.",
      props: { ...props, label: "Release summary", placeholder: "Describe release changes", value: state.value, onChange: () => undefined },
      children: undefined
    }),

    Checkbox: () => ({
      ...result,
      title: "Checkbox playground",
      description: "Real Checkbox with checked state.",
      props: { ...props, label: "Enable professional docs", checked: state.checked, onChange: () => undefined },
      children: undefined
    }),

    Switch: () => ({
      ...result,
      title: "Switch playground",
      description: "Real Switch with checked state.",
      props: { ...props, label: "Dark mode", checked: state.checked, onChange: () => undefined },
      children: undefined
    }),

    Radio: () => ({
      ...result,
      title: "Radio playground",
      description: "Real Radio with checked state.",
      props: { ...props, label: "Default density", name: "density", checked: state.checked, onChange: () => undefined },
      children: undefined
    }),

    Slider: () => ({
      ...result,
      title: "Slider playground",
      description: "Real Slider with numeric value.",
      props: { ...props, label: "Release readiness", value: 72, min: 0, max: 100, step: 1, onChange: () => undefined },
      children: undefined
    }),

    NumberInput: () => ({
      ...result,
      title: "NumberInput playground",
      description: "Real NumberInput with numeric value.",
      props: { ...props, label: "Package count", value: 4, min: 0, max: 20, onChange: () => undefined },
      children: undefined
    }),

    Avatar: () => ({
      ...result,
      title: "Avatar playground",
      description: "Real Avatar using name and generated image source.",
      props: { ...props, name: "Noctra", alt: "Noctra", src: svgDataUri("N") },
      children: undefined
    }),

    Image: () => ({
      ...result,
      title: "Image playground",
      description: "Real Image using generated SVG source.",
      props: { ...props, src: svgDataUri("Noctra"), alt: "Noctra preview" },
      children: undefined
    }),

    Progress: () => ({
      ...result,
      title: "Progress playground",
      description: "Real Progress with value.",
      props: { ...props, value: 72, label: "Release readiness" },
      children: undefined
    }),

    RingProgress: () => ({
      ...result,
      title: "RingProgress playground",
      description: "Real RingProgress with value.",
      props: { ...props, value: 72, label: "Docs" },
      children: undefined
    }),

    EmptyState: () => ({
      ...result,
      title: "EmptyState playground",
      description: "Real EmptyState with title and description.",
      props: { ...props, title: "No examples yet", description: "Add curated demos to improve this component page." },
      children: undefined
    }),

    Result: () => ({
      ...result,
      title: "Result playground",
      description: "Real Result with outcome content.",
      props: { ...props, title: "Release ready", description: "All checks passed." },
      children: undefined
    }),

    CodeBlock: () => ({
      ...result,
      title: "CodeBlock playground",
      description: "Real CodeBlock with source text.",
      props: { ...props, code: 'import { Button } from "@noctra/react";' },
      children: 'import { Button } from "@noctra/react";'
    }),

    InlineCode: () => ({
      ...result,
      title: "InlineCode playground",
      description: "Real InlineCode with package name.",
      props,
      children: "@noctra/react"
    }),

    Kbd: () => ({
      ...result,
      title: "Kbd playground",
      description: "Real Kbd with shortcut content.",
      props,
      children: "Ctrl K"
    })
  };

  if (byName[name]) return byName[name]();

  setIfSupported(component, props, "title", `${name} demo`);
  setIfSupported(component, props, "description", component.description);
  setIfSupported(component, props, "label", `${name} label`);
  setIfSupported(component, props, "placeholder", `${name} placeholder`);
  setIfSupported(component, props, "items", docsItems);
  setIfSupported(component, props, "options", optionItems);
  setIfSupported(component, props, "data", docsItems);
  setIfSupported(component, props, "columns", tableColumns);
  setIfSupported(component, props, "rows", tableRows);
  setIfSupported(component, props, "src", svgDataUri(name));
  setIfSupported(component, props, "alt", `${name} preview`);

  return {
    ...result,
    props
  };
}

export function getRealDemoCode(component: NoctraDocsComponent) {
  return `import { ${component.name} } from "@noctra/react";

export function Example() {
  return (
    <${component.name}>
      ${component.name} content
    </${component.name}>
  );
}`;
}