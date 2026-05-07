export const colorPickerAnatomy = [
  "root",
  "label",
  "description",
  "panel",
  "preview",
  "native",
  "value",
  "swatches",
  "swatch",
  "message"
] as const;

export type ColorPickerSlot = (typeof colorPickerAnatomy)[number];