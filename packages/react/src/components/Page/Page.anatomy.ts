export const pageAnatomy = [
  "root",
  "header",
  "nav",
  "heading",
  "title",
  "subtitle",
  "description",
  "actions",
  "shell",
  "sidebar",
  "main",
  "content",
  "aside",
  "footer"
] as const;

export type PageSlot = (typeof pageAnatomy)[number];