export const badgeAnatomy = ["root", "dot", "icon", "label", "close"] as const;

export type BadgeSlot = (typeof badgeAnatomy)[number];