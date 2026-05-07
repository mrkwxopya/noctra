export const ncPaperTokenNames = [
  "--nc-paper-bg",
  "--nc-paper-border",
  "--nc-paper-text",
  "--nc-paper-muted-text",
  "--nc-paper-shadow",
  "--nc-paper-focus-ring",
  "--nc-paper-radius",
  "--nc-paper-padding",
  "--nc-paper-gap",
  "--nc-paper-width",
  "--nc-paper-min-height",
  "--nc-paper-max-width"
] as const;

export type NcPaperTokenName = (typeof ncPaperTokenNames)[number];