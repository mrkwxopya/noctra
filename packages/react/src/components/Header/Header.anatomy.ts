export const headerAnatomy = [
  "root",
  "inner",
  "start-section",
  "brand",
  "logo",
  "brand-content",
  "title",
  "subtitle",
  "navigation",
  "toolbar",
  "actions",
  "end-section"
] as const;

export type HeaderSlot = (typeof headerAnatomy)[number];