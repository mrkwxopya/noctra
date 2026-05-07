export const visuallyHiddenAnatomy = [
  "root"
] as const;

export type VisuallyHiddenSlot = (typeof visuallyHiddenAnatomy)[number];