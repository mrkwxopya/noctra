export const ncSliderTokenNames = [
  "--nc-slider-bg",
  "--nc-slider-border",
  "--nc-slider-text",
  "--nc-slider-muted-text",
  "--nc-slider-track-bg",
  "--nc-slider-range-bg",
  "--nc-slider-thumb-bg",
  "--nc-slider-thumb-border",
  "--nc-slider-thumb-shadow",
  "--nc-slider-mark-bg",
  "--nc-slider-mark-active-bg",
  "--nc-slider-focus-ring",
  "--nc-slider-radius",
  "--nc-slider-gap",
  "--nc-slider-track-size",
  "--nc-slider-thumb-size",
  "--nc-slider-progress",
  "--nc-slider-progress-start",
  "--nc-slider-progress-end"
] as const;

export type NcSliderTokenName = (typeof ncSliderTokenNames)[number];