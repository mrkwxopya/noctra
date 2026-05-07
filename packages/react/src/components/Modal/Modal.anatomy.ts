export const modalAnatomy = [
  "root",
  "overlay",
  "dialog",
  "header",
  "title-group",
  "title",
  "description",
  "close",
  "body",
  "footer",
  "actions"
] as const;

export type ModalSlot = (typeof modalAnatomy)[number];