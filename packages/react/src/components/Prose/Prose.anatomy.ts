export const proseAnatomy = [
  "root",
  "lead",
  "content",
  "footer"
] as const;

export type ProseSlot = (typeof proseAnatomy)[number];