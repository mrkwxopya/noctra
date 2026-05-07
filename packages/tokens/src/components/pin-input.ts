export const ncPinInputTokenNames = [
  "--nc-pin-input-bg",
  "--nc-pin-input-border",
  "--nc-pin-input-text",
  "--nc-pin-input-muted-text",
  "--nc-pin-input-control-bg",
  "--nc-pin-input-control-bg-hover",
  "--nc-pin-input-separator-text",
  "--nc-pin-input-focus-ring",
  "--nc-pin-input-radius",
  "--nc-pin-input-gap",
  "--nc-pin-input-size",
  "--nc-pin-input-font-size"
] as const;

export type NcPinInputTokenName = (typeof ncPinInputTokenNames)[number];