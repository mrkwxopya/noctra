export const ncAnchorTokenNames = [
  "--nc-anchor-bg",
  "--nc-anchor-border",
  "--nc-anchor-heading-text",
  "--nc-anchor-description-text",
  "--nc-anchor-link-text",
  "--nc-anchor-link-text-hover",
  "--nc-anchor-link-bg-hover",
  "--nc-anchor-link-bg-active",
  "--nc-anchor-link-text-active",
  "--nc-anchor-icon-text",
  "--nc-anchor-indicator",
  "--nc-anchor-badge-bg",
  "--nc-anchor-badge-text",
  "--nc-anchor-focus-ring",
  "--nc-anchor-radius",
  "--nc-anchor-padding",
  "--nc-anchor-gap"
] as const;

export type NcAnchorTokenName = (typeof ncAnchorTokenNames)[number];