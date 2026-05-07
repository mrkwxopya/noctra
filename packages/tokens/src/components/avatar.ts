export const ncAvatarTokenNames = [
  "--nc-avatar-bg",
  "--nc-avatar-text",
  "--nc-avatar-border",
  "--nc-avatar-radius",
  "--nc-avatar-size",
  "--nc-avatar-font-size",
  "--nc-avatar-status",
  "--nc-avatar-status-border"
] as const;

export type NcAvatarTokenName = (typeof ncAvatarTokenNames)[number];