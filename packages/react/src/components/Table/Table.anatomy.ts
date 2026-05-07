export const tableAnatomy = [
  "root",
  "table",
  "caption",
  "head",
  "header-row",
  "header-cell",
  "sort-button",
  "sort-icon",
  "body",
  "row",
  "cell",
  "empty"
] as const;

export type TableSlot = (typeof tableAnatomy)[number];