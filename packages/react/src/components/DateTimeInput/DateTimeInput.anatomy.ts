export const dateTimeInputAnatomy = [
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

export type DateTimeInputSlot = (typeof dateTimeInputAnatomy)[number];