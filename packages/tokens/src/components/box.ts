export const ncBoxTokenNames = [
  "--nc-box-bg",
  "--nc-box-border",
  "--nc-box-text",
  "--nc-box-shadow",
  "--nc-box-radius",
  "--nc-box-padding",
  "--nc-box-margin",
  "--nc-box-width",
  "--nc-box-height",
  "--nc-box-min-width",
  "--nc-box-min-height",
  "--nc-box-max-width",
  "--nc-box-max-height"
] as const;

export type NcBoxTokenName = (typeof ncBoxTokenNames)[number];