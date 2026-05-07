export const sliderAnatomy = [
  "root",
  "header",
  "label",
  "description",
  "value",
  "control",
  "track",
  "range",
  "input",
  "marks",
  "mark",
  "mark-dot",
  "mark-label",
  "footer",
  "min-label",
  "max-label",
  "message"
] as const;

export type SliderSlot = (typeof sliderAnatomy)[number];