export const ncCommandTokenNames = [
  "--nc-command-trigger-bg",
  "--nc-command-trigger-bg-hover",
  "--nc-command-trigger-text",
  "--nc-command-trigger-border",
  "--nc-command-overlay-bg",
  "--nc-command-dialog-bg",
  "--nc-command-dialog-border",
  "--nc-command-heading-text",
  "--nc-command-search-bg",
  "--nc-command-search-text",
  "--nc-command-item-bg-hover",
  "--nc-command-item-text",
  "--nc-command-item-description-text",
  "--nc-command-item-danger-text",
  "--nc-command-focus-ring",
  "--nc-command-radius",
  "--nc-command-width",
  "--nc-command-padding"
] as const;

export type NcCommandTokenName = (typeof ncCommandTokenNames)[number];