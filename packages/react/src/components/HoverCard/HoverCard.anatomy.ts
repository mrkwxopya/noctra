export const hoverCardAnatomy = [
  "root",
  "trigger",
  "dropdown",
  "arrow",
  "media",
  "header",
  "title",
  "description",
  "body",
  "footer"
] as const;

export type HoverCardSlot = (typeof hoverCardAnatomy)[number];