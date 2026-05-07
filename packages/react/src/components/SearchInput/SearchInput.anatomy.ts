export const searchInputAnatomy = [
  "root",
  "wrapper",
  "field",
  "label",
  "description",
  "error",
  "search-icon",
  "clear-button",
  "clear-icon",
  "loader"
] as const;

export type SearchInputSlot = (typeof searchInputAnatomy)[number];