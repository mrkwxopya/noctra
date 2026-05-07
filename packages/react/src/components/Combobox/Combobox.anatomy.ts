export const comboboxAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "input",
  "clear-button",
  "toggle-button",
  "dropdown",
  "list",
  "group",
  "group-label",
  "option",
  "option-icon",
  "option-content",
  "option-label",
  "option-description",
  "empty",
  "error"
] as const;

export type ComboboxSlot = (typeof comboboxAnatomy)[number];