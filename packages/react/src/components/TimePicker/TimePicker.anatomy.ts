export const timePickerAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "input",
  "clear-button",
  "icon",
  "error"
] as const;

export type TimePickerSlot = (typeof timePickerAnatomy)[number];