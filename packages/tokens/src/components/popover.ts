export const ncPopoverTokenNames = [
  "--nc-popover-bg",
  "--nc-popover-border",
  "--nc-popover-text",
  "--nc-popover-muted-text",
  "--nc-popover-trigger-bg",
  "--nc-popover-trigger-bg-hover",
  "--nc-popover-close-bg-hover",
  "--nc-popover-close-text",
  "--nc-popover-focus-ring",
  "--nc-popover-radius",
  "--nc-popover-padding",
  "--nc-popover-gap",
  "--nc-popover-width",
  "--nc-popover-offset",
  "--nc-popover-z-index"
] as const;

export type NcPopoverTokenName = (typeof ncPopoverTokenNames)[number];