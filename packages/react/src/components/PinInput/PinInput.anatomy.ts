export const pinInputAnatomy = [
  "root",
  "label",
  "description",
  "fields",
  "group",
  "input",
  "separator",
  "message"
] as const;

export type PinInputSlot = (typeof pinInputAnatomy)[number];