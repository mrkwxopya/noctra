export const listBoxAnatomy = [
  "root",
  "label",
  "description",
  "search",
  "list",
  "option",
  "option-icon",
  "option-content",
  "option-label",
  "option-description",
  "option-badge",
  "check",
  "empty",
  "selection",
  "message"
] as const;

export type ListBoxSlot = (typeof listBoxAnatomy)[number];