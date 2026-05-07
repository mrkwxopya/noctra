import type {
  NoctraDocsPropRow,
  NoctraDocsStyleRow
} from "../components/docs-system/NoctraMantineDocs";

export type ComponentDocsApiEntry = {
  props?: readonly NoctraDocsPropRow[];
  styles?: readonly NoctraDocsStyleRow[];
};

const buttonLikeProps: readonly NoctraDocsPropRow[] = [
  { name: "variant", type: "filled | light | outline | subtle | ghost", defaultValue: "filled", description: "Controls visual treatment." },
  { name: "tone", type: "primary | neutral | success | warning | danger | info", defaultValue: "primary", description: "Controls semantic color tone." },
  { name: "size", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls height, padding and typography." },
  { name: "radius", type: "none | sm | md | lg | xl | full", defaultValue: "md", description: "Controls border radius." },
  { name: "loading", type: "boolean", defaultValue: "false", description: "Shows loading state and disables interaction." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction." },
  { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Makes the control fill its parent width." },
  { name: "leftSection", type: "ReactNode", defaultValue: "—", description: "Content rendered before the label." },
  { name: "rightSection", type: "ReactNode", defaultValue: "—", description: "Content rendered after the label." }
];

const buttonLikeStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Interactive root element.", value: "Selector" },
  { selector: "label", description: "Text label wrapper.", value: "Selector" },
  { selector: "leftSection", description: "Left content slot.", value: "Selector" },
  { selector: "rightSection", description: "Right content slot.", value: "Selector" },
  { selector: "loader", description: "Loading indicator slot.", value: "Selector" },
  { selector: "--button-height", description: "Resolved control height.", value: "CSS variable" },
  { selector: "--button-radius", description: "Resolved border radius.", value: "CSS variable" },
  { selector: "[data-loading]", description: "Applied while loading.", value: "Data attribute" },
  { selector: "[data-disabled]", description: "Applied when disabled.", value: "Data attribute" }
];

const fieldProps: readonly NoctraDocsPropRow[] = [
  { name: "label", type: "ReactNode", defaultValue: "—", description: "Field label." },
  { name: "description", type: "ReactNode", defaultValue: "—", description: "Supporting text displayed below the label." },
  { name: "error", type: "ReactNode", defaultValue: "—", description: "Validation error message." },
  { name: "placeholder", type: "string", defaultValue: "—", description: "Placeholder displayed when empty." },
  { name: "value", type: "string", defaultValue: "—", description: "Controlled value." },
  { name: "defaultValue", type: "string", defaultValue: "—", description: "Uncontrolled default value." },
  { name: "leftSection", type: "ReactNode", defaultValue: "—", description: "Content rendered before the input." },
  { name: "rightSection", type: "ReactNode", defaultValue: "—", description: "Content rendered after the input." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Marks the field as required." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables user input." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Prevents editing while preserving focus." }
];

const fieldStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Field root wrapper.", value: "Selector" },
  { selector: "label", description: "Field label.", value: "Selector" },
  { selector: "description", description: "Description text.", value: "Selector" },
  { selector: "input", description: "Native input element.", value: "Selector" },
  { selector: "section", description: "Left or right section slot.", value: "Selector" },
  { selector: "error", description: "Validation error text.", value: "Selector" },
  { selector: "--input-height", description: "Resolved input height.", value: "CSS variable" },
  { selector: "--input-radius", description: "Resolved input radius.", value: "CSS variable" },
  { selector: "[data-invalid]", description: "Applied when error is present.", value: "Data attribute" },
  { selector: "[data-disabled]", description: "Applied when disabled.", value: "Data attribute" }
];

const selectionProps: readonly NoctraDocsPropRow[] = [
  { name: "data", type: "Array<string | SelectItem>", defaultValue: "[]", description: "Selectable options." },
  { name: "value", type: "string | string[]", defaultValue: "—", description: "Controlled selected value." },
  { name: "defaultValue", type: "string | string[]", defaultValue: "—", description: "Uncontrolled selected value." },
  { name: "placeholder", type: "string", defaultValue: "—", description: "Placeholder displayed before selection." },
  { name: "searchable", type: "boolean", defaultValue: "false", description: "Enables filtering options." },
  { name: "clearable", type: "boolean", defaultValue: "false", description: "Shows clear action when selected." },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows selecting multiple values when supported." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables selection." }
];

const selectionStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Selection root wrapper.", value: "Selector" },
  { selector: "label", description: "Field label.", value: "Selector" },
  { selector: "input", description: "Input or trigger element.", value: "Selector" },
  { selector: "dropdown", description: "Floating options container.", value: "Selector" },
  { selector: "option", description: "Individual option row.", value: "Selector" },
  { selector: "empty", description: "Empty results message.", value: "Selector" },
  { selector: "--input-height", description: "Resolved trigger height.", value: "CSS variable" },
  { selector: "--dropdown-z-index", description: "Dropdown stack level.", value: "CSS variable" },
  { selector: "[data-expanded]", description: "Applied when dropdown is open.", value: "Data attribute" },
  { selector: "[data-selected]", description: "Applied to selected options.", value: "Data attribute" }
];

const overlayProps: readonly NoctraDocsPropRow[] = [
  { name: "opened", type: "boolean", defaultValue: "false", description: "Controls visibility." },
  { name: "onClose", type: "() => void", defaultValue: "—", description: "Called when close is requested." },
  { name: "title", type: "ReactNode", defaultValue: "—", description: "Overlay title." },
  { name: "size", type: "xs | sm | md | lg | xl | full", defaultValue: "md", description: "Controls overlay width or scale." },
  { name: "centered", type: "boolean", defaultValue: "false", description: "Centers the overlay in the viewport." },
  { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Allows Escape key to close." },
  { name: "closeOnClickOutside", type: "boolean", defaultValue: "true", description: "Allows outside click to close." },
  { name: "overlayProps", type: "object", defaultValue: "—", description: "Props forwarded to backdrop layer." }
];

const overlayStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Overlay root.", value: "Selector" },
  { selector: "overlay", description: "Backdrop layer.", value: "Selector" },
  { selector: "content", description: "Floating content surface.", value: "Selector" },
  { selector: "header", description: "Header area.", value: "Selector" },
  { selector: "title", description: "Title text.", value: "Selector" },
  { selector: "body", description: "Main content area.", value: "Selector" },
  { selector: "close", description: "Close button.", value: "Selector" },
  { selector: "--overlay-z-index", description: "Overlay stack level.", value: "CSS variable" },
  { selector: "[data-opened]", description: "Applied when visible.", value: "Data attribute" }
];

const surfaceProps: readonly NoctraDocsPropRow[] = [
  { name: "withBorder", type: "boolean", defaultValue: "false", description: "Adds a border to the surface." },
  { name: "padding", type: "xs | sm | md | lg | xl", defaultValue: "md", description: "Controls internal spacing." },
  { name: "radius", type: "none | sm | md | lg | xl", defaultValue: "md", description: "Controls border radius." },
  { name: "shadow", type: "none | sm | md | lg", defaultValue: "none", description: "Controls elevation shadow." },
  { name: "tone", type: "neutral | primary | success | warning | danger", defaultValue: "neutral", description: "Optional semantic tone." }
];

const surfaceStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Surface root.", value: "Selector" },
  { selector: "header", description: "Optional header section.", value: "Selector" },
  { selector: "body", description: "Main content section.", value: "Selector" },
  { selector: "footer", description: "Optional footer section.", value: "Selector" },
  { selector: "--surface-padding", description: "Resolved surface padding.", value: "CSS variable" },
  { selector: "--surface-radius", description: "Resolved surface radius.", value: "CSS variable" },
  { selector: "--surface-shadow", description: "Resolved elevation shadow.", value: "CSS variable" },
  { selector: "[data-with-border]", description: "Applied when border is enabled.", value: "Data attribute" }
];

const dataProps: readonly NoctraDocsPropRow[] = [
  { name: "data", type: "readonly object[]", defaultValue: "[]", description: "Rows used by data-driven variants." },
  { name: "columns", type: "readonly Column[]", defaultValue: "[]", description: "Column definitions." },
  { name: "striped", type: "boolean", defaultValue: "false", description: "Applies alternating row background." },
  { name: "highlightOnHover", type: "boolean", defaultValue: "false", description: "Highlights rows on hover." },
  { name: "stickyHeader", type: "boolean", defaultValue: "false", description: "Keeps header visible while scrolling." }
];

const dataStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Data component root.", value: "Selector" },
  { selector: "table", description: "Table element.", value: "Selector" },
  { selector: "thead", description: "Table header group.", value: "Selector" },
  { selector: "tbody", description: "Table body group.", value: "Selector" },
  { selector: "tr", description: "Row element.", value: "Selector" },
  { selector: "th", description: "Header cell.", value: "Selector" },
  { selector: "td", description: "Body cell.", value: "Selector" },
  { selector: "[data-striped]", description: "Applied when striped rows are enabled.", value: "Data attribute" },
  { selector: "[data-hover]", description: "Applied when hover highlight is enabled.", value: "Data attribute" }
];

const layoutProps: readonly NoctraDocsPropRow[] = [
  { name: "gap", type: "xs | sm | md | lg | xl | number", defaultValue: "md", description: "Controls spacing between children." },
  { name: "align", type: "start | center | end | stretch", defaultValue: "stretch", description: "Controls cross-axis alignment." },
  { name: "justify", type: "start | center | end | between", defaultValue: "start", description: "Controls main-axis distribution." },
  { name: "cols", type: "number | responsive object", defaultValue: "—", description: "Column count for grid-like components." },
  { name: "breakpoints", type: "responsive object", defaultValue: "—", description: "Responsive layout configuration." }
];

const layoutStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Layout root.", value: "Selector" },
  { selector: "inner", description: "Inner layout wrapper.", value: "Selector" },
  { selector: "section", description: "Layout section.", value: "Selector" },
  { selector: "--layout-gap", description: "Resolved spacing gap.", value: "CSS variable" },
  { selector: "--layout-cols", description: "Resolved column count.", value: "CSS variable" },
  { selector: "[data-orientation]", description: "Current layout direction.", value: "Data attribute" }
];

const feedbackProps: readonly NoctraDocsPropRow[] = [
  { name: "title", type: "ReactNode", defaultValue: "—", description: "Feedback title." },
  { name: "tone", type: "primary | neutral | success | warning | danger | info", defaultValue: "neutral", description: "Semantic feedback tone." },
  { name: "icon", type: "ReactNode", defaultValue: "—", description: "Optional leading icon." },
  { name: "withCloseButton", type: "boolean", defaultValue: "false", description: "Shows close action when supported." }
];

const feedbackStyles: readonly NoctraDocsStyleRow[] = [
  { selector: "root", description: "Feedback root.", value: "Selector" },
  { selector: "icon", description: "Leading icon slot.", value: "Selector" },
  { selector: "title", description: "Title text.", value: "Selector" },
  { selector: "message", description: "Message content.", value: "Selector" },
  { selector: "close", description: "Close action.", value: "Selector" },
  { selector: "[data-tone]", description: "Current feedback tone.", value: "Data attribute" }
];

export const componentDocsApiMap = {
  button: { props: buttonLikeProps, styles: buttonLikeStyles },
  "icon-button": { props: buttonLikeProps, styles: buttonLikeStyles },
  clipboard: { props: buttonLikeProps, styles: buttonLikeStyles },
  link: { props: buttonLikeProps, styles: buttonLikeStyles },
  toolbar: { props: buttonLikeProps, styles: buttonLikeStyles },
  command: { props: buttonLikeProps, styles: buttonLikeStyles },
  "command-bar": { props: buttonLikeProps, styles: buttonLikeStyles },

  input: { props: fieldProps, styles: fieldStyles },
  "text-input": { props: fieldProps, styles: fieldStyles },
  textarea: { props: fieldProps, styles: fieldStyles },
  "password-input": { props: fieldProps, styles: fieldStyles },
  "number-input": { props: fieldProps, styles: fieldStyles },
  "search-input": { props: fieldProps, styles: fieldStyles },
  autocomplete: { props: fieldProps, styles: fieldStyles },
  "tags-input": { props: fieldProps, styles: fieldStyles },
  "pin-code": { props: fieldProps, styles: fieldStyles },
  "pin-input": { props: fieldProps, styles: fieldStyles },
  "float-label": { props: fieldProps, styles: fieldStyles },
  "form-field": { props: fieldProps, styles: fieldStyles },

  select: { props: selectionProps, styles: selectionStyles },
  "multi-select": { props: selectionProps, styles: selectionStyles },
  "native-select": { props: selectionProps, styles: selectionStyles },
  combobox: { props: selectionProps, styles: selectionStyles },
  "list-box": { props: selectionProps, styles: selectionStyles },
  "tree-select": { props: selectionProps, styles: selectionStyles },
  "transfer-list": { props: selectionProps, styles: selectionStyles },
  "segmented-control": { props: selectionProps, styles: selectionStyles },

  modal: { props: overlayProps, styles: overlayStyles },
  drawer: { props: overlayProps, styles: overlayStyles },
  dialog: { props: overlayProps, styles: overlayStyles },
  popover: { props: overlayProps, styles: overlayStyles },
  tooltip: { props: overlayProps, styles: overlayStyles },
  menu: { props: overlayProps, styles: overlayStyles },
  "context-menu": { props: overlayProps, styles: overlayStyles },
  portal: { props: overlayProps, styles: overlayStyles },

  card: { props: surfaceProps, styles: surfaceStyles },
  paper: { props: surfaceProps, styles: surfaceStyles },
  box: { props: surfaceProps, styles: surfaceStyles },
  container: { props: surfaceProps, styles: surfaceStyles },
  "credit-card": { props: surfaceProps, styles: surfaceStyles },

  table: { props: dataProps, styles: dataStyles },
  "data-grid": { props: dataProps, styles: dataStyles },
  "table-of-contents": { props: dataProps, styles: dataStyles },

  grid: { props: layoutProps, styles: layoutStyles },
  "simple-grid": { props: layoutProps, styles: layoutStyles },
  group: { props: layoutProps, styles: layoutStyles },
  stack: { props: layoutProps, styles: layoutStyles },
  flex: { props: layoutProps, styles: layoutStyles },
  center: { props: layoutProps, styles: layoutStyles },
  layout: { props: layoutProps, styles: layoutStyles },
  "layout-shell": { props: layoutProps, styles: layoutStyles },
  "app-shell": { props: layoutProps, styles: layoutStyles },
  sidebar: { props: layoutProps, styles: layoutStyles },
  dock: { props: layoutProps, styles: layoutStyles },
  header: { props: layoutProps, styles: layoutStyles },
  footer: { props: layoutProps, styles: layoutStyles },

  alert: { props: feedbackProps, styles: feedbackStyles },
  notification: { props: feedbackProps, styles: feedbackStyles },
  toast: { props: feedbackProps, styles: feedbackStyles },
  "empty-state": { props: feedbackProps, styles: feedbackStyles },
  blockquote: { props: feedbackProps, styles: feedbackStyles }
} as const satisfies Record<string, ComponentDocsApiEntry>;

export type ComponentDocsApiSlug = keyof typeof componentDocsApiMap;

export function getComponentDocsApiEntry(slug: string): ComponentDocsApiEntry | undefined {
  return (componentDocsApiMap as Record<string, ComponentDocsApiEntry>)[slug];
}
