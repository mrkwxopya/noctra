export const ncDateInputTokenNames = [
  "--nc-date-input-bg",
  "--nc-date-input-border",
  "--nc-date-input-text",
  "--nc-date-input-muted-text",
  "--nc-date-input-control-bg",
  "--nc-date-input-control-bg-hover",
  "--nc-date-input-section-text",
  "--nc-date-input-clear-text",
  "--nc-date-input-calendar-text",
  "--nc-date-input-focus-ring",
  "--nc-date-input-radius",
  "--nc-date-input-padding-x",
  "--nc-date-input-gap",
  "--nc-date-input-height"
] as const;

export type NcDateInputTokenName = (typeof ncDateInputTokenNames)[number];