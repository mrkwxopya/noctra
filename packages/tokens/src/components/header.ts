export const ncHeaderTokenNames = [
  "--nc-header-bg",
  "--nc-header-border",
  "--nc-header-text",
  "--nc-header-muted-text",
  "--nc-header-logo-bg",
  "--nc-header-logo-text",
  "--nc-header-focus-ring",
  "--nc-header-radius",
  "--nc-header-height",
  "--nc-header-padding-x",
  "--nc-header-gap",
  "--nc-header-z-index"
] as const;

export type NcHeaderTokenName = (typeof ncHeaderTokenNames)[number];