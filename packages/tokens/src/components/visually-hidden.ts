export const ncVisuallyHiddenTokenNames = [
  "--nc-visually-hidden-bg",
  "--nc-visually-hidden-border",
  "--nc-visually-hidden-text",
  "--nc-visually-hidden-focus-ring",
  "--nc-visually-hidden-radius",
  "--nc-visually-hidden-padding-x",
  "--nc-visually-hidden-padding-y",
  "--nc-visually-hidden-z-index"
] as const;

export type NcVisuallyHiddenTokenName = (typeof ncVisuallyHiddenTokenNames)[number];