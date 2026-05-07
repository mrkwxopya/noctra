export const spacerAnatomy = [
  "root",
  "content"
] as const;

export type SpacerSlot = (typeof spacerAnatomy)[number];