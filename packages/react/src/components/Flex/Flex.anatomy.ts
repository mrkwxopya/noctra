export const flexAnatomy = [
  "root",
  "content"
] as const;

export type FlexSlot = (typeof flexAnatomy)[number];