export const ncCodeBlockTokenNames = [
  "--nc-code-block-bg",
  "--nc-code-block-border",
  "--nc-code-block-text",
  "--nc-code-block-muted-text",
  "--nc-code-block-header-bg",
  "--nc-code-block-body-bg",
  "--nc-code-block-line-number",
  "--nc-code-block-highlight-bg",
  "--nc-code-block-copy-bg",
  "--nc-code-block-copy-text",
  "--nc-code-block-focus-ring",
  "--nc-code-block-radius",
  "--nc-code-block-padding",
  "--nc-code-block-max-height"
] as const;

export type NcCodeBlockTokenName = (typeof ncCodeBlockTokenNames)[number];