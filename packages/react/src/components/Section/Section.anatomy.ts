export const sectionAnatomy = [
  "root",
  "header",
  "heading",
  "eyebrow",
  "title",
  "subtitle",
  "description",
  "actions",
  "layout",
  "content",
  "aside",
  "footer"
] as const;

export type SectionSlot = (typeof sectionAnatomy)[number];