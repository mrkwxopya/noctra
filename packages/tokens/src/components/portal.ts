export const ncPortalTokenNames = [
  "--nc-portal-bg",
  "--nc-portal-border",
  "--nc-portal-text",
  "--nc-portal-radius",
  "--nc-portal-padding",
  "--nc-portal-z-index"
] as const;

export type NcPortalTokenName = (typeof ncPortalTokenNames)[number];