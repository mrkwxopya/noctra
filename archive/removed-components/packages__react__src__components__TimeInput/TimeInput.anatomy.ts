export const timeInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "clear",
  "clock",
  "right-section",
  "message"
] as const;

export type TimeInputSlot = (typeof timeInputAnatomy)[number];