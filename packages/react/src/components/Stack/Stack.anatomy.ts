export const stackAnatomy = [
  "root",
  "content"
] as const;

export type StackSlot = (typeof stackAnatomy)[number];