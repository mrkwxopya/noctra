export const ncPinCodeTokenNames = [
  "--nc-pin-code-bg",
  "--nc-pin-code-border",
  "--nc-pin-code-text",
  "--nc-pin-code-muted-text",
  "--nc-pin-code-control-bg",
  "--nc-pin-code-control-bg-hover",
  "--nc-pin-code-focus-ring",
  "--nc-pin-code-radius",
  "--nc-pin-code-gap",
  "--nc-pin-code-size",
  "--nc-pin-code-length"
] as const;

export type NcPinCodeTokenName = (typeof ncPinCodeTokenNames)[number];