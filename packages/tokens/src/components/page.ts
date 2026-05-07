export const ncPageTokenNames = [
  "--nc-page-bg",
  "--nc-page-border",
  "--nc-page-text",
  "--nc-page-muted-text",
  "--nc-page-shadow",
  "--nc-page-radius",
  "--nc-page-padding",
  "--nc-page-gap",
  "--nc-page-sidebar-width",
  "--nc-page-aside-width",
  "--nc-page-width",
  "--nc-page-min-height",
  "--nc-page-max-width"
] as const;

export type NcPageTokenName = (typeof ncPageTokenNames)[number];