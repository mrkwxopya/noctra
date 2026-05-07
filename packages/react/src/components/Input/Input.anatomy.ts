export const inputAnatomy = [
  "root",
  "wrapper",
  "field",
  "label",
  "description",
  "error",
  "left-section",
  "right-section",
  "loader"
] as const;

export type InputSlot = (typeof inputAnatomy)[number];