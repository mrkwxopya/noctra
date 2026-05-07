export const clipboardAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "display",
  "clear",
  "copy",
  "copy-icon",
  "right-section",
  "message"
] as const;

export type ClipboardSlot = (typeof clipboardAnatomy)[number];