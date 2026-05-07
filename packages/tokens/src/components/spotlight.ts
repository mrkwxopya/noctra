export const ncSpotlightTokenNames = [
  "--nc-spotlight-overlay-bg",
  "--nc-spotlight-bg",
  "--nc-spotlight-border",
  "--nc-spotlight-title-text",
  "--nc-spotlight-description-text",
  "--nc-spotlight-search-bg",
  "--nc-spotlight-search-border",
  "--nc-spotlight-search-text",
  "--nc-spotlight-action-bg-hover",
  "--nc-spotlight-action-bg-active",
  "--nc-spotlight-action-text",
  "--nc-spotlight-action-description-text",
  "--nc-spotlight-icon-text",
  "--nc-spotlight-shortcut-bg",
  "--nc-spotlight-shortcut-text",
  "--nc-spotlight-focus-ring",
  "--nc-spotlight-radius",
  "--nc-spotlight-width"
] as const;

export type NcSpotlightTokenName = (typeof ncSpotlightTokenNames)[number];