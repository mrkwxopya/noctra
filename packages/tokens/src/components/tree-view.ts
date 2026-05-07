export const ncTreeViewTokenNames = [
  "--nc-tree-view-bg",
  "--nc-tree-view-border",
  "--nc-tree-view-text",
  "--nc-tree-view-muted-text",
  "--nc-tree-view-control-bg",
  "--nc-tree-view-control-bg-hover",
  "--nc-tree-view-item-bg-hover",
  "--nc-tree-view-item-bg-selected",
  "--nc-tree-view-focus-ring",
  "--nc-tree-view-radius",
  "--nc-tree-view-gap",
  "--nc-tree-view-indent",
  "--nc-tree-view-max-height"
] as const;

export type NcTreeViewTokenName = (typeof ncTreeViewTokenNames)[number];