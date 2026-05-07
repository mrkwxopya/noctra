export const ncLoaderTokenNames = [
  "--nc-loader-bg",
  "--nc-loader-border",
  "--nc-loader-text",
  "--nc-loader-muted-text",
  "--nc-loader-indicator",
  "--nc-loader-track",
  "--nc-loader-focus-ring",
  "--nc-loader-radius",
  "--nc-loader-gap",
  "--nc-loader-size",
  "--nc-loader-stroke",
  "--nc-loader-duration"
] as const;

export type NcLoaderTokenName = (typeof ncLoaderTokenNames)[number];