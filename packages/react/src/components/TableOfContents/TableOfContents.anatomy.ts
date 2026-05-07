export const tableOfContentsAnatomy = [
  "root",
  "header",
  "heading",
  "description",
  "toggle",
  "list",
  "item",
  "link",
  "label",
  "item-description",
  "badge",
  "children",
  "empty"
] as const;

export type TableOfContentsSlot = (typeof tableOfContentsAnatomy)[number];