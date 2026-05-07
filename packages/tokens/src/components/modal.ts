export const ncModalTokenNames = [
  "--nc-modal-overlay-bg",
  "--nc-modal-bg",
  "--nc-modal-border",
  "--nc-modal-text",
  "--nc-modal-muted-text",
  "--nc-modal-header-bg",
  "--nc-modal-footer-bg",
  "--nc-modal-close-bg-hover",
  "--nc-modal-close-text",
  "--nc-modal-focus-ring",
  "--nc-modal-radius",
  "--nc-modal-padding",
  "--nc-modal-gap",
  "--nc-modal-width",
  "--nc-modal-max-height",
  "--nc-modal-z-index"
] as const;

export type NcModalTokenName = (typeof ncModalTokenNames)[number];