export const blockquoteAnatomy = [
  "root",
  "icon",
  "content",
  "title",
  "quote",
  "citation",
  "footer"
] as const;

export type BlockquoteSlot = (typeof blockquoteAnatomy)[number];