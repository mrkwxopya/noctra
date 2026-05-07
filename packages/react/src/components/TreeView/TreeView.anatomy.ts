export const treeViewAnatomy = [
  "root",
  "label",
  "description",
  "search",
  "tree",
  "branch",
  "item",
  "toggle",
  "item-icon",
  "item-content",
  "item-label",
  "item-description",
  "item-badge",
  "check",
  "children",
  "empty",
  "message"
] as const;

export type TreeViewSlot = (typeof treeViewAnatomy)[number];