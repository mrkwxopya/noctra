export const ncStackTokenNames = [
  "--nc-stack-bg",
  "--nc-stack-border",
  "--nc-stack-text",
  "--nc-stack-radius",
  "--nc-stack-padding",
  "--nc-stack-gap",
  "--nc-stack-row-gap",
  "--nc-stack-column-gap"
] as const;

export type NcStackTokenName = (typeof ncStackTokenNames)[number];