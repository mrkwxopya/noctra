export const ncInlineCodeTokenNames = [
  "--nc-inline-code-bg",
  "--nc-inline-code-border",
  "--nc-inline-code-text",
  "--nc-inline-code-muted-text",
  "--nc-inline-code-accent",
  "--nc-inline-code-radius",
  "--nc-inline-code-gap",
  "--nc-inline-code-padding-x",
  "--nc-inline-code-height",
  "--nc-inline-code-font-size"
] as const;

export type NcInlineCodeTokenName = (typeof ncInlineCodeTokenNames)[number];