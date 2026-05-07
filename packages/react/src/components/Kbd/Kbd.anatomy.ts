export const kbdAnatomy = [
  "root",
  "key",
  "separator"
] as const;

export type KbdSlot = (typeof kbdAnatomy)[number];