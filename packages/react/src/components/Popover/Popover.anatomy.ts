export const popoverAnatomy = [
  "root",
  "trigger",
  "dropdown",
  "arrow",
  "header",
  "title-group",
  "title",
  "description",
  "close",
  "body",
  "footer"
] as const;

export type PopoverSlot = (typeof popoverAnatomy)[number];