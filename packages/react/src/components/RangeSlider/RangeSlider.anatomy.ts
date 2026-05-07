export const rangeSliderAnatomy = [
  "root",
  "header",
  "label",
  "description",
  "value",
  "control",
  "track",
  "range",
  "start-input",
  "end-input",
  "marks",
  "mark",
  "mark-dot",
  "mark-label",
  "footer",
  "min-label",
  "max-label",
  "message"
] as const;

export type RangeSliderSlot = (typeof rangeSliderAnatomy)[number];