export const monthInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "clear",
  "picker",
  "right-section",
  "message"
] as const;

export type MonthInputSlot = (typeof monthInputAnatomy)[number];