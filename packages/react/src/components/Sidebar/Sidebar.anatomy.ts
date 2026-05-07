export const sidebarAnatomy = [
  "root",
  "header",
  "logo",
  "title-group",
  "title",
  "subtitle",
  "actions",
  "content",
  "footer"
] as const;

export type SidebarSlot = (typeof sidebarAnatomy)[number];