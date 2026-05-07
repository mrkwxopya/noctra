export const loaderAnatomy = [
  "root",
  "indicator",
  "spinner",
  "dot",
  "bar",
  "ring",
  "content",
  "label",
  "description"
] as const;

export type LoaderSlot = (typeof loaderAnatomy)[number];