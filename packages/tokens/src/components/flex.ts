export const ncFlexTokenNames = [
  "--nc-flex-bg",
  "--nc-flex-border",
  "--nc-flex-text",
  "--nc-flex-radius",
  "--nc-flex-padding",
  "--nc-flex-gap",
  "--nc-flex-row-gap",
  "--nc-flex-column-gap",
  "--nc-flex-basis",
  "--nc-flex-grow",
  "--nc-flex-shrink",
  "--nc-flex-order",
  "--nc-flex-width",
  "--nc-flex-height",
  "--nc-flex-min-width",
  "--nc-flex-min-height",
  "--nc-flex-max-width",
  "--nc-flex-max-height"
] as const;

export type NcFlexTokenName = (typeof ncFlexTokenNames)[number];