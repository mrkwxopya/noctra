export const radioAnatomy = [
  "root",
  "input",
  "box",
  "icon",
  "content",
  "label",
  "description",
  "message"
] as const;

export type RadioSlot = (typeof radioAnatomy)[number];