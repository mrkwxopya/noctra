export const floatLabelAnatomy = [
  "root",
  "field",
  "content",
  "label",
  "required",
  "description",
  "message"
] as const;

export type FloatLabelSlot = (typeof floatLabelAnatomy)[number];