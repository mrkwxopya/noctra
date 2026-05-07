export const statusBarAnatomy = [
  "root",
  "section",
  "start-section",
  "center-section",
  "end-section",
  "group",
  "group-label",
  "separator",
  "item",
  "button",
  "icon",
  "content",
  "label",
  "value",
  "description",
  "badge"
] as const;

export type StatusBarSlot = (typeof statusBarAnatomy)[number];