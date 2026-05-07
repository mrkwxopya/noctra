export const boxAnatomy = [
  "root",
  "content"
] as const;

export type BoxSlot = (typeof boxAnatomy)[number];