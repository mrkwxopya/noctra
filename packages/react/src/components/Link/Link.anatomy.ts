export const linkAnatomy = [
  "root",
  "left-section",
  "label",
  "right-section",
  "external-icon"
] as const;

export type LinkSlot = (typeof linkAnatomy)[number];