export const ncButtonTokenNames = [
  "--nc-button-bg",
  "--nc-button-bg-hover",
  "--nc-button-bg-active",
  "--nc-button-text",
  "--nc-button-border",
  "--nc-button-border-hover",
  "--nc-button-border-focus",
  "--nc-button-shadow",
  "--nc-button-radius",
  "--nc-button-height",
  "--nc-button-padding-x",
  "--nc-button-padding-y",
  "--nc-button-gap",
  "--nc-button-icon-size",
  "--nc-button-loader-size",
  "--nc-button-focus-ring",
  "--nc-button-disabled-bg",
  "--nc-button-disabled-text"
] as const;

export type NcButtonTokenName = (typeof ncButtonTokenNames)[number];