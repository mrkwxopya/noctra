export const ncColorInputTokenNames = [
  "--nc-color-input-bg",
  "--nc-color-input-border",
  "--nc-color-input-text",
  "--nc-color-input-muted-text",
  "--nc-color-input-control-bg",
  "--nc-color-input-control-bg-hover",
  "--nc-color-input-section-text",
  "--nc-color-input-clear-text",
  "--nc-color-input-preview-border",
  "--nc-color-input-preview-color",
  "--nc-color-input-focus-ring",
  "--nc-color-input-radius",
  "--nc-color-input-padding-x",
  "--nc-color-input-gap",
  "--nc-color-input-height",
  "--nc-color-input-preview-size"
] as const;

export type NcColorInputTokenName = (typeof ncColorInputTokenNames)[number];