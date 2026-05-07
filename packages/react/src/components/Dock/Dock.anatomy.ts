export const dockAnatomy = [
  "root",
  "list",
  "item",
  "button",
  "icon",
  "content",
  "label",
  "description",
  "badge"
] as const;

export type DockSlot = (typeof dockAnatomy)[number];