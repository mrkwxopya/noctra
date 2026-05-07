export const ncComboboxTokenNames = [
  "--nc-combobox-bg",
  "--nc-combobox-bg-hover",
  "--nc-combobox-border",
  "--nc-combobox-border-focus",
  "--nc-combobox-text",
  "--nc-combobox-placeholder-text",
  "--nc-combobox-label-text",
  "--nc-combobox-description-text",
  "--nc-combobox-error-text",
  "--nc-combobox-dropdown-bg",
  "--nc-combobox-dropdown-border",
  "--nc-combobox-option-bg-hover",
  "--nc-combobox-option-bg-selected",
  "--nc-combobox-option-text",
  "--nc-combobox-option-description-text",
  "--nc-combobox-icon-text",
  "--nc-combobox-focus-ring",
  "--nc-combobox-radius",
  "--nc-combobox-height",
  "--nc-combobox-padding-x"
] as const;

export type NcComboboxTokenName = (typeof ncComboboxTokenNames)[number];