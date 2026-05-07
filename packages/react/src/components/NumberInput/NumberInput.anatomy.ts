export const numberInputAnatomy = [
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
  "controls",
  "increment",
  "decrement",
  "message"
] as const;

export type NumberInputSlot = (typeof numberInputAnatomy)[number];