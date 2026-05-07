export const ncNotificationTokenNames = [
  "--nc-notification-bg",
  "--nc-notification-border",
  "--nc-notification-title-text",
  "--nc-notification-description-text",
  "--nc-notification-body-text",
  "--nc-notification-icon-text",
  "--nc-notification-action-bg",
  "--nc-notification-action-bg-hover",
  "--nc-notification-action-text",
  "--nc-notification-close-text",
  "--nc-notification-focus-ring",
  "--nc-notification-radius",
  "--nc-notification-padding",
  "--nc-notification-gap"
] as const;

export type NcNotificationTokenName = (typeof ncNotificationTokenNames)[number];