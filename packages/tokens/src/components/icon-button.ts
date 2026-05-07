export const ncIconButtonTokenNames = [
  "--nc-icon-button-bg",
  "--nc-icon-button-bg-hover",
  "--nc-icon-button-bg-active",
  "--nc-icon-button-text",
  "--nc-icon-button-border",
  "--nc-icon-button-border-hover",
  "--nc-icon-button-border-focus",
  "--nc-icon-button-shadow",
  "--nc-icon-button-radius",
  "--nc-icon-button-size",
  "--nc-icon-button-icon-size",
  "--nc-icon-button-loader-size",
  "--nc-icon-button-focus-ring",
  "--nc-icon-button-disabled-bg",
  "--nc-icon-button-disabled-text"
] as const;

export type NcIconButtonTokenName = (typeof ncIconButtonTokenNames)[number];