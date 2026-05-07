export const ncCenterTokenNames = [
  "--nc-center-bg",
  "--nc-center-border",
  "--nc-center-text",
  "--nc-center-radius",
  "--nc-center-padding",
  "--nc-center-gap",
  "--nc-center-width",
  "--nc-center-height",
  "--nc-center-min-height",
  "--nc-center-max-width"
] as const;

export type NcCenterTokenName = (typeof ncCenterTokenNames)[number];