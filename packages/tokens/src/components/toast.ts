export const ncToastTokenNames = [
  "--nc-toast-bg",
  "--nc-toast-border",
  "--nc-toast-title-text",
  "--nc-toast-description-text",
  "--nc-toast-icon-text",
  "--nc-toast-action-bg",
  "--nc-toast-action-bg-hover",
  "--nc-toast-action-text",
  "--nc-toast-close-text",
  "--nc-toast-progress-bg",
  "--nc-toast-focus-ring",
  "--nc-toast-radius",
  "--nc-toast-width",
  "--nc-toast-padding",
  "--nc-toast-gap"
] as const;

export type NcToastTokenName = (typeof ncToastTokenNames)[number];