export const ncClickOutsideTokenNames = [
  "--nc-click-outside-bg",
  "--nc-click-outside-border",
  "--nc-click-outside-text",
  "--nc-click-outside-focus-ring",
  "--nc-click-outside-radius",
  "--nc-click-outside-padding"
] as const;

export type NcClickOutsideTokenName = (typeof ncClickOutsideTokenNames)[number];