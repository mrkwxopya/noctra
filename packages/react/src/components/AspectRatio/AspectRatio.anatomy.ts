export const aspectRatioAnatomy = [
  "root",
  "content"
] as const;

export type AspectRatioSlot = (typeof aspectRatioAnatomy)[number];