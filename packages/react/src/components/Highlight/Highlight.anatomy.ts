export const highlightAnatomy = [
  "root",
  "text",
  "match",
  "empty"
] as const;

export type HighlightSlot = (typeof highlightAnatomy)[number];