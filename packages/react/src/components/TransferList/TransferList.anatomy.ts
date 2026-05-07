export const transferListAnatomy = [
  "root",
  "label",
  "description",
  "layout",
  "panel",
  "panel-header",
  "panel-title",
  "panel-count",
  "search",
  "list",
  "item",
  "item-icon",
  "item-content",
  "item-label",
  "item-description",
  "item-badge",
  "empty",
  "actions",
  "action",
  "message"
] as const;

export type TransferListSlot = (typeof transferListAnatomy)[number];