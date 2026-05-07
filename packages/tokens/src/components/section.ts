export const ncSectionTokenNames = [
  "--nc-section-bg",
  "--nc-section-border",
  "--nc-section-text",
  "--nc-section-muted-text",
  "--nc-section-shadow",
  "--nc-section-radius",
  "--nc-section-padding",
  "--nc-section-gap",
  "--nc-section-width",
  "--nc-section-min-height",
  "--nc-section-max-width"
] as const;

export type NcSectionTokenName = (typeof ncSectionTokenNames)[number];