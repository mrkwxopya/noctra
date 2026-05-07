export const scrollLockAnatomy = [
  "root",
  "content"
] as const;

export type ScrollLockSlot = (typeof scrollLockAnatomy)[number];