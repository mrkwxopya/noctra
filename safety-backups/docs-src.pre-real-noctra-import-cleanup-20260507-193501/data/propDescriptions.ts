export type PropCategory =
  | "content"
  | "layout"
  | "appearance"
  | "state"
  | "interaction"
  | "accessibility"
  | "system"
  | "native"
  | "advanced";

export type PropDescription = {
  category: PropCategory;
  description: string;
};

const commonPropDescriptions: Record<string, PropDescription> = {
  children: {
    category: "content",
    description: "Main rendered content for the component."
  },
  title: {
    category: "content",
    description: "Primary title content. Usually rendered in the component header or heading area."
  },
  subtitle: {
    category: "content",
    description: "Secondary title content used to support the main title."
  },
  description: {
    category: "content",
    description: "Supporting explanatory content for the component."
  },
  label: {
    category: "content",
    description: "Visible label content for controls, dividers, form fields, or grouped UI."
  },
  header: {
    category: "content",
    description: "Custom header slot content."
  },
  footer: {
    category: "content",
    description: "Custom footer slot content."
  },
  aside: {
    category: "layout",
    description: "Side content slot, usually rendered next to the main content."
  },
  media: {
    category: "content",
    description: "Media slot for images, visual previews, or rich content."
  },
  image: {
    category: "content",
    description: "Image content or image-like visual slot."
  },
  actions: {
    category: "interaction",
    description: "Action area for buttons, links, or controls."
  },
  primaryAction: {
    category: "interaction",
    description: "Primary action configuration for action-based components."
  },
  secondaryAction: {
    category: "interaction",
    description: "Secondary action configuration for action-based components."
  },

  variant: {
    category: "appearance",
    description: "Visual style variant such as surface, soft, outline, filled, ghost, or elevated."
  },
  tone: {
    category: "appearance",
    description: "Semantic color intent such as primary, success, danger, warning, info, or neutral."
  },
  size: {
    category: "appearance",
    description: "Component size scale."
  },
  radius: {
    category: "appearance",
    description: "Corner radius scale."
  },
  density: {
    category: "appearance",
    description: "Spacing density scale for compact, default, or comfortable layouts."
  },
  shadow: {
    category: "appearance",
    description: "Shadow depth for elevated surfaces."
  },
  padding: {
    category: "layout",
    description: "Internal spacing for the component."
  },
  gap: {
    category: "layout",
    description: "Spacing between child elements."
  },
  width: {
    category: "layout",
    description: "Custom width. Numbers are usually converted to px; strings are passed through as CSS values."
  },
  height: {
    category: "layout",
    description: "Custom height. Numbers are usually converted to px; strings are passed through as CSS values."
  },
  minHeight: {
    category: "layout",
    description: "Minimum height for layout or surface components."
  },
  maxWidth: {
    category: "layout",
    description: "Maximum width for layout or surface components."
  },
  fullWidth: {
    category: "layout",
    description: "Expands the component to the available inline width."
  },
  withBorder: {
    category: "appearance",
    description: "Enables the component border when supported."
  },
  padded: {
    category: "layout",
    description: "Enables default internal padding when supported."
  },
  bleed: {
    category: "layout",
    description: "Allows content or layout to extend to the container edge."
  },

  disabled: {
    category: "state",
    description: "Disables interaction and applies disabled styling where supported."
  },
  selected: {
    category: "state",
    description: "Marks the component as selected and applies selected styling."
  },
  active: {
    category: "state",
    description: "Marks the item or control as active."
  },
  loading: {
    category: "state",
    description: "Displays loading state and may disable interaction depending on the component."
  },
  error: {
    category: "state",
    description: "Displays error state or error message depending on the component."
  },
  required: {
    category: "accessibility",
    description: "Marks the input or field as required."
  },
  readOnly: {
    category: "state",
    description: "Prevents editing while preserving readable value display."
  },
  muted: {
    category: "appearance",
    description: "Applies muted visual treatment."
  },
  interactive: {
    category: "interaction",
    description: "Enables interactive cursor, hover, and focus treatment."
  },

  orientation: {
    category: "layout",
    description: "Controls horizontal or vertical component orientation."
  },
  align: {
    category: "layout",
    description: "Controls alignment of content or child items."
  },
  justify: {
    category: "layout",
    description: "Controls distribution of child items across the main axis."
  },
  direction: {
    category: "layout",
    description: "Controls layout direction."
  },
  wrap: {
    category: "layout",
    description: "Controls whether child items wrap to additional lines."
  },
  columns: {
    category: "layout",
    description: "Number of grid columns or column configuration."
  },

  value: {
    category: "interaction",
    description: "Controlled value for input-like or stateful components."
  },
  defaultValue: {
    category: "interaction",
    description: "Initial uncontrolled value."
  },
  checked: {
    category: "interaction",
    description: "Controlled checked state for checkbox-like components."
  },
  defaultChecked: {
    category: "interaction",
    description: "Initial uncontrolled checked state."
  },
  onChange: {
    category: "interaction",
    description: "Callback fired when the component value changes."
  },
  onClick: {
    category: "interaction",
    description: "Callback fired when the component is clicked."
  },
  onOpenChange: {
    category: "interaction",
    description: "Callback fired when open state changes."
  },

  id: {
    category: "native",
    description: "Native HTML id forwarded to the root element."
  },
  className: {
    category: "native",
    description: "Native className forwarded to the root element."
  },
  style: {
    category: "native",
    description: "Inline style object. Some components also support typed CSS variable overrides."
  },
  role: {
    category: "accessibility",
    description: "ARIA role forwarded to the root element when applicable."
  },
  tabIndex: {
    category: "accessibility",
    description: "Native tabIndex for focus management."
  }
};

const componentSpecificDescriptions: Record<string, Record<string, PropDescription>> = {
  Card: {
    eyebrow: {
      category: "content",
      description: "Small uppercase label rendered above the card title."
    },
    orientation: {
      category: "layout",
      description: "Switches the card between vertical and horizontal media/content layout."
    }
  },

  Page: {
    sidebar: {
      category: "layout",
      description: "Sidebar region for page-level navigation or supporting content."
    },
    stickyHeader: {
      category: "layout",
      description: "Keeps the page header fixed to the top while scrolling."
    },
    stickySidebar: {
      category: "layout",
      description: "Keeps side regions sticky while scrolling."
    }
  },

  Layout: {
    sidebar: {
      category: "layout",
      description: "Application-level sidebar region."
    },
    toolbar: {
      category: "layout",
      description: "Optional toolbar region rendered between header and main shell."
    },
    mode: {
      category: "layout",
      description: "Controls layout shell mode such as default, sidebar, split, or dashboard."
    },
    sidebarCollapsed: {
      category: "state",
      description: "Applies collapsed sidebar layout when supported."
    }
  },

  Divider: {
    decorative: {
      category: "accessibility",
      description: "When true, hides the divider from assistive technologies."
    },
    labelPosition: {
      category: "layout",
      description: "Controls where the divider label is placed along the line."
    },
    thickness: {
      category: "appearance",
      description: "Custom divider line thickness."
    },
    length: {
      category: "layout",
      description: "Custom divider length."
    }
  },

  Section: {
    headerLayout: {
      category: "layout",
      description: "Controls whether section heading and actions are stacked or split."
    },
    eyebrow: {
      category: "content",
      description: "Small contextual label rendered before the section title."
    }
  },

  Button: {
    leftSection: {
      category: "content",
      description: "Content rendered before the button label, commonly an icon."
    },
    rightSection: {
      category: "content",
      description: "Content rendered after the button label, commonly an icon."
    }
  }
};


const docsProfessionalSupplementalPropDescriptions: Record<string, PropDescription> = {
  placeholder: {
    category: "content",
    description: "Placeholder text shown before the user provides a value."
  },
  helperText: {
    category: "content",
    description: "Additional helper copy rendered near the control."
  },
  hint: {
    category: "content",
    description: "Short contextual hint for the user."
  },
  icon: {
    category: "content",
    description: "Icon or visual element rendered inside the component."
  },
  leftIcon: {
    category: "content",
    description: "Icon rendered before the main label or content."
  },
  rightIcon: {
    category: "content",
    description: "Icon rendered after the main label or content."
  },
  clearable: {
    category: "interaction",
    description: "Allows the user to clear the current value."
  },
  searchable: {
    category: "interaction",
    description: "Enables search behavior where supported."
  },
  multiple: {
    category: "interaction",
    description: "Allows multiple selected values."
  },
  options: {
    category: "content",
    description: "Option collection rendered by select, list, command, or menu components."
  },
  items: {
    category: "content",
    description: "Item collection rendered by list-like or navigation-like components."
  },
  data: {
    category: "content",
    description: "Data collection consumed by data display or input components."
  },
  columns: {
    category: "layout",
    description: "Column definitions or column count used by grid and table components."
  },
  rows: {
    category: "content",
    description: "Row data rendered by table-like components."
  },
  open: {
    category: "state",
    description: "Controlled open state for overlay or disclosure components."
  },
  defaultOpen: {
    category: "state",
    description: "Initial uncontrolled open state."
  },
  closeOnEscape: {
    category: "interaction",
    description: "Allows the component to close when the Escape key is pressed."
  },
  closeOnOutsideClick: {
    category: "interaction",
    description: "Allows the component to close when the user clicks outside."
  },
  trapFocus: {
    category: "accessibility",
    description: "Keeps keyboard focus inside the active overlay."
  },
  returnFocus: {
    category: "accessibility",
    description: "Returns focus to the trigger when the overlay closes."
  },
  ariaLabel: {
    category: "accessibility",
    description: "Accessible label used when no visible label is available."
  },
  ariaDescribedBy: {
    category: "accessibility",
    description: "Associates the component with supporting descriptive content."
  },
  empty: {
    category: "state",
    description: "Content or state rendered when no items are available."
  },
  loadingText: {
    category: "state",
    description: "Text shown while loading asynchronous content."
  },
  successText: {
    category: "state",
    description: "Text shown for success state."
  },
  errorText: {
    category: "state",
    description: "Text shown for error state."
  },
  max: {
    category: "interaction",
    description: "Maximum numeric value or selection limit."
  },
  min: {
    category: "interaction",
    description: "Minimum numeric value."
  },
  step: {
    category: "interaction",
    description: "Increment step for numeric or range controls."
  },
  precision: {
    category: "interaction",
    description: "Numeric precision used for formatting or input behavior."
  },
  format: {
    category: "advanced",
    description: "Formatting strategy used when displaying values."
  },
  parser: {
    category: "advanced",
    description: "Parser used to transform user input into component value."
  },
  renderItem: {
    category: "advanced",
    description: "Custom item renderer for collection-based components."
  },
  renderValue: {
    category: "advanced",
    description: "Custom renderer for the selected or displayed value."
  }
};

export function getPropDescription(componentName: string, propName: string): PropDescription {
  return (
    componentSpecificDescriptions[componentName]?.[propName] ??
    commonPropDescriptions[propName] ??
    docsProfessionalSupplementalPropDescriptions[propName] ?? {
      category: "advanced",
      description: "Component-specific prop. Add a description in propDescriptions.ts for richer public docs."
    }
  );
}

export function getCategoryLabel(category: PropCategory): string {
  const labels: Record<PropCategory, string> = {
    content: "Content",
    layout: "Layout",
    appearance: "Appearance",
    state: "State",
    interaction: "Interaction",
    accessibility: "Accessibility",
    system: "System",
    native: "Native",
    advanced: "Advanced"
  };

  return labels[category];
}
