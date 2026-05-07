export const ncTimeInputTokenNames = [
  "--nc-time-input-bg",
  "--nc-time-input-border",
  "--nc-time-input-text",
  "--nc-time-input-muted-text",
  "--nc-time-input-control-bg",
  "--nc-time-input-control-bg-hover",
  "--nc-time-input-section-text",
  "--nc-time-input-clear-text",
  "--nc-time-input-clock-text",
  "--nc-time-input-focus-ring",
  "--nc-time-input-radius",
  "--nc-time-input-padding-x",
  "--nc-time-input-gap",
  "--nc-time-input-height"
] as const;

export type NcTimeInputTokenName = (typeof ncTimeInputTokenNames)[number];