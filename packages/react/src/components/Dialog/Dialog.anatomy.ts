export const dialogAnatomy = [
  "root",
  "trigger",
  "overlay",
  "content",
  "header",
  "heading",
  "description",
  "close-button",
  "body",
  "footer"
] as const;

export type DialogSlot = (typeof dialogAnatomy)[number];