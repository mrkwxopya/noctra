export const ncSelectTokenNames = [
  "--nc-select-bg",
  "--nc-select-border",
  "--nc-select-text",
  "--nc-select-muted-text",
  "--nc-select-control-bg",
  "--nc-select-control-bg-hover",
  "--nc-select-dropdown-bg",
  "--nc-select-option-bg-hover",
  "--nc-select-option-bg-active",
  "--nc-select-option-text-active",
  "--nc-select-icon-text",
  "--nc-select-separator",
  "--nc-select-focus-ring",
  "--nc-select-radius",
  "--nc-select-padding",
  "--nc-select-gap",
  "--nc-select-width",
  "--nc-select-max-dropdown-height",
  "--nc-select-z-index"
] as const;

export type NcSelectTokenName = (typeof ncSelectTokenNames)[number];