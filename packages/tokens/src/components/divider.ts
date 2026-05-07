export const ncDividerTokenNames = [
  "--nc-divider-bg",
  "--nc-divider-border",
  "--nc-divider-text",
  "--nc-divider-line",
  "--nc-divider-label-bg",
  "--nc-divider-radius",
  "--nc-divider-gap",
  "--nc-divider-thickness",
  "--nc-divider-length",
  "--nc-divider-inset"
] as const;

export type NcDividerTokenName = (typeof ncDividerTokenNames)[number];