export const ncPaginationTokenNames = [
  "--nc-pagination-bg",
  "--nc-pagination-border",
  "--nc-pagination-text",
  "--nc-pagination-muted-text",
  "--nc-pagination-button-bg",
  "--nc-pagination-button-bg-hover",
  "--nc-pagination-button-bg-active",
  "--nc-pagination-button-text-active",
  "--nc-pagination-dots-text",
  "--nc-pagination-focus-ring",
  "--nc-pagination-radius",
  "--nc-pagination-padding",
  "--nc-pagination-gap",
  "--nc-pagination-button-size"
] as const;

export type NcPaginationTokenName = (typeof ncPaginationTokenNames)[number];