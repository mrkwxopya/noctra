export const contextMenuAnatomy = [
  "root",
  "target",
  "dropdown",
  "header",
  "label",
  "description",
  "content",
  "group",
  "group-label",
  "separator",
  "item",
  "button",
  "indicator",
  "icon",
  "button-content",
  "item-label",
  "item-description",
  "badge",
  "shortcut",
  "right-section",
  "footer"
] as const;

export type ContextMenuSlot = (typeof contextMenuAnatomy)[number];