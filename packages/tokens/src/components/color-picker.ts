export const ncColorPickerTokenNames = [
  "--nc-color-picker-bg",
  "--nc-color-picker-border",
  "--nc-color-picker-text",
  "--nc-color-picker-muted-text",
  "--nc-color-picker-panel-bg",
  "--nc-color-picker-preview-border",
  "--nc-color-picker-value",
  "--nc-color-picker-focus-ring",
  "--nc-color-picker-radius",
  "--nc-color-picker-gap",
  "--nc-color-picker-preview-size",
  "--nc-color-picker-swatch-size"
] as const;

export type NcColorPickerTokenName = (typeof ncColorPickerTokenNames)[number];