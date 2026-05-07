export const anchorAnatomy = [
  "root",
  "header",
  "heading",
  "description",
  "list",
  "item",
  "link",
  "indicator",
  "icon",
  "content",
  "label",
  "item-description",
  "badge",
  "empty"
] as const;

export type AnchorSlot = (typeof anchorAnatomy)[number];