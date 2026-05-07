export const ncScrollLockTokenNames = [
  "--nc-scroll-lock-bg",
  "--nc-scroll-lock-border",
  "--nc-scroll-lock-text",
  "--nc-scroll-lock-focus-ring",
  "--nc-scroll-lock-radius",
  "--nc-scroll-lock-padding"
] as const;

export type NcScrollLockTokenName = (typeof ncScrollLockTokenNames)[number];