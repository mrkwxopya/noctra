export const ncLinkTokenNames = [
  "--nc-link-bg",
  "--nc-link-border",
  "--nc-link-text",
  "--nc-link-text-hover",
  "--nc-link-text-active",
  "--nc-link-muted-text",
  "--nc-link-focus-ring",
  "--nc-link-radius",
  "--nc-link-gap",
  "--nc-link-padding-x",
  "--nc-link-height",
  "--nc-link-font-size"
] as const;

export type NcLinkTokenName = (typeof ncLinkTokenNames)[number];