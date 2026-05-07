export interface ComponentDocSummary {
  name: string;
  status: "foundation" | "stable-draft" | "planned";
  category: "Core" | "Feedback" | "Overlay" | "Utility" | "Identity";
  description: string;
  anatomy: string[];
  variants: string[];
  keyTokens: string[];
  accessibility: string[];
}

export const componentDocs: ComponentDocSummary[] = [
  {
    name: "Button",
    status: "stable-draft",
    category: "Core",
    description: "Triggers actions, submits forms, opens dialogs, or moves users through workflows.",
    anatomy: ["root", "icon", "label", "loader"],
    variants: ["solid", "soft", "outline", "ghost", "subtle", "surface", "link"],
    keyTokens: ["--nc-button-bg", "--nc-button-text", "--nc-button-border", "--nc-button-focus-ring"],
    accessibility: ["Uses native button behavior.", "Loading prevents duplicate actions.", "Icon-only usage should move to IconButton."]
  },
  {
    name: "Card",
    status: "foundation",
    category: "Core",
    description: "Groups related content using Noctra surface, border, radius, and elevation rules.",
    anatomy: ["root", "header", "title", "description", "body", "footer", "action", "media"],
    variants: ["plain", "surface", "elevated", "outlined", "glass", "interactive"],
    keyTokens: ["--nc-card-bg", "--nc-card-border", "--nc-card-shadow", "--nc-card-radius"],
    accessibility: ["Interactive cards need keyboard behavior.", "Avoid nested interactive conflicts.", "Selected state should not be color-only."]
  },
  {
    name: "Input",
    status: "foundation",
    category: "Core",
    description: "Collects single-line text with label, helper, error, left section, and right section support.",
    anatomy: ["root", "wrapper", "field", "label", "description", "error", "left-section", "right-section"],
    variants: ["outline", "surface", "filled", "flushed", "unstyled"],
    keyTokens: ["--nc-input-bg", "--nc-input-border", "--nc-input-border-focus", "--nc-input-error-text"],
    accessibility: ["Connects label, description, and error text.", "Invalid state is exposed with aria-invalid.", "Placeholder is not used as a label."]
  },
  {
    name: "Badge",
    status: "foundation",
    category: "Core",
    description: "Displays compact status, category, role, metadata, or semantic labels.",
    anatomy: ["root", "dot", "icon", "label", "close"],
    variants: ["solid", "soft", "outline", "subtle", "dot", "surface"],
    keyTokens: ["--nc-badge-bg", "--nc-badge-text", "--nc-badge-border", "--nc-badge-dot"],
    accessibility: ["Status should not rely on color only.", "Textless dot badges need accessible context.", "Removable behavior should use a separate action."]
  },
  {
    name: "Alert",
    status: "foundation",
    category: "Feedback",
    description: "Shows semantic info, success, warning, danger, or neutral feedback without aggressive visual noise.",
    anatomy: ["root", "icon", "content", "title", "description", "action", "close"],
    variants: ["solid", "soft", "surface", "outline", "subtle"],
    keyTokens: ["--nc-alert-bg", "--nc-alert-border", "--nc-alert-icon", "--nc-alert-title-text"],
    accessibility: ["Danger and warning use alert role by default.", "Dismiss action has an accessible label.", "Meaning is not color-only."]
  },
  {
    name: "Modal",
    status: "foundation",
    category: "Overlay",
    description: "Displays interruptive overlay content with title, description, body, footer, and close behavior.",
    anatomy: ["overlay", "content", "header", "title", "description", "body", "footer", "close"],
    variants: ["default", "elevated", "glass", "command", "danger"],
    keyTokens: ["--nc-modal-bg", "--nc-modal-border", "--nc-modal-shadow", "--nc-modal-overlay-bg"],
    accessibility: ["Uses dialog role and aria-modal.", "Connects title and description.", "Focus trap hardening remains a release checklist item."]
  },
  {
    name: "IconButton",
    status: "foundation",
    category: "Utility",
    description: "Provides compact icon-only actions with required accessible label and selected state support.",
    anatomy: ["root", "icon", "loader"],
    variants: ["solid", "soft", "outline", "ghost", "subtle", "surface"],
    keyTokens: ["--nc-icon-button-bg", "--nc-icon-button-text", "--nc-icon-button-size", "--nc-icon-button-focus-ring"],
    accessibility: ["Requires label prop.", "Selected state uses aria-pressed.", "Tooltip is optional and not a label replacement."]
  },
  {
    name: "Tooltip",
    status: "foundation",
    category: "Utility",
    description: "Provides short contextual help for triggers using hover and keyboard focus.",
    anatomy: ["root", "trigger", "content", "arrow", "text"],
    variants: ["default", "inverse", "surface", "subtle"],
    keyTokens: ["--nc-tooltip-bg", "--nc-tooltip-text", "--nc-tooltip-border", "--nc-tooltip-z-index"],
    accessibility: ["Content uses role tooltip.", "Trigger receives aria-describedby.", "Interactive content should use Popover instead."]
  },
  {
    name: "Spinner",
    status: "foundation",
    category: "Feedback",
    description: "Shows compact loading feedback for inline actions, buttons, panels, and async states.",
    anatomy: ["root", "track", "indicator", "label"],
    variants: ["default", "subtle", "primary", "neutral"],
    keyTokens: ["--nc-spinner-size", "--nc-spinner-track", "--nc-spinner-indicator", "--nc-spinner-speed"],
    accessibility: ["Can expose status when label is provided.", "Decorative spinner is hidden from assistive tech.", "Reduced motion is respected."]
  },
  {
    name: "Skeleton",
    status: "foundation",
    category: "Feedback",
    description: "Preserves layout while content loads using calm shimmer placeholders.",
    anatomy: ["root", "shimmer", "content"],
    variants: ["text", "rect", "circle", "card", "avatar"],
    keyTokens: ["--nc-skeleton-bg", "--nc-skeleton-highlight", "--nc-skeleton-radius", "--nc-skeleton-speed"],
    accessibility: ["Skeleton is decorative by default.", "Use aria-busy on parent regions when needed.", "Animation respects reduced motion."]
  },
  {
    name: "Divider",
    status: "foundation",
    category: "Utility",
    description: "Separates content groups with tokenized solid, dashed, subtle, or strong borders.",
    anatomy: ["root", "line", "label"],
    variants: ["solid", "dashed", "subtle", "strong"],
    keyTokens: ["--nc-divider-color", "--nc-divider-label-text", "--nc-divider-gap", "--nc-divider-thickness"],
    accessibility: ["Uses separator role by default.", "Orientation is exposed through aria-orientation.", "Decorative usage can override role if needed."]
  },
  {
    name: "Avatar",
    status: "foundation",
    category: "Identity",
    description: "Represents users, teams, bots, or entities with image, initials, icon, and status support.",
    anatomy: ["root", "image", "fallback", "status", "badge"],
    variants: ["image", "initials", "icon", "surface"],
    keyTokens: ["--nc-avatar-bg", "--nc-avatar-text", "--nc-avatar-size", "--nc-avatar-status"],
    accessibility: ["Uses alt or name when provided.", "Fallback can be decorative when label exists.", "Status should not rely only on color in complex contexts."]
  }
];