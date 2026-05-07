export const yearInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "clear",
  "controls",
  "increment",
  "decrement",
  "right-section",
  "message"
] as const;

export type YearInputSlot = (typeof yearInputAnatomy)[number];