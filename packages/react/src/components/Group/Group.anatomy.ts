export const groupAnatomy = [
  "root",
  "content"
] as const;

export type GroupSlot = (typeof groupAnatomy)[number];