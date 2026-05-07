export const dateInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "clear",
  "calendar",
  "right-section",
  "message"
] as const;

export type DateInputSlot = (typeof dateInputAnatomy)[number];