export const gridAnatomy = [
  "root",
  "content"
] as const;

export type GridSlot = (typeof gridAnatomy)[number];