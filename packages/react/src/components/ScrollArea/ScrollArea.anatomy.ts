export const scrollAreaAnatomy = [
  "root",
  "viewport",
  "content"
] as const;

export type ScrollAreaSlot = (typeof scrollAreaAnatomy)[number];