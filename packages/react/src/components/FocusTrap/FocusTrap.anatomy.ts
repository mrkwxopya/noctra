export const focusTrapAnatomy = [
  "root",
  "sentinel-start",
  "content",
  "sentinel-end"
] as const;

export type FocusTrapSlot = (typeof focusTrapAnatomy)[number];