export const ncInputTokenNames = [
  "--nc-input-bg",
  "--nc-input-bg-hover",
  "--nc-input-field-text",
  "--nc-input-placeholder-text",
  "--nc-input-label-text",
  "--nc-input-description-text",
  "--nc-input-error-text",
  "--nc-input-border",
  "--nc-input-border-hover",
  "--nc-input-border-focus",
  "--nc-input-border-invalid",
  "--nc-input-border-valid",
  "--nc-input-focus-ring",
  "--nc-input-radius",
  "--nc-input-height",
  "--nc-input-padding-x",
  "--nc-input-gap",
  "--nc-input-icon-color",
  "--nc-input-disabled-bg",
  "--nc-input-disabled-text",
  "--nc-input-readonly-bg"
] as const;

export type NcInputTokenName = (typeof ncInputTokenNames)[number];