export const toastAnatomy = [
  "root",
  "icon",
  "content",
  "title",
  "description",
  "action",
  "close-button",
  "progress"
] as const;

export type ToastSlot = (typeof toastAnatomy)[number];