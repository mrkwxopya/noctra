export const breadcrumbAnatomy = [
  "root",
  "list",
  "item",
  "link",
  "icon",
  "label",
  "description",
  "separator",
  "collapse"
] as const;

export type BreadcrumbSlot = (typeof breadcrumbAnatomy)[number];