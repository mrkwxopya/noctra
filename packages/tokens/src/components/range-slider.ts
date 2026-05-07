export const ncRangeSliderTokenNames = [
  "--nc-range-slider-bg",
  "--nc-range-slider-border",
  "--nc-range-slider-text",
  "--nc-range-slider-muted-text",
  "--nc-range-slider-track-bg",
  "--nc-range-slider-range-bg",
  "--nc-range-slider-thumb-bg",
  "--nc-range-slider-thumb-border",
  "--nc-range-slider-thumb-shadow",
  "--nc-range-slider-mark-bg",
  "--nc-range-slider-mark-active-bg",
  "--nc-range-slider-focus-ring",
  "--nc-range-slider-radius",
  "--nc-range-slider-gap",
  "--nc-range-slider-track-size",
  "--nc-range-slider-thumb-size",
  "--nc-range-slider-start",
  "--nc-range-slider-end"
] as const;

export type NcRangeSliderTokenName = (typeof ncRangeSliderTokenNames)[number];