export const autocompleteAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "input",
  "clear",
  "chevron",
  "dropdown",
  "content",
  "group",
  "group-label",
  "separator",
  "option",
  "option-button",
  "indicator",
  "icon",
  "option-content",
  "option-label",
  "option-description",
  "badge",
  "right-section",
  "empty"
] as const;

export type AutocompleteSlot = (typeof autocompleteAnatomy)[number];