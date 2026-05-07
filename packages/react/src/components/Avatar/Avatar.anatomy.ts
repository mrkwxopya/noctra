export const avatarAnatomy = ["root", "image", "fallback", "status", "badge"] as const;

export type AvatarSlot = (typeof avatarAnatomy)[number];