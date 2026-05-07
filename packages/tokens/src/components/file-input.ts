export const ncFileInputTokenNames = [
  "--nc-file-input-bg",
  "--nc-file-input-border",
  "--nc-file-input-text",
  "--nc-file-input-muted-text",
  "--nc-file-input-control-bg",
  "--nc-file-input-control-bg-hover",
  "--nc-file-input-section-text",
  "--nc-file-input-button-bg",
  "--nc-file-input-button-text",
  "--nc-file-input-clear-text",
  "--nc-file-input-focus-ring",
  "--nc-file-input-radius",
  "--nc-file-input-padding-x",
  "--nc-file-input-gap",
  "--nc-file-input-height"
] as const;

export type NcFileInputTokenName = (typeof ncFileInputTokenNames)[number];