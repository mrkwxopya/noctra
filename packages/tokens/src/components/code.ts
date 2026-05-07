export const ncCodeTokenNames = [
  "--nc-code-bg",
  "--nc-code-border",
  "--nc-code-text",
  "--nc-code-shadow",
  "--nc-code-block-bg",
  "--nc-code-block-border",
  "--nc-code-block-header-bg",
  "--nc-code-block-label-text",
  "--nc-code-block-description-text",
  "--nc-code-block-line-number-text",
  "--nc-code-block-highlight-bg",
  "--nc-code-radius",
  "--nc-code-padding-x",
  "--nc-code-block-padding"
] as const;

export type NcCodeTokenName = (typeof ncCodeTokenNames)[number];