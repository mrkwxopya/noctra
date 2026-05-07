export const ncAutocompleteTokenNames = [
  "--nc-autocomplete-bg",
  "--nc-autocomplete-border",
  "--nc-autocomplete-text",
  "--nc-autocomplete-muted-text",
  "--nc-autocomplete-control-bg",
  "--nc-autocomplete-control-bg-hover",
  "--nc-autocomplete-dropdown-bg",
  "--nc-autocomplete-option-bg-hover",
  "--nc-autocomplete-option-bg-active",
  "--nc-autocomplete-option-text-active",
  "--nc-autocomplete-icon-text",
  "--nc-autocomplete-separator",
  "--nc-autocomplete-focus-ring",
  "--nc-autocomplete-radius",
  "--nc-autocomplete-padding",
  "--nc-autocomplete-gap",
  "--nc-autocomplete-width",
  "--nc-autocomplete-max-dropdown-height",
  "--nc-autocomplete-z-index"
] as const;

export type NcAutocompleteTokenName = (typeof ncAutocompleteTokenNames)[number];