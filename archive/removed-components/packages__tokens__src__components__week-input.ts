export const ncWeekInputTokenNames = [
  "--nc-week-input-bg",
  "--nc-week-input-border",
  "--nc-week-input-text",
  "--nc-week-input-muted-text",
  "--nc-week-input-control-bg",
  "--nc-week-input-control-bg-hover",
  "--nc-week-input-section-text",
  "--nc-week-input-clear-text",
  "--nc-week-input-picker-text",
  "--nc-week-input-focus-ring",
  "--nc-week-input-radius",
  "--nc-week-input-padding-x",
  "--nc-week-input-gap",
  "--nc-week-input-height"
] as const;

export type NcWeekInputTokenName = (typeof ncWeekInputTokenNames)[number];