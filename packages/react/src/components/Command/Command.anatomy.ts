export const commandAnatomy = [
  "root",
  "trigger",
  "overlay",
  "dialog",
  "header",
  "heading",
  "search",
  "list",
  "group",
  "group-label",
  "item",
  "item-icon",
  "item-content",
  "item-label",
  "item-description",
  "item-shortcut",
  "empty",
  "separator"
] as const;

export type CommandSlot = (typeof commandAnatomy)[number];