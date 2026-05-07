export const skeletonAnatomy = [
  "root",
  "content",
  "line",
  "media",
  "body"
] as const;

export type SkeletonSlot = (typeof skeletonAnatomy)[number];