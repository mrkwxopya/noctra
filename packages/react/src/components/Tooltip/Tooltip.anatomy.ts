export const tooltipAnatomy = [
  "root",
  "trigger",
  "content",
  "arrow",
  "label",
  "description"
] as const;

export type TooltipSlot = (typeof tooltipAnatomy)[number];