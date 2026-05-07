export const ncAppShellTokenNames = [
  "--nc-app-shell-bg",
  "--nc-app-shell-border",
  "--nc-app-shell-text",
  "--nc-app-shell-muted-text",
  "--nc-app-shell-header-bg",
  "--nc-app-shell-navbar-bg",
  "--nc-app-shell-main-bg",
  "--nc-app-shell-aside-bg",
  "--nc-app-shell-footer-bg",
  "--nc-app-shell-focus-ring",
  "--nc-app-shell-radius",
  "--nc-app-shell-header-height",
  "--nc-app-shell-navbar-width",
  "--nc-app-shell-navbar-width-collapsed",
  "--nc-app-shell-aside-width",
  "--nc-app-shell-padding",
  "--nc-app-shell-gap"
] as const;

export type NcAppShellTokenName = (typeof ncAppShellTokenNames)[number];