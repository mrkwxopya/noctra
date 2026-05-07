export const ncContextMenuTokenNames = [
  "--nc-context-menu-bg",
  "--nc-context-menu-border",
  "--nc-context-menu-text",
  "--nc-context-menu-muted-text",
  "--nc-context-menu-item-bg-hover",
  "--nc-context-menu-item-bg-active",
  "--nc-context-menu-item-text-active",
  "--nc-context-menu-icon-text",
  "--nc-context-menu-separator",
  "--nc-context-menu-shortcut-bg",
  "--nc-context-menu-shortcut-text",
  "--nc-context-menu-focus-ring",
  "--nc-context-menu-radius",
  "--nc-context-menu-padding",
  "--nc-context-menu-gap",
  "--nc-context-menu-width",
  "--nc-context-menu-x",
  "--nc-context-menu-y",
  "--nc-context-menu-z-index"
] as const;

export type NcContextMenuTokenName = (typeof ncContextMenuTokenNames)[number];