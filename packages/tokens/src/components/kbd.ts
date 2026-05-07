export const ncKbdTokenNames = [
  "--nc-kbd-bg",
  "--nc-kbd-border",
  "--nc-kbd-text",
  "--nc-kbd-muted-text",
  "--nc-kbd-shadow",
  "--nc-kbd-radius",
  "--nc-kbd-gap",
  "--nc-kbd-padding-x",
  "--nc-kbd-height",
  "--nc-kbd-font-size"
] as const;

export type NcKbdTokenName = (typeof ncKbdTokenNames)[number];