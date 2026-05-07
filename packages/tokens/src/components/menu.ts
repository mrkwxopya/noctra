export const ncMenuTokenNames = [
  "--nc-menu-bg",
  "--nc-menu-border",
  "--nc-menu-text",
  "--nc-menu-muted-text",
  "--nc-menu-trigger-bg",
  "--nc-menu-trigger-bg-hover",
  "--nc-menu-item-bg-hover",
  "--nc-menu-item-bg-active",
  "--nc-menu-item-text-active",
  "--nc-menu-icon-text",
  "--nc-menu-separator",
  "--nc-menu-shortcut-bg",
  "--nc-menu-shortcut-text",
  "--nc-menu-focus-ring",
  "--nc-menu-radius",
  "--nc-menu-padding",
  "--nc-menu-gap",
  "--nc-menu-width",
  "--nc-menu-offset",
  "--nc-menu-z-index"
] as const;

export type NcMenuTokenName = (typeof ncMenuTokenNames)[number];