export const alertAnatomy = ["root", "icon", "content", "title", "description", "action", "close"] as const;

export type AlertSlot = (typeof alertAnatomy)[number];