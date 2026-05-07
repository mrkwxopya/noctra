export const ncCheckboxTokenNames = [
  "--nc-checkbox-bg",
  "--nc-checkbox-border",
  "--nc-checkbox-text",
  "--nc-checkbox-muted-text",
  "--nc-checkbox-box-bg",
  "--nc-checkbox-box-bg-checked",
  "--nc-checkbox-box-border",
  "--nc-checkbox-box-border-checked",
  "--nc-checkbox-box-icon",
  "--nc-checkbox-focus-ring",
  "--nc-checkbox-radius",
  "--nc-checkbox-gap",
  "--nc-checkbox-box-size"
] as const;

export type NcCheckboxTokenName = (typeof ncCheckboxTokenNames)[number];