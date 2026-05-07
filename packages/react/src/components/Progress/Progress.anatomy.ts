export const progressAnatomy = [
  "root",
  "label",
  "description",
  "header",
  "value-label",
  "track",
  "bar",
  "section",
  "circle",
  "circle-track",
  "circle-bar",
  "circle-content",
  "message"
] as const;

export type ProgressSlot = (typeof progressAnatomy)[number];