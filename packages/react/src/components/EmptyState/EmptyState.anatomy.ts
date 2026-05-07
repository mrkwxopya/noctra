export const emptyStateAnatomy = [
  "root",
  "media",
  "icon",
  "content",
  "title",
  "description",
  "actions",
  "action",
  "secondary-action",
  "footer"
] as const;

export type EmptyStateSlot = (typeof emptyStateAnatomy)[number];