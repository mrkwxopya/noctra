export const ncSkeletonTokenNames = [
  "--nc-skeleton-bg",
  "--nc-skeleton-border",
  "--nc-skeleton-base",
  "--nc-skeleton-highlight",
  "--nc-skeleton-radius",
  "--nc-skeleton-width",
  "--nc-skeleton-height",
  "--nc-skeleton-gap",
  "--nc-skeleton-line-height",
  "--nc-skeleton-media-height",
  "--nc-skeleton-duration",
  "--nc-skeleton-lines"
] as const;

export type NcSkeletonTokenName = (typeof ncSkeletonTokenNames)[number];