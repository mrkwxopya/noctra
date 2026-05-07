export const cardAnatomy = [
  "root",
  "media",
  "image",
  "header",
  "eyebrow",
  "title",
  "subtitle",
  "description",
  "layout",
  "content",
  "aside",
  "actions",
  "primary-action",
  "secondary-action",
  "footer"
] as const;

export type CardSlot = (typeof cardAnatomy)[number];