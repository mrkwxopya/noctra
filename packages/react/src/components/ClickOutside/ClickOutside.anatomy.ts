export const clickOutsideAnatomy = [
  "root",
  "content"
] as const;

export type ClickOutsideSlot = (typeof clickOutsideAnatomy)[number];