export const ncToolbarTokenNames = [
  "--nc-toolbar-bg",
  "--nc-toolbar-border",
  "--nc-toolbar-text",
  "--nc-toolbar-muted-text",
  "--nc-toolbar-button-bg",
  "--nc-toolbar-button-bg-hover",
  "--nc-toolbar-button-bg-active",
  "--nc-toolbar-button-text-active",
  "--nc-toolbar-icon-text",
  "--nc-toolbar-separator",
  "--nc-toolbar-shortcut-bg",
  "--nc-toolbar-shortcut-text",
  "--nc-toolbar-focus-ring",
  "--nc-toolbar-radius",
  "--nc-toolbar-padding",
  "--nc-toolbar-gap",
  "--nc-toolbar-button-height"
] as const;

export type NcToolbarTokenName = (typeof ncToolbarTokenNames)[number];