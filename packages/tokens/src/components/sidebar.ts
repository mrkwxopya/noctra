export const ncSidebarTokenNames = [
  "--nc-sidebar-bg",
  "--nc-sidebar-border",
  "--nc-sidebar-text",
  "--nc-sidebar-muted-text",
  "--nc-sidebar-logo-bg",
  "--nc-sidebar-logo-text",
  "--nc-sidebar-header-bg",
  "--nc-sidebar-footer-bg",
  "--nc-sidebar-focus-ring",
  "--nc-sidebar-radius",
  "--nc-sidebar-width",
  "--nc-sidebar-width-collapsed",
  "--nc-sidebar-padding",
  "--nc-sidebar-gap"
] as const;

export type NcSidebarTokenName = (typeof ncSidebarTokenNames)[number];