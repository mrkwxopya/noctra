export const dataGridAnatomy = [
  "root",
  "toolbar",
  "title",
  "description",
  "search",
  "table-wrap",
  "table",
  "caption",
  "head",
  "header-row",
  "header-cell",
  "sort-button",
  "sort-icon",
  "select-cell",
  "checkbox",
  "body",
  "row",
  "cell",
  "empty",
  "footer"
] as const;

export type DataGridSlot = (typeof dataGridAnatomy)[number];