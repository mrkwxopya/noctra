export const containerAnatomy = [
  "root",
  "content"
] as const;

export type ContainerSlot = (typeof containerAnatomy)[number];