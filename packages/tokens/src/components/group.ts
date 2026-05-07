export const ncGroupTokenNames = [
  "--nc-group-bg",
  "--nc-group-border",
  "--nc-group-text",
  "--nc-group-radius",
  "--nc-group-padding",
  "--nc-group-gap",
  "--nc-group-row-gap",
  "--nc-group-column-gap"
] as const;

export type NcGroupTokenName = (typeof ncGroupTokenNames)[number];