export const ncSearchInputTokenNames = [
  "--nc-search-input-bg",
  "--nc-search-input-bg-hover",
  "--nc-search-input-field-text",
  "--nc-search-input-placeholder-text",
  "--nc-search-input-label-text",
  "--nc-search-input-description-text",
  "--nc-search-input-error-text",
  "--nc-search-input-border",
  "--nc-search-input-border-hover",
  "--nc-search-input-border-focus",
  "--nc-search-input-border-invalid",
  "--nc-search-input-border-valid",
  "--nc-search-input-focus-ring",
  "--nc-search-input-radius",
  "--nc-search-input-height",
  "--nc-search-input-padding-x",
  "--nc-search-input-icon-text",
  "--nc-search-input-disabled-bg",
  "--nc-search-input-disabled-text"
] as const;

export type NcSearchInputTokenName = (typeof ncSearchInputTokenNames)[number];