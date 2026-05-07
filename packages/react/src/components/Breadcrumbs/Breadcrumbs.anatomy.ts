export const breadcrumbsAnatomy = [
  "root",
  "list",
  "item",
  "link",
  "icon",
  "label",
  "separator",
  "ellipsis"
] as const;

export type BreadcrumbsSlot = (typeof breadcrumbsAnatomy)[number];