export const ncAspectRatioTokenNames = [
  "--nc-aspect-ratio-bg",
  "--nc-aspect-ratio-border",
  "--nc-aspect-ratio-text",
  "--nc-aspect-ratio-radius",
  "--nc-aspect-ratio-padding",
  "--nc-aspect-ratio",
  "--nc-aspect-ratio-width",
  "--nc-aspect-ratio-min-height",
  "--nc-aspect-ratio-max-height"
] as const;

export type NcAspectRatioTokenName = (typeof ncAspectRatioTokenNames)[number];