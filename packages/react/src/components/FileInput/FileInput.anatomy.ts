export const fileInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "button",
  "value",
  "file",
  "clear",
  "right-section",
  "message"
] as const;

export type FileInputSlot = (typeof fileInputAnatomy)[number];