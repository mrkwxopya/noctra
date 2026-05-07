export const ncStatusBarTokenNames = [
  "--nc-status-bar-bg",
  "--nc-status-bar-border",
  "--nc-status-bar-text",
  "--nc-status-bar-muted-text",
  "--nc-status-bar-item-bg",
  "--nc-status-bar-item-bg-hover",
  "--nc-status-bar-item-bg-active",
  "--nc-status-bar-item-text-active",
  "--nc-status-bar-icon-text",
  "--nc-status-bar-separator",
  "--nc-status-bar-badge-bg",
  "--nc-status-bar-badge-text",
  "--nc-status-bar-focus-ring",
  "--nc-status-bar-radius",
  "--nc-status-bar-height",
  "--nc-status-bar-padding-x",
  "--nc-status-bar-gap",
  "--nc-status-bar-z-index"
] as const;

export type NcStatusBarTokenName = (typeof ncStatusBarTokenNames)[number];