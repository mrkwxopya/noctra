export const dateTimePickerAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "input",
  "clear-button",
  "icon",
  "error"
] as const;

export type DateTimePickerSlot = (typeof dateTimePickerAnatomy)[number];