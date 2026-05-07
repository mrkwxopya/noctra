export const toolbarAnatomy = [
  "root",
  "header",
  "label",
  "description",
  "content",
  "group",
  "group-label",
  "separator",
  "item",
  "button",
  "icon",
  "button-content",
  "button-label",
  "button-description",
  "shortcut"
] as const;

export type ToolbarSlot = (typeof toolbarAnatomy)[number];