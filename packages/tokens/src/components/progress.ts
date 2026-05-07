export const ncProgressTokenNames = [
  "--nc-progress-bg",
  "--nc-progress-border",
  "--nc-progress-text",
  "--nc-progress-muted-text",
  "--nc-progress-track-bg",
  "--nc-progress-bar-bg",
  "--nc-progress-bar-text",
  "--nc-progress-focus-ring",
  "--nc-progress-radius",
  "--nc-progress-height",
  "--nc-progress-circle-size",
  "--nc-progress-circle-stroke"
] as const;

export type NcProgressTokenName = (typeof ncProgressTokenNames)[number];