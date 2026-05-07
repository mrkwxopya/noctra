export type ComponentDocsKind =
  | "buttonLike"
  | "field"
  | "selection"
  | "overlay"
  | "surface"
  | "feedback"
  | "data"
  | "layout"
  | "navigation"
  | "display"
  | "meter"
  | "choice"
  | "special";

export type ComponentDocsPropDetail = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  required: boolean;
};

export type ComponentDocsStyleDetail = {
  selector: string;
  value: string;
  description: string;
};

export type ComponentDocsDetail = {
  slug: string;
  label: string;
  kind: ComponentDocsKind;
  description: string;
  previewKind: string;
  whenToUse: readonly string[];
  whenNotToUse: readonly string[];
  props: readonly ComponentDocsPropDetail[];
  styles: readonly ComponentDocsStyleDetail[];
  anatomy: readonly string[];
  accessibility: readonly string[];
};

export type ComponentDocsVisualState = {
  variant?: string;
  tone?: string;
  size?: string;
  radius?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const commonProps = [
  {
    name: "id",
    type: "string",
    defaultValue: "—",
    description: "Sets the root element id.",
    required: false
  },
  {
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Adds a custom class to the root element.",
    required: false
  },
  {
    name: "style",
    type: "CSSProperties",
    defaultValue: "—",
    description: "Adds inline style overrides when needed.",
    required: false
  },
  {
    name: "data-*",
    type: "string",
    defaultValue: "—",
    description: "Supports data attributes for states, testing and styling hooks.",
    required: false
  }
] as const;

const propsByKind: Record<ComponentDocsKind, readonly ComponentDocsPropDetail[]> = {
  buttonLike: [
    {
      name: "variant",
      type: '"filled" | "outline" | "light" | "subtle" | "ghost"',
      defaultValue: '"filled"',
      description: "Controls the visual treatment.",
      required: false
    },
    {
      name: "tone",
      type: '"primary" | "neutral" | "success" | "warning" | "danger"',
      defaultValue: '"primary"',
      description: "Controls semantic color intent.",
      required: false
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "Controls height, spacing and font size.",
      required: false
    },
    {
      name: "radius",
      type: '"none" | "sm" | "md" | "lg" | "xl" | "full"',
      defaultValue: '"md"',
      description: "Controls border radius.",
      required: false
    },
    {
      name: "leftSection",
      type: "ReactNode",
      defaultValue: "—",
      description: "Content rendered before the label.",
      required: false
    },
    {
      name: "rightSection",
      type: "ReactNode",
      defaultValue: "—",
      description: "Content rendered after the label.",
      required: false
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "Shows loading state and disables interaction.",
      required: false
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables user interaction.",
      required: false
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "Makes the component fill its parent width.",
      required: false
    },
    {
      name: "onClick",
      type: "MouseEventHandler",
      defaultValue: "—",
      description: "Called when the component is clicked.",
      required: false
    }
  ],
  field: [
    {
      name: "label",
      type: "ReactNode",
      defaultValue: "—",
      description: "Label displayed above the input.",
      required: false
    },
    {
      name: "description",
      type: "ReactNode",
      defaultValue: "—",
      description: "Helper text displayed below the label.",
      required: false
    },
    {
      name: "error",
      type: "ReactNode",
      defaultValue: "—",
      description: "Validation message and invalid state trigger.",
      required: false
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "—",
      description: "Placeholder text.",
      required: false
    },
    {
      name: "value",
      type: "string",
      defaultValue: "—",
      description: "Controlled value.",
      required: false
    },
    {
      name: "defaultValue",
      type: "string",
      defaultValue: "—",
      description: "Initial uncontrolled value.",
      required: false
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: "Marks the field as required.",
      required: false
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the field.",
      required: false
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      defaultValue: "—",
      description: "Called when the field value changes.",
      required: false
    }
  ],
  selection: [
    {
      name: "data",
      type: "string[] | SelectItem[]",
      defaultValue: "[]",
      description: "Options rendered by the component.",
      required: false
    },
    {
      name: "value",
      type: "string | string[]",
      defaultValue: "—",
      description: "Controlled selected value.",
      required: false
    },
    {
      name: "defaultValue",
      type: "string | string[]",
      defaultValue: "—",
      description: "Initial uncontrolled selected value.",
      required: false
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "—",
      description: "Placeholder displayed when nothing is selected.",
      required: false
    },
    {
      name: "searchable",
      type: "boolean",
      defaultValue: "false",
      description: "Enables option filtering when supported.",
      required: false
    },
    {
      name: "clearable",
      type: "boolean",
      defaultValue: "false",
      description: "Allows clearing selected value.",
      required: false
    },
    {
      name: "onChange",
      type: "(value: string | string[]) => void",
      defaultValue: "—",
      description: "Called when selected value changes.",
      required: false
    }
  ],
  overlay: [
    {
      name: "opened",
      type: "boolean",
      defaultValue: "false",
      description: "Controls whether the overlay is mounted.",
      required: false
    },
    {
      name: "onClose",
      type: "() => void",
      defaultValue: "—",
      description: "Called when the overlay requests closing.",
      required: false
    },
    {
      name: "title",
      type: "ReactNode",
      defaultValue: "—",
      description: "Header title content.",
      required: false
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "Controls overlay width or surface size.",
      required: false
    },
    {
      name: "centered",
      type: "boolean",
      defaultValue: "false",
      description: "Centers the overlay when supported.",
      required: false
    },
    {
      name: "closeOnEscape",
      type: "boolean",
      defaultValue: "true",
      description: "Closes when Escape is pressed.",
      required: false
    },
    {
      name: "closeOnClickOutside",
      type: "boolean",
      defaultValue: "true",
      description: "Closes when backdrop is clicked.",
      required: false
    },
    {
      name: "trapFocus",
      type: "boolean",
      defaultValue: "true",
      description: "Keeps focus inside the overlay.",
      required: false
    },
    {
      name: "zIndex",
      type: "number",
      defaultValue: "—",
      description: "Controls stacking order.",
      required: false
    }
  ],
  surface: [
    {
      name: "withBorder",
      type: "boolean",
      defaultValue: "false",
      description: "Shows a visible border.",
      required: false
    },
    {
      name: "shadow",
      type: '"none" | "sm" | "md" | "lg"',
      defaultValue: '"sm"',
      description: "Controls surface elevation.",
      required: false
    },
    {
      name: "padding",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "Controls inner spacing.",
      required: false
    },
    {
      name: "radius",
      type: '"none" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "Controls surface radius.",
      required: false
    },
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "Surface content.",
      required: false
    }
  ],
  feedback: [
    {
      name: "title",
      type: "ReactNode",
      defaultValue: "—",
      description: "Optional message title.",
      required: false
    },
    {
      name: "tone",
      type: '"info" | "success" | "warning" | "danger"',
      defaultValue: '"info"',
      description: "Semantic feedback tone.",
      required: false
    },
    {
      name: "variant",
      type: '"filled" | "light" | "outline"',
      defaultValue: '"light"',
      description: "Controls message visual treatment.",
      required: false
    },
    {
      name: "withCloseButton",
      type: "boolean",
      defaultValue: "false",
      description: "Shows a dismiss button.",
      required: false
    },
    {
      name: "onClose",
      type: "() => void",
      defaultValue: "—",
      description: "Called when dismissed.",
      required: false
    }
  ],
  data: [
    {
      name: "data",
      type: "unknown[]",
      defaultValue: "[]",
      description: "Rows, cells or tree nodes displayed by the component.",
      required: false
    },
    {
      name: "columns",
      type: "ColumnDef[]",
      defaultValue: "[]",
      description: "Column definitions when applicable.",
      required: false
    },
    {
      name: "withBorder",
      type: "boolean",
      defaultValue: "false",
      description: "Shows table border.",
      required: false
    },
    {
      name: "striped",
      type: "boolean",
      defaultValue: "false",
      description: "Alternates row background.",
      required: false
    },
    {
      name: "highlightOnHover",
      type: "boolean",
      defaultValue: "false",
      description: "Highlights row on hover.",
      required: false
    },
    {
      name: "stickyHeader",
      type: "boolean",
      defaultValue: "false",
      description: "Keeps header visible while scrolling.",
      required: false
    }
  ],
  layout: [
    {
      name: "gap",
      type: '"xs" | "sm" | "md" | "lg" | "xl" | number',
      defaultValue: '"md"',
      description: "Controls spacing between children.",
      required: false
    },
    {
      name: "align",
      type: "CSS align-items",
      defaultValue: "—",
      description: "Controls cross-axis alignment.",
      required: false
    },
    {
      name: "justify",
      type: "CSS justify-content",
      defaultValue: "—",
      description: "Controls main-axis distribution.",
      required: false
    },
    {
      name: "wrap",
      type: "boolean",
      defaultValue: "false",
      description: "Allows children to wrap when supported.",
      required: false
    },
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "Layout content.",
      required: false
    }
  ],
  navigation: [
    {
      name: "value",
      type: "string",
      defaultValue: "—",
      description: "Controlled active value.",
      required: false
    },
    {
      name: "defaultValue",
      type: "string",
      defaultValue: "—",
      description: "Initial active value.",
      required: false
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      defaultValue: "—",
      description: "Called when active item changes.",
      required: false
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: "Controls navigation direction.",
      required: false
    }
  ],
  display: [
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "Displayed content.",
      required: false
    },
    {
      name: "tone",
      type: "string",
      defaultValue: "—",
      description: "Optional semantic color tone.",
      required: false
    },
    {
      name: "variant",
      type: "string",
      defaultValue: "—",
      description: "Optional visual variant.",
      required: false
    },
    {
      name: "size",
      type: "string",
      defaultValue: "—",
      description: "Optional display size.",
      required: false
    }
  ],
  meter: [
    {
      name: "value",
      type: "number",
      defaultValue: "0",
      description: "Current numeric value.",
      required: false
    },
    {
      name: "min",
      type: "number",
      defaultValue: "0",
      description: "Minimum value.",
      required: false
    },
    {
      name: "max",
      type: "number",
      defaultValue: "100",
      description: "Maximum value.",
      required: false
    },
    {
      name: "animated",
      type: "boolean",
      defaultValue: "false",
      description: "Animates visual motion when supported.",
      required: false
    }
  ],
  choice: [
    {
      name: "checked",
      type: "boolean",
      defaultValue: "false",
      description: "Controlled checked state.",
      required: false
    },
    {
      name: "defaultChecked",
      type: "boolean",
      defaultValue: "false",
      description: "Initial uncontrolled checked state.",
      required: false
    },
    {
      name: "label",
      type: "ReactNode",
      defaultValue: "—",
      description: "Visible choice label.",
      required: false
    },
    {
      name: "onChange",
      type: "(checked: boolean) => void",
      defaultValue: "—",
      description: "Called when checked state changes.",
      required: false
    }
  ],
  special: [
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "Component content.",
      required: false
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables interaction when supported.",
      required: false
    }
  ]
};

const stylesByKind: Record<ComponentDocsKind, readonly ComponentDocsStyleDetail[]> = {
  buttonLike: [
    {
      selector: "root",
      value: "Selector",
      description: "Interactive root element."
    },
    {
      selector: "label",
      value: "Selector",
      description: "Text label wrapper."
    },
    {
      selector: "leftSection",
      value: "Selector",
      description: "Left accessory slot."
    },
    {
      selector: "rightSection",
      value: "Selector",
      description: "Right accessory slot."
    },
    {
      selector: "--button-height",
      value: "CSS variable",
      description: "Resolved button height."
    },
    {
      selector: "data-variant",
      value: "Data attribute",
      description: "Current visual variant."
    },
    {
      selector: "data-tone",
      value: "Data attribute",
      description: "Current semantic tone."
    }
  ],
  field: [
    {
      selector: "root",
      value: "Selector",
      description: "Field root wrapper."
    },
    {
      selector: "label",
      value: "Selector",
      description: "Label element."
    },
    {
      selector: "input",
      value: "Selector",
      description: "Native input or input-like element."
    },
    {
      selector: "description",
      value: "Selector",
      description: "Helper text."
    },
    {
      selector: "error",
      value: "Selector",
      description: "Validation text."
    },
    {
      selector: "--input-height",
      value: "CSS variable",
      description: "Resolved field height."
    },
    {
      selector: "data-invalid",
      value: "Data attribute",
      description: "Invalid state marker."
    }
  ],
  selection: [
    {
      selector: "root",
      value: "Selector",
      description: "Selection root wrapper."
    },
    {
      selector: "input",
      value: "Selector",
      description: "Trigger or text input area."
    },
    {
      selector: "dropdown",
      value: "Selector",
      description: "Floating options list."
    },
    {
      selector: "option",
      value: "Selector",
      description: "Single option item."
    },
    {
      selector: "--dropdown-z-index",
      value: "CSS variable",
      description: "Dropdown stacking layer."
    },
    {
      selector: "data-selected",
      value: "Data attribute",
      description: "Selected option marker."
    }
  ],
  overlay: [
    {
      selector: "root",
      value: "Selector",
      description: "Overlay root."
    },
    {
      selector: "overlay",
      value: "Selector",
      description: "Backdrop element."
    },
    {
      selector: "content",
      value: "Selector",
      description: "Floating content surface."
    },
    {
      selector: "header",
      value: "Selector",
      description: "Header area."
    },
    {
      selector: "body",
      value: "Selector",
      description: "Body area."
    },
    {
      selector: "--overlay-z-index",
      value: "CSS variable",
      description: "Overlay stacking layer."
    }
  ],
  surface: [
    {
      selector: "root",
      value: "Selector",
      description: "Surface root."
    },
    {
      selector: "header",
      value: "Selector",
      description: "Header slot."
    },
    {
      selector: "body",
      value: "Selector",
      description: "Body slot."
    },
    {
      selector: "footer",
      value: "Selector",
      description: "Footer slot."
    },
    {
      selector: "--surface-padding",
      value: "CSS variable",
      description: "Resolved surface padding."
    }
  ],
  feedback: [
    {
      selector: "root",
      value: "Selector",
      description: "Feedback root."
    },
    {
      selector: "icon",
      value: "Selector",
      description: "Status icon."
    },
    {
      selector: "title",
      value: "Selector",
      description: "Title text."
    },
    {
      selector: "message",
      value: "Selector",
      description: "Message content."
    },
    {
      selector: "data-tone",
      value: "Data attribute",
      description: "Current feedback tone."
    }
  ],
  data: [
    {
      selector: "root",
      value: "Selector",
      description: "Data component root."
    },
    {
      selector: "table",
      value: "Selector",
      description: "Table surface."
    },
    {
      selector: "row",
      value: "Selector",
      description: "Data row."
    },
    {
      selector: "cell",
      value: "Selector",
      description: "Data cell."
    },
    {
      selector: "--row-height",
      value: "CSS variable",
      description: "Resolved row height."
    }
  ],
  layout: [
    {
      selector: "root",
      value: "Selector",
      description: "Layout root."
    },
    {
      selector: "inner",
      value: "Selector",
      description: "Inner wrapper."
    },
    {
      selector: "section",
      value: "Selector",
      description: "Layout section."
    },
    {
      selector: "--layout-gap",
      value: "CSS variable",
      description: "Resolved spacing gap."
    }
  ],
  navigation: [
    {
      selector: "root",
      value: "Selector",
      description: "Navigation root."
    },
    {
      selector: "list",
      value: "Selector",
      description: "Navigation list."
    },
    {
      selector: "item",
      value: "Selector",
      description: "Navigation item."
    },
    {
      selector: "panel",
      value: "Selector",
      description: "Active content panel."
    }
  ],
  display: [
    {
      selector: "root",
      value: "Selector",
      description: "Display root."
    },
    {
      selector: "label",
      value: "Selector",
      description: "Displayed text."
    },
    {
      selector: "icon",
      value: "Selector",
      description: "Optional icon."
    }
  ],
  meter: [
    {
      selector: "root",
      value: "Selector",
      description: "Meter root."
    },
    {
      selector: "track",
      value: "Selector",
      description: "Background track."
    },
    {
      selector: "bar",
      value: "Selector",
      description: "Filled value bar."
    }
  ],
  choice: [
    {
      selector: "root",
      value: "Selector",
      description: "Choice root."
    },
    {
      selector: "input",
      value: "Selector",
      description: "Native input."
    },
    {
      selector: "label",
      value: "Selector",
      description: "Choice label."
    },
    {
      selector: "data-checked",
      value: "Data attribute",
      description: "Checked state marker."
    }
  ],
  special: [
    {
      selector: "root",
      value: "Selector",
      description: "Component root."
    },
    {
      selector: "data-disabled",
      value: "Data attribute",
      description: "Disabled state marker."
    }
  ]
};

export function titleCaseComponent(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getComponentDocsKind(slug: string): ComponentDocsKind {
  if (/button|icon-button|clipboard|command|command-bar|toolbar|link/.test(slug)) return "buttonLike";
  if (/text-input|input|textarea|password-input|number-input|search-input|color-input|autocomplete|tags-input|pin-code|pin-input|float-label|form-field/.test(slug)) return "field";
  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list|segmented-control/.test(slug)) return "selection";
  if (/modal|dialog|drawer|popover|tooltip|menu|context-menu|hover-card|portal/.test(slug)) return "overlay";
  if (/card|paper|box|container|credit-card|aspect-ratio|dropzone/.test(slug)) return "surface";
  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) return "feedback";
  if (/table|data-grid|table-of-contents|tree|tree-view/.test(slug)) return "data";
  if (/grid|simple-grid|group|stack|flex|center|layout|layout-shell|app-shell|split-pane|resizable-panel|section|page|sidebar|dock|header|footer|spacer|scroll-area/.test(slug)) return "layout";
  if (/tabs|accordion|breadcrumb|breadcrumbs|pagination|stepper|timeline/.test(slug)) return "navigation";
  if (/badge|code|code-block|inline-code|kbd|highlight|avatar|prose|visually-hidden|divider|status-bar/.test(slug)) return "display";
  if (/slider|range-slider|progress|rating|loader|spinner|skeleton|color-picker/.test(slug)) return "meter";
  if (/checkbox|radio|switch/.test(slug)) return "choice";

  return "special";
}

export function getComponentPreviewKind(slug: string, kind: ComponentDocsKind) {
  if (/modal|dialog|drawer|popover|hover-card|tooltip|menu|context-menu|portal/.test(slug)) return "overlay-interactive";
  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) return "feedback-toggle";
  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list/.test(slug)) return "selection-list";
  if (/table|data-grid|table-of-contents/.test(slug)) return "data-table";
  if (/tabs/.test(slug)) return "tabs";
  if (/color-picker/.test(slug)) return "color-picker";
  if (/dropzone/.test(slug)) return "dropzone";
  if (/credit-card/.test(slug)) return "credit-card";
  if (/slider|range-slider|progress|rating|loader|spinner|skeleton/.test(slug)) return "meter";

  return kind;
}

export function getComponentDocsAnatomy(kind: ComponentDocsKind) {
  const map: Record<ComponentDocsKind, readonly string[]> = {
    buttonLike: ["root", "leftSection", "label", "rightSection", "loader"],
    field: ["root", "label", "input", "description", "error"],
    selection: ["root", "label", "input", "dropdown", "option", "empty"],
    overlay: ["root", "overlay", "content", "header", "body", "footer", "close"],
    surface: ["root", "header", "body", "footer"],
    feedback: ["root", "icon", "title", "message", "close"],
    data: ["root", "header", "row", "cell", "footer"],
    layout: ["root", "inner", "section"],
    navigation: ["root", "list", "item", "panel"],
    display: ["root", "label", "icon"],
    meter: ["root", "track", "bar", "label"],
    choice: ["root", "input", "control", "label"],
    special: ["root", "content"]
  };

  return map[kind];
}

export function getComponentDocsAccessibility(kind: ComponentDocsKind) {
  const map: Record<ComponentDocsKind, readonly string[]> = {
    buttonLike: ["Use button for actions and anchor for navigation.", "Keep loading label readable.", "Do not remove focus-visible styles."],
    field: ["Connect label, description and error text with accessible ids.", "Expose invalid state with aria-invalid.", "Do not use placeholder as the only label."],
    selection: ["Support keyboard navigation in dropdown options.", "Expose expanded state on the trigger.", "Announce selected option changes."],
    overlay: ["Use role dialog when appropriate.", "Move focus into the overlay when opened.", "Return focus to trigger on close."],
    surface: ["Use semantic sections inside card-like surfaces.", "Do not use surface components as interactive controls without role and keyboard support."],
    feedback: ["Use semantic tone but keep text explicit.", "Dismissible messages need accessible close labels."],
    data: ["Use table semantics for tabular data.", "Keep headers associated with cells.", "Avoid keyboard traps in scrollable data areas."],
    layout: ["Layout primitives should not add unnecessary roles.", "Keep reading order aligned with visual order."],
    navigation: ["Expose active item state.", "Support keyboard navigation where interactive."],
    display: ["Decorative icons should be aria-hidden.", "Text must keep sufficient contrast."],
    meter: ["Expose numeric values with aria-valuenow when interactive.", "Do not rely on color alone."],
    choice: ["Use native input semantics.", "Keep label clickable.", "Expose checked and disabled states."],
    special: ["Keep semantic HTML and keyboard access appropriate to rendered behavior."]
  };

  return map[kind];
}

export function getComponentDocsDetail(slug: string, fallbackLabel?: string): ComponentDocsDetail {
  const cleanSlug = slug.replace(/^\/components\//, "").replace(/\/+$/, "");
  const label = fallbackLabel || titleCaseComponent(cleanSlug);
  const kind = getComponentDocsKind(cleanSlug);

  return {
    slug: cleanSlug,
    label,
    kind,
    description: `${label} is documented with component-specific usage guidance, API props, Styles API, anatomy, accessibility notes and an interactive preview.`,
    previewKind: getComponentPreviewKind(cleanSlug, kind),
    whenToUse: [
      `Use ${label} when its interaction pattern matches the task.`,
      "Use component variants and states to communicate hierarchy clearly."
    ],
    whenNotToUse: [
      "Do not use it only for visual decoration when semantic HTML would be better.",
      "Do not remove keyboard and focus behavior from interactive states."
    ],
    props: [...propsByKind[kind], ...commonProps],
    styles: stylesByKind[kind],
    anatomy: getComponentDocsAnatomy(kind),
    accessibility: getComponentDocsAccessibility(kind)
  };
}

function pascalCase(value: string) {
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("");
}

export function buildComponentSpecificCode(slug: string, fallbackLabel: string, state: ComponentDocsVisualState = {}) {
  const cleanSlug = slug.replace(/^\/components\//, "").replace(/\/+$/, "");
  const name = pascalCase(cleanSlug);
  const label = fallbackLabel || titleCaseComponent(cleanSlug);
  const kind = getComponentDocsKind(cleanSlug);

  if (kind === "buttonLike") {
    return [
      `import { ${name} } from "@noctra/react";`,
      "",
      "export function Demo() {",
      "  return (",
      `    <${name} variant="${state.variant || "filled"}" tone="${state.tone || "primary"}" size="${state.size || "md"}" radius="${state.radius || "md"}"${state.fullWidth ? " fullWidth" : ""}${state.loading ? " loading" : ""}${state.disabled ? " disabled" : ""}>`,
      `      ${label}`,
      `    </${name}>`,
      "  );",
      "}",
      ""
    ].join("\n");
  }

  if (kind === "field") {
    return [
      `import { ${name} } from "@noctra/react";`,
      "",
      "export function Demo() {",
      "  return (",
      `    <${name}`,
      `      label="${label}"`,
      `      placeholder="Enter ${label.toLowerCase()}"`,
      `      description="Use this field to collect ${label.toLowerCase()} value."`,
      "    />",
      "  );",
      "}",
      ""
    ].join("\n");
  }

  if (kind === "selection") {
    return [
      `import { ${name} } from "@noctra/react";`,
      "",
      "export function Demo() {",
      "  return (",
      `    <${name}`,
      `      label="${label}"`,
      `      placeholder="Pick one"`,
      `      data={["Documentation", "Components", "Styles API"]}`,
      "      clearable",
      "    />",
      "  );",
      "}",
      ""
    ].join("\n");
  }

  if (kind === "overlay") {
    return [
      `import { ${name} } from "@noctra/react";`,
      "",
      "export function Demo() {",
      `  return <${name} opened title="${label}" onClose={() => {}}>Content</${name}>;`,
      "}",
      ""
    ].join("\n");
  }

  if (kind === "surface") {
    return [
      `import { ${name} } from "@noctra/react";`,
      "",
      "export function Demo() {",
      `  return <${name} withBorder padding="md" radius="lg">${label} content</${name}>;`,
      "}",
      ""
    ].join("\n");
  }

  return [
    `import { ${name} } from "@noctra/react";`,
    "",
    "export function Demo() {",
    `  return <${name}>${label}</${name}>;`,
    "}",
    ""
  ].join("\n");
}
