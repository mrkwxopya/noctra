export const centerAnatomy = [
  "root",
  "content"
] as const;

export type CenterSlot = (typeof centerAnatomy)[number];