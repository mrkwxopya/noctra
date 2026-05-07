export const ncGridTokenNames = [
  "--nc-grid-bg",
  "--nc-grid-border",
  "--nc-grid-text",
  "--nc-grid-radius",
  "--nc-grid-padding",
  "--nc-grid-template-columns",
  "--nc-grid-template-rows",
  "--nc-grid-auto-columns",
  "--nc-grid-auto-rows",
  "--nc-grid-gap",
  "--nc-grid-row-gap",
  "--nc-grid-column-gap",
  "--nc-grid-width",
  "--nc-grid-min-height",
  "--nc-grid-max-width"
] as const;

export type NcGridTokenName = (typeof ncGridTokenNames)[number];