export const ratingAnatomy = [
  "root",
  "label",
  "description",
  "group",
  "item",
  "icon",
  "empty-icon",
  "value",
  "message"
] as const;

export type RatingSlot = (typeof ratingAnatomy)[number];