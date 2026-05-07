export const ncFooterTokenNames = [
  "--nc-footer-bg",
  "--nc-footer-border",
  "--nc-footer-text",
  "--nc-footer-muted-text",
  "--nc-footer-link-text",
  "--nc-footer-link-text-hover",
  "--nc-footer-link-bg-hover",
  "--nc-footer-logo-bg",
  "--nc-footer-logo-text",
  "--nc-footer-focus-ring",
  "--nc-footer-radius",
  "--nc-footer-padding",
  "--nc-footer-gap",
  "--nc-footer-max-width"
] as const;

export type NcFooterTokenName = (typeof ncFooterTokenNames)[number];