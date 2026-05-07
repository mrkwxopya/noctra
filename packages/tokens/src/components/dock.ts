export const ncDockTokenNames = [
  "--nc-dock-bg",
  "--nc-dock-border",
  "--nc-dock-text",
  "--nc-dock-muted-text",
  "--nc-dock-item-bg",
  "--nc-dock-item-bg-hover",
  "--nc-dock-item-bg-active",
  "--nc-dock-item-text-active",
  "--nc-dock-icon-text",
  "--nc-dock-badge-bg",
  "--nc-dock-badge-text",
  "--nc-dock-focus-ring",
  "--nc-dock-radius",
  "--nc-dock-padding",
  "--nc-dock-gap",
  "--nc-dock-item-size",
  "--nc-dock-z-index"
] as const;

export type NcDockTokenName = (typeof ncDockTokenNames)[number];