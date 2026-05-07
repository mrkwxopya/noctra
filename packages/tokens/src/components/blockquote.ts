export const ncBlockquoteTokenNames = [
  "--nc-blockquote-bg",
  "--nc-blockquote-border",
  "--nc-blockquote-text",
  "--nc-blockquote-muted-text",
  "--nc-blockquote-accent",
  "--nc-blockquote-icon-bg",
  "--nc-blockquote-icon-text",
  "--nc-blockquote-radius",
  "--nc-blockquote-gap",
  "--nc-blockquote-padding",
  "--nc-blockquote-font-size"
] as const;

export type NcBlockquoteTokenName = (typeof ncBlockquoteTokenNames)[number];