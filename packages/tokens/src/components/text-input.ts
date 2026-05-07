export const ncTextInputTokenNames = [
  "--nc-text-input-bg",
  "--nc-text-input-border",
  "--nc-text-input-text",
  "--nc-text-input-muted-text",
  "--nc-text-input-control-bg",
  "--nc-text-input-control-bg-hover",
  "--nc-text-input-section-text",
  "--nc-text-input-prefix-text",
  "--nc-text-input-clear-text",
  "--nc-text-input-focus-ring",
  "--nc-text-input-radius",
  "--nc-text-input-padding-x",
  "--nc-text-input-gap",
  "--nc-text-input-height"
] as const;

export type NcTextInputTokenName = (typeof ncTextInputTokenNames)[number];