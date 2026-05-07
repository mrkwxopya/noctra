export const ncSpacerTokenNames = [
  "--nc-spacer-bg",
  "--nc-spacer-border",
  "--nc-spacer-text",
  "--nc-spacer-radius",
  "--nc-spacer-space",
  "--nc-spacer-inline-size",
  "--nc-spacer-block-size",
  "--nc-spacer-grow",
  "--nc-spacer-shrink"
] as const;

export type NcSpacerTokenName = (typeof ncSpacerTokenNames)[number];