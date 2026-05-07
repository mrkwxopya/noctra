export const ncBadgeTokenNames = [
  "--nc-badge-bg",
  "--nc-badge-text",
  "--nc-badge-border",
  "--nc-badge-dot",
  "--nc-badge-icon",
  "--nc-badge-radius",
  "--nc-badge-height",
  "--nc-badge-padding-x",
  "--nc-badge-gap"
] as const;

export type NcBadgeTokenName = (typeof ncBadgeTokenNames)[number];