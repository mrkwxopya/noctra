export const notificationAnatomy = [
  "root",
  "icon",
  "content",
  "title",
  "description",
  "body",
  "action",
  "close-button"
] as const;

export type NotificationSlot = (typeof notificationAnatomy)[number];