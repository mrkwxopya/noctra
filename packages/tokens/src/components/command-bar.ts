export const ncCommandBarTokenNames = [
  "--nc-command-bar-bg",
  "--nc-command-bar-border",
  "--nc-command-bar-text",
  "--nc-command-bar-muted-text",
  "--nc-command-bar-control-bg",
  "--nc-command-bar-control-border",
  "--nc-command-bar-item-bg-hover",
  "--nc-command-bar-item-bg-active",
  "--nc-command-bar-item-text-active",
  "--nc-command-bar-icon-text",
  "--nc-command-bar-shortcut-bg",
  "--nc-command-bar-shortcut-text",
  "--nc-command-bar-focus-ring",
  "--nc-command-bar-radius",
  "--nc-command-bar-padding",
  "--nc-command-bar-gap",
  "--nc-command-bar-width",
  "--nc-command-bar-z-index"
] as const;

export type NcCommandBarTokenName = (typeof ncCommandBarTokenNames)[number];