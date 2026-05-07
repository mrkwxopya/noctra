export const switchAnatomy = [
  "root",
  "input",
  "track",
  "track-label",
  "thumb",
  "thumb-icon",
  "content",
  "label",
  "description",
  "message"
] as const;

export type SwitchSlot = (typeof switchAnatomy)[number];