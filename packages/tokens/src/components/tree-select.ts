export const ncTreeSelectTokenNames = [
  "--nc-tree-select-bg",
  "--nc-tree-select-bg-hover",
  "--nc-tree-select-border",
  "--nc-tree-select-border-focus",
  "--nc-tree-select-text",
  "--nc-tree-select-placeholder-text",
  "--nc-tree-select-label-text",
  "--nc-tree-select-description-text",
  "--nc-tree-select-error-text",
  "--nc-tree-select-dropdown-bg",
  "--nc-tree-select-dropdown-border",
  "--nc-tree-select-row-bg-hover",
  "--nc-tree-select-row-bg-selected",
  "--nc-tree-select-icon-text",
  "--nc-tree-select-muted-text",
  "--nc-tree-select-focus-ring",
  "--nc-tree-select-radius",
  "--nc-tree-select-height",
  "--nc-tree-select-padding-x"
] as const;

export type NcTreeSelectTokenName = (typeof ncTreeSelectTokenNames)[number];