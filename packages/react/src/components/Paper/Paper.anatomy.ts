export const paperAnatomy = [
  "root",
  "header",
  "layout",
  "content",
  "aside",
  "footer"
] as const;

export type PaperSlot = (typeof paperAnatomy)[number];