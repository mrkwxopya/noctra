export const ncTimePickerTokenNames = [
  "--nc-time-picker-bg",
  "--nc-time-picker-bg-hover",
  "--nc-time-picker-border",
  "--nc-time-picker-border-focus",
  "--nc-time-picker-text",
  "--nc-time-picker-placeholder-text",
  "--nc-time-picker-label-text",
  "--nc-time-picker-description-text",
  "--nc-time-picker-error-text",
  "--nc-time-picker-icon-text",
  "--nc-time-picker-focus-ring",
  "--nc-time-picker-radius",
  "--nc-time-picker-height",
  "--nc-time-picker-padding-x"
] as const;

export type NcTimePickerTokenName = (typeof ncTimePickerTokenNames)[number];