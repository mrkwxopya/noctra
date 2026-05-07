export const buttonAnatomy = ["root", "icon", "label", "loader"] as const;

export type ButtonSlot = (typeof buttonAnatomy)[number];