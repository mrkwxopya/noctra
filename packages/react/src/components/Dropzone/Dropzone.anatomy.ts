export const dropzoneAnatomy = [
  "root",
  "label",
  "description",
  "zone",
  "input",
  "icon",
  "content",
  "browse",
  "files",
  "file",
  "clear",
  "message"
] as const;

export type DropzoneSlot = (typeof dropzoneAnatomy)[number];