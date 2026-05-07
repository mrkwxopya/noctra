export const weekInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "input",
  "clear",
  "picker",
  "right-section",
  "message"
] as const;

export type WeekInputSlot = (typeof weekInputAnatomy)[number];