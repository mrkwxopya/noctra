export const ncCardTokenNames = [
  "--nc-card-bg",
  "--nc-card-border",
  "--nc-card-text",
  "--nc-card-muted-text",
  "--nc-card-shadow",
  "--nc-card-focus-ring",
  "--nc-card-radius",
  "--nc-card-padding",
  "--nc-card-gap",
  "--nc-card-media-bg",
  "--nc-card-action-bg",
  "--nc-card-action-text",
  "--nc-card-secondary-bg",
  "--nc-card-secondary-text",
  "--nc-card-width",
  "--nc-card-min-height",
  "--nc-card-max-width"
] as const;

export type NcCardTokenName = (typeof ncCardTokenNames)[number];