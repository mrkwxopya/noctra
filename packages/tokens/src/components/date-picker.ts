export const ncDatePickerTokenNames = [
  "--nc-date-picker-bg",
  "--nc-date-picker-border",
  "--nc-date-picker-text",
  "--nc-date-picker-muted-text",
  "--nc-date-picker-panel-bg",
  "--nc-date-picker-cell-bg-hover",
  "--nc-date-picker-cell-bg-selected",
  "--nc-date-picker-cell-text-selected",
  "--nc-date-picker-cell-border-today",
  "--nc-date-picker-focus-ring",
  "--nc-date-picker-radius",
  "--nc-date-picker-gap",
  "--nc-date-picker-cell-size"
] as const;

export type NcDatePickerTokenName = (typeof ncDatePickerTokenNames)[number];