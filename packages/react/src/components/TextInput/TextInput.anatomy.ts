export const textInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "prefix",
  "input",
  "suffix",
  "clear",
  "right-section",
  "message"
] as const;

export type TextInputSlot = (typeof textInputAnatomy)[number];