export const ncRadioTokenNames = [
  "--nc-radio-bg",
  "--nc-radio-border",
  "--nc-radio-text",
  "--nc-radio-muted-text",
  "--nc-radio-box-bg",
  "--nc-radio-box-bg-checked",
  "--nc-radio-box-border",
  "--nc-radio-box-border-checked",
  "--nc-radio-box-icon",
  "--nc-radio-focus-ring",
  "--nc-radio-radius",
  "--nc-radio-gap",
  "--nc-radio-box-size"
] as const;

export type NcRadioTokenName = (typeof ncRadioTokenNames)[number];