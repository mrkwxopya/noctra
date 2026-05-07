export const ncDrawerTokenNames = [
  "--nc-drawer-overlay-bg",
  "--nc-drawer-bg",
  "--nc-drawer-border",
  "--nc-drawer-text",
  "--nc-drawer-muted-text",
  "--nc-drawer-header-bg",
  "--nc-drawer-footer-bg",
  "--nc-drawer-close-bg-hover",
  "--nc-drawer-close-text",
  "--nc-drawer-focus-ring",
  "--nc-drawer-radius",
  "--nc-drawer-padding",
  "--nc-drawer-gap",
  "--nc-drawer-width",
  "--nc-drawer-height",
  "--nc-drawer-z-index"
] as const;

export type NcDrawerTokenName = (typeof ncDrawerTokenNames)[number];