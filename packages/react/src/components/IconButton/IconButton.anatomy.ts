export const iconButtonAnatomy = ["root", "icon", "loader"] as const;

export type IconButtonSlot = (typeof iconButtonAnatomy)[number];