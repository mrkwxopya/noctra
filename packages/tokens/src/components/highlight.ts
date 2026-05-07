export const ncHighlightTokenNames = [
  "--nc-highlight-bg",
  "--nc-highlight-border",
  "--nc-highlight-text",
  "--nc-highlight-match-bg",
  "--nc-highlight-match-text",
  "--nc-highlight-radius",
  "--nc-highlight-padding-x",
  "--nc-highlight-padding-y",
  "--nc-highlight-font-size"
] as const;

export type NcHighlightTokenName = (typeof ncHighlightTokenNames)[number];