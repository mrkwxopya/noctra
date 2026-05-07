export const ncLayoutTokenNames = [
  "--nc-layout-bg",
  "--nc-layout-border",
  "--nc-layout-text",
  "--nc-layout-muted-text",
  "--nc-layout-shadow",
  "--nc-layout-radius",
  "--nc-layout-padding",
  "--nc-layout-gap",
  "--nc-layout-width",
  "--nc-layout-min-height",
  "--nc-layout-max-width",
  "--nc-layout-sidebar-width",
  "--nc-layout-aside-width",
  "--nc-layout-header-height",
  "--nc-layout-footer-height"
] as const;

export type NcLayoutTokenName = (typeof ncLayoutTokenNames)[number];