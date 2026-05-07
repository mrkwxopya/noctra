export const drawerAnatomy = [
  "root",
  "overlay",
  "panel",
  "header",
  "title-group",
  "title",
  "description",
  "close",
  "body",
  "footer",
  "actions"
] as const;

export type DrawerSlot = (typeof drawerAnatomy)[number];