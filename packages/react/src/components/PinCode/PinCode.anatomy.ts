export const pinCodeAnatomy = [
  "root",
  "label",
  "description",
  "group",
  "input",
  "separator",
  "message"
] as const;

export type PinCodeSlot = (typeof pinCodeAnatomy)[number];