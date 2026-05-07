export const ncScrollAreaTokenNames = [
  "--nc-scroll-area-bg",
  "--nc-scroll-area-border",
  "--nc-scroll-area-text",
  "--nc-scroll-area-muted-text",
  "--nc-scroll-area-scrollbar",
  "--nc-scroll-area-scrollbar-thumb",
  "--nc-scroll-area-scrollbar-thumb-hover",
  "--nc-scroll-area-focus-ring",
  "--nc-scroll-area-radius",
  "--nc-scroll-area-padding",
  "--nc-scroll-area-max-height",
  "--nc-scroll-area-max-width",
  "--nc-scroll-area-height",
  "--nc-scroll-area-width"
] as const;

export type NcScrollAreaTokenName = (typeof ncScrollAreaTokenNames)[number];