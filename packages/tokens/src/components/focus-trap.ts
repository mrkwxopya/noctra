export const ncFocusTrapTokenNames = [
  "--nc-focus-trap-bg",
  "--nc-focus-trap-border",
  "--nc-focus-trap-text",
  "--nc-focus-trap-focus-ring",
  "--nc-focus-trap-radius",
  "--nc-focus-trap-padding"
] as const;

export type NcFocusTrapTokenName = (typeof ncFocusTrapTokenNames)[number];