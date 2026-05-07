export const ncDialogTokenNames = [
  "--nc-dialog-trigger-bg",
  "--nc-dialog-trigger-bg-hover",
  "--nc-dialog-trigger-text",
  "--nc-dialog-trigger-border",
  "--nc-dialog-overlay-bg",
  "--nc-dialog-content-bg",
  "--nc-dialog-content-border",
  "--nc-dialog-heading-text",
  "--nc-dialog-description-text",
  "--nc-dialog-body-text",
  "--nc-dialog-focus-ring",
  "--nc-dialog-radius",
  "--nc-dialog-width",
  "--nc-dialog-padding"
] as const;

export type NcDialogTokenName = (typeof ncDialogTokenNames)[number];