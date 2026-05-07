export const textareaAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "textarea",
  "clear",
  "right-section",
  "footer",
  "counter",
  "message"
] as const;

export type TextareaSlot = (typeof textareaAnatomy)[number];