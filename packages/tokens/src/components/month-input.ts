export const ncMonthInputTokenNames = [
  "--nc-month-input-bg",
  "--nc-month-input-border",
  "--nc-month-input-text",
  "--nc-month-input-muted-text",
  "--nc-month-input-control-bg",
  "--nc-month-input-control-bg-hover",
  "--nc-month-input-section-text",
  "--nc-month-input-clear-text",
  "--nc-month-input-picker-text",
  "--nc-month-input-focus-ring",
  "--nc-month-input-radius",
  "--nc-month-input-padding-x",
  "--nc-month-input-gap",
  "--nc-month-input-height"
] as const;

export type NcMonthInputTokenName = (typeof ncMonthInputTokenNames)[number];