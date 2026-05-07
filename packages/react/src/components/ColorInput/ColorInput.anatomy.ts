export const colorInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "preview",
  "input",
  "picker",
  "clear",
  "right-section",
  "swatches",
  "swatch",
  "message"
] as const;

export type ColorInputSlot = (typeof colorInputAnatomy)[number];