export const paginationAnatomy = [
  "root",
  "list",
  "item",
  "button",
  "dots"
] as const;

export type PaginationSlot = (typeof paginationAnatomy)[number];