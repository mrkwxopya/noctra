export const simpleGridAnatomy = [
  "root",
  "content"
] as const;

export type SimpleGridSlot = (typeof simpleGridAnatomy)[number];