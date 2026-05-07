export const ncFormFieldTokenNames = [
  "--nc-form-field-gap",
  "--nc-form-field-label-text",
  "--nc-form-field-description-text",
  "--nc-form-field-hint-text",
  "--nc-form-field-error-text",
  "--nc-form-field-required-text",
  "--nc-form-field-control-gap",
  "--nc-form-field-disabled-opacity"
] as const;

export type NcFormFieldTokenName = (typeof ncFormFieldTokenNames)[number];