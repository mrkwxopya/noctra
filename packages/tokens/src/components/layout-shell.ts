export const ncLayoutShellTokenNames = [
  "--nc-layout-shell-bg",
  "--nc-layout-shell-border",
  "--nc-layout-shell-text",
  "--nc-layout-shell-muted-text",
  "--nc-layout-shell-header-bg",
  "--nc-layout-shell-sidebar-bg",
  "--nc-layout-shell-main-bg",
  "--nc-layout-shell-footer-bg",
  "--nc-layout-shell-focus-ring",
  "--nc-layout-shell-radius",
  "--nc-layout-shell-header-height",
  "--nc-layout-shell-sidebar-width",
  "--nc-layout-shell-sidebar-width-collapsed",
  "--nc-layout-shell-aside-width",
  "--nc-layout-shell-padding",
  "--nc-layout-shell-gap"
] as const;

export type NcLayoutShellTokenName = (typeof ncLayoutShellTokenNames)[number];