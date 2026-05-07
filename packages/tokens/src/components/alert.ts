export const ncAlertTokenNames = [
  "--nc-alert-bg",
  "--nc-alert-text",
  "--nc-alert-title-text",
  "--nc-alert-description-text",
  "--nc-alert-border",
  "--nc-alert-icon",
  "--nc-alert-radius",
  "--nc-alert-padding",
  "--nc-alert-gap",
  "--nc-alert-shadow",
  "--nc-alert-close-bg-hover"
] as const;

export type NcAlertTokenName = (typeof ncAlertTokenNames)[number];