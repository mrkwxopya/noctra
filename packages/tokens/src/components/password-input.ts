export const ncPasswordInputTokenNames = [
  "--nc-password-input-bg",
  "--nc-password-input-border",
  "--nc-password-input-text",
  "--nc-password-input-muted-text",
  "--nc-password-input-control-bg",
  "--nc-password-input-control-bg-hover",
  "--nc-password-input-section-text",
  "--nc-password-input-prefix-text",
  "--nc-password-input-clear-text",
  "--nc-password-input-reveal-text",
  "--nc-password-input-strength-bg",
  "--nc-password-input-strength-fill",
  "--nc-password-input-focus-ring",
  "--nc-password-input-radius",
  "--nc-password-input-padding-x",
  "--nc-password-input-gap",
  "--nc-password-input-height"
] as const;

export type NcPasswordInputTokenName = (typeof ncPasswordInputTokenNames)[number];