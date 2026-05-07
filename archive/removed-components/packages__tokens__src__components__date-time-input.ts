export const ncDateTimeInputTokenNames = [
  "--nc-date-time-input-bg",
  "--nc-date-time-input-border",
  "--nc-date-time-input-text",
  "--nc-date-time-input-muted-text",
  "--nc-date-time-input-control-bg",
  "--nc-date-time-input-control-bg-hover",
  "--nc-date-time-input-section-text",
  "--nc-date-time-input-clear-text",
  "--nc-date-time-input-picker-text",
  "--nc-date-time-input-focus-ring",
  "--nc-date-time-input-radius",
  "--nc-date-time-input-padding-x",
  "--nc-date-time-input-gap",
  "--nc-date-time-input-height"
] as const;

export type NcDateTimeInputTokenName = (typeof ncDateTimeInputTokenNames)[number];