export const commandBarAnatomy = [
  "root",
  "header",
  "label",
  "description",
  "control",
  "search-icon",
  "input",
  "clear-button",
  "actions",
  "section",
  "section-title",
  "item",
  "button",
  "icon",
  "content",
  "item-label",
  "item-description",
  "shortcut",
  "empty"
] as const;

export type CommandBarSlot = (typeof commandBarAnatomy)[number];