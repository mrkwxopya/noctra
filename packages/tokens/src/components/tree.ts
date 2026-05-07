export const ncTreeTokenNames = [
  "--nc-tree-bg",
  "--nc-tree-border",
  "--nc-tree-heading-text",
  "--nc-tree-description-text",
  "--nc-tree-row-bg-hover",
  "--nc-tree-row-bg-selected",
  "--nc-tree-label-text",
  "--nc-tree-node-description-text",
  "--nc-tree-icon-text",
  "--nc-tree-guide",
  "--nc-tree-badge-bg",
  "--nc-tree-badge-text",
  "--nc-tree-focus-ring",
  "--nc-tree-radius",
  "--nc-tree-padding",
  "--nc-tree-row-height"
] as const;

export type NcTreeTokenName = (typeof ncTreeTokenNames)[number];