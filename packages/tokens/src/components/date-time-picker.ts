export const ncDateTimePickerTokenNames = [
  "--nc-date-time-picker-bg",
  "--nc-date-time-picker-bg-hover",
  "--nc-date-time-picker-border",
  "--nc-date-time-picker-border-focus",
  "--nc-date-time-picker-text",
  "--nc-date-time-picker-placeholder-text",
  "--nc-date-time-picker-label-text",
  "--nc-date-time-picker-description-text",
  "--nc-date-time-picker-error-text",
  "--nc-date-time-picker-icon-text",
  "--nc-date-time-picker-focus-ring",
  "--nc-date-time-picker-radius",
  "--nc-date-time-picker-height",
  "--nc-date-time-picker-padding-x"
] as const;

export type NcDateTimePickerTokenName = (typeof ncDateTimePickerTokenNames)[number];