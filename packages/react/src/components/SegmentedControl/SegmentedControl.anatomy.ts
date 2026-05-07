export const segmentedControlAnatomy = [
  "root",
  "label",
  "description",
  "items",
  "item",
  "item-label",
  "item-description",
  "indicator",
  "error",
  "hidden-input"
] as const;

export type SegmentedControlSlot = (typeof segmentedControlAnatomy)[number];