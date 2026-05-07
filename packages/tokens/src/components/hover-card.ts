export const ncHoverCardTokenNames = [
  "--nc-hover-card-bg",
  "--nc-hover-card-border",
  "--nc-hover-card-text",
  "--nc-hover-card-muted-text",
  "--nc-hover-card-trigger-bg",
  "--nc-hover-card-trigger-bg-hover",
  "--nc-hover-card-focus-ring",
  "--nc-hover-card-radius",
  "--nc-hover-card-padding",
  "--nc-hover-card-gap",
  "--nc-hover-card-width",
  "--nc-hover-card-offset",
  "--nc-hover-card-z-index"
] as const;

export type NcHoverCardTokenName = (typeof ncHoverCardTokenNames)[number];