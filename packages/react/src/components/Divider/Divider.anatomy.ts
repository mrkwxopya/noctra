export const dividerAnatomy = [
  "root",
  "line",
  "label"
] as const;

export type DividerSlot = (typeof dividerAnatomy)[number];