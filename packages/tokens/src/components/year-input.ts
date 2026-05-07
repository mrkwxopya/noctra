export const ncYearInputTokenNames = [
  "--nc-year-input-bg",
  "--nc-year-input-border",
  "--nc-year-input-text",
  "--nc-year-input-muted-text",
  "--nc-year-input-control-bg",
  "--nc-year-input-control-bg-hover",
  "--nc-year-input-section-text",
  "--nc-year-input-clear-text",
  "--nc-year-input-button-bg-hover",
  "--nc-year-input-focus-ring",
  "--nc-year-input-radius",
  "--nc-year-input-padding-x",
  "--nc-year-input-gap",
  "--nc-year-input-height"
] as const;

export type NcYearInputTokenName = (typeof ncYearInputTokenNames)[number];