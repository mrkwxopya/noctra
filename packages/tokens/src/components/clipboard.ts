export const ncClipboardTokenNames = [
  "--nc-clipboard-bg",
  "--nc-clipboard-border",
  "--nc-clipboard-text",
  "--nc-clipboard-muted-text",
  "--nc-clipboard-control-bg",
  "--nc-clipboard-control-bg-hover",
  "--nc-clipboard-section-text",
  "--nc-clipboard-button-bg",
  "--nc-clipboard-button-text",
  "--nc-clipboard-clear-text",
  "--nc-clipboard-focus-ring",
  "--nc-clipboard-radius",
  "--nc-clipboard-padding-x",
  "--nc-clipboard-gap",
  "--nc-clipboard-height"
] as const;

export type NcClipboardTokenName = (typeof ncClipboardTokenNames)[number];