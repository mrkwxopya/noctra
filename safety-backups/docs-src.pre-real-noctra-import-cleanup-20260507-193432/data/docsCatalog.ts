import { docsHref } from "../lib/docsRouting";
export type DocsRouteId =
  | "home"
  | "getting-started"
  | "components"
  | "layout"
  | "theming"
  | "tokens"
  | "accessibility"
  | "release";

export type DocsComponentGroup = {
  title: string;
  description: string;
  components: string[];
};

export const docsRoutes: Array<{
  id: DocsRouteId;
  label: string;
  href: string;
  description: string;
}> = [
  {
    id: "home",
    label: "Overview",
    href: "/",
    description: "Noctra introduction, package overview, and project direction."
  },
  {
    id: "getting-started",
    label: "Getting Started",
    href: docsHref("/getting-started"),
    description: "Install, import styles, and render your first Noctra interface."
  },
  {
    id: "components",
    label: "Components",
    href: "/components",
    description: "Component inventory grouped by usage area."
  },
  {
    id: "layout",
    label: "Layout",
    href: docsHref("/layout"),
    description: "Page, Layout, Section, Grid, Stack, Group, Flex, and spacing primitives."
  },
  {
    id: "theming",
    label: "Theming",
    href: "/theming",
    description: "Dark mode, CSS variables, tones, variants, radius, density, and size conventions."
  },
  {
    id: "tokens",
    label: "Tokens",
    href: docsHref("/tokens"),
    description: "Token package structure and component token naming rules."
  },
  {
    id: "accessibility",
    label: "Accessibility",
    href: docsHref("/accessibility"),
    description: "Keyboard, focus, disabled state, aria, and reduced-motion expectations."
  },
  {
    id: "release",
    label: "Release",
    href: "/release",
    description: "Quality gates, reports, publish checklist, and package release readiness."
  }
];

export const componentGroups: DocsComponentGroup[] = [
  {
    title: "Layout primitives",
    description: "Core building blocks for app structure, dashboards, docs, and product pages.",
    components: [
      "Container",
      "Stack",
      "Group",
      "Grid",
      "SimpleGrid",
      "Box",
      "Flex",
      "Spacer",
      "Divider",
      "Paper",
      "Card",
      "Section",
      "Page",
      "Layout"
    ]
  },
  {
    title: "Inputs and controls",
    description: "Form controls and interactive primitives for product UI.",
    components: [
      "Button",
      "TextInput",
      "Textarea",
      "Select",
      "Checkbox",
      "Radio",
      "Switch",
      "Slider",
      "NumberInput",
      "PinCode",
      "FileInput",
      "Dropzone",
      "ColorPicker"]
  },
  {
    title: "Feedback",
    description: "User feedback, status, loading, and notification components.",
    components: [
      "Alert",
      "Badge",
      "Toast",
      "Notification",
      "Progress",
      "RingProgress",
      "Skeleton",
      "Loader",
      "EmptyState",
      "Result",
      "Kbd"
    ]
  },
  {
    title: "Navigation",
    description: "Navigation and discovery surfaces for docs, dashboards, and apps.",
    components: [
      "Tabs",
      "Breadcrumbs",
      "Pagination",
      "Stepper",
      "Menu",
      "Command",
      "TreeView",
      "Sidebar",
      "Navbar",
      "Anchor"
    ]
  },
  {
    title: "Overlay",
    description: "Layered UI surfaces for dialogs, popovers, drawers, and floating panels.",
    components: [
      "Modal",
      "Drawer",
      "Popover",
      "Tooltip",
      "HoverCard",
      "Dialog",
      "FocusTrap",
      "Portal",
      "Overlay"
    ]
  },
  {
    title: "Data display",
    description: "Structured content, visual data, media, and code display.",
    components: [
      "Table",
      "DataTable",
      "Timeline",
      "Accordion",
      "Avatar",
      "Image",
      "List",
      "CodeBlock",
      "InlineCode",
      "Clipboard",
      "CreditCard",
      "TransferList",
      "ListBox"
    ]
  }
];

export const toneItems = [
  "primary",
  "neutral",
  "success",
  "danger",
  "warning",
  "info"
];

export const variantItems = [
  "surface",
  "soft",
  "outline",
  "filled",
  "ghost",
  "elevated",
  "subtle",
  "interactive"
];

export const radiusItems = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "full"
];

export const densityItems = [
  "compact",
  "default",
  "comfortable"
];

export const qualityReports = [
  "final-quality-gate-report.md",
  "package-entry-point-audit-report.md",
  "dist-artifact-audit-report.md",
  "npm-pack-dry-run-audit-report.md",
  "workspace-dependency-boundary-audit-report.md",
  "release-metadata-audit-report.md",
  "component-inventory-audit-report.md",
  "component-prop-conflict-audit-report.md",
  "FINAL_RELEASE_DECISION.md",
  "PUBLISH_CHECKLIST.md",
  "RELEASE_NOTES.md"
];
