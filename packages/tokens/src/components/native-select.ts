export const ncNativeSelectTokenNames = [
  "--nc-native-select-bg",
  "--nc-native-select-bg-hover",
  "--nc-native-select-field-text",
  "--nc-native-select-placeholder-text",
  "--nc-native-select-label-text",
  "--nc-native-select-description-text",
  "--nc-native-select-error-text",
  "--nc-native-select-border",
  "--nc-native-select-border-hover",
  "--nc-native-select-border-focus",
  "--nc-native-select-border-invalid",
  "--nc-native-select-border-valid",
  "--nc-native-select-focus-ring",
  "--nc-native-select-radius",
  "--nc-native-select-height",
  "--nc-native-select-padding-x",
  "--nc-native-select-disabled-bg",
  "--nc-native-select-disabled-text",
  "--nc-native-select-arrow-text"
] as const;

export type NcNativeSelectTokenName = (typeof ncNativeSelectTokenNames)[number];