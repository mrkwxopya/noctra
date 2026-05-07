export const treeSelectAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "value",
  "placeholder",
  "clear-button",
  "toggle-button",
  "dropdown",
  "search",
  "tree",
  "item",
  "row",
  "toggle",
  "chevron",
  "icon",
  "content",
  "node-label",
  "node-description",
  "badge",
  "children",
  "empty",
  "error"
] as const;

export type TreeSelectSlot = (typeof treeSelectAnatomy)[number];