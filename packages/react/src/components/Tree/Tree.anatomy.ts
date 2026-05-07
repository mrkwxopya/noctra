export const treeAnatomy = [
  "root",
  "header",
  "heading",
  "description",
  "list",
  "item",
  "row",
  "toggle",
  "chevron",
  "icon",
  "content",
  "label",
  "node-description",
  "badge",
  "children",
  "empty"
] as const;

export type TreeSlot = (typeof treeAnatomy)[number];