export const ncSimpleGridTokenNames = [
  "--nc-simple-grid-bg",
  "--nc-simple-grid-border",
  "--nc-simple-grid-text",
  "--nc-simple-grid-radius",
  "--nc-simple-grid-padding",
  "--nc-simple-grid-template-columns",
  "--nc-simple-grid-min-child-width",
  "--nc-simple-grid-gap",
  "--nc-simple-grid-row-gap",
  "--nc-simple-grid-column-gap",
  "--nc-simple-grid-width",
  "--nc-simple-grid-min-height",
  "--nc-simple-grid-max-width"
] as const;

export type NcSimpleGridTokenName = (typeof ncSimpleGridTokenNames)[number];