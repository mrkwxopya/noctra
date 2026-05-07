export const ncNumberInputTokenNames = [
  "--nc-number-input-bg",
  "--nc-number-input-border",
  "--nc-number-input-text",
  "--nc-number-input-muted-text",
  "--nc-number-input-control-bg",
  "--nc-number-input-control-bg-hover",
  "--nc-number-input-section-text",
  "--nc-number-input-prefix-text",
  "--nc-number-input-clear-text",
  "--nc-number-input-button-bg-hover",
  "--nc-number-input-focus-ring",
  "--nc-number-input-radius",
  "--nc-number-input-padding-x",
  "--nc-number-input-gap",
  "--nc-number-input-height"
] as const;

export type NcNumberInputTokenName = (typeof ncNumberInputTokenNames)[number];