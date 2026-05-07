export const ncRatingTokenNames = [
  "--nc-rating-bg",
  "--nc-rating-border",
  "--nc-rating-text",
  "--nc-rating-muted-text",
  "--nc-rating-icon",
  "--nc-rating-icon-empty",
  "--nc-rating-icon-hover",
  "--nc-rating-focus-ring",
  "--nc-rating-radius",
  "--nc-rating-gap",
  "--nc-rating-size",
  "--nc-rating-max"
] as const;

export type NcRatingTokenName = (typeof ncRatingTokenNames)[number];