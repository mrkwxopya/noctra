export const checkboxAnatomy = [
  "root",
  "input",
  "box",
  "icon",
  "content",
  "label",
  "description",
  "message"
] as const;

export type CheckboxSlot = (typeof checkboxAnatomy)[number];