export const ncDateRangePickerTokenNames = [
  "--nc-date-range-picker-bg",
  "--nc-date-range-picker-border",
  "--nc-date-range-picker-text",
  "--nc-date-range-picker-muted-text",
  "--nc-date-range-picker-panel-bg",
  "--nc-date-range-picker-cell-bg-hover",
  "--nc-date-range-picker-cell-bg-selected",
  "--nc-date-range-picker-cell-bg-range",
  "--nc-date-range-picker-cell-text-selected",
  "--nc-date-range-picker-cell-border-today",
  "--nc-date-range-picker-focus-ring",
  "--nc-date-range-picker-radius",
  "--nc-date-range-picker-gap",
  "--nc-date-range-picker-cell-size"
] as const;

export type NcDateRangePickerTokenName = (typeof ncDateRangePickerTokenNames)[number];