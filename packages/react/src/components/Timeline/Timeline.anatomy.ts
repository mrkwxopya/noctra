export const timelineAnatomy = [
  "root",
  "label",
  "description",
  "list",
  "item",
  "rail",
  "marker",
  "icon",
  "content",
  "header",
  "title",
  "time",
  "description-text",
  "meta",
  "badge",
  "empty",
  "message"
] as const;

export type TimelineSlot = (typeof timelineAnatomy)[number];