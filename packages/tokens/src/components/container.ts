export const ncContainerTokenNames = [
  "--nc-container-bg",
  "--nc-container-border",
  "--nc-container-text",
  "--nc-container-radius",
  "--nc-container-padding-x",
  "--nc-container-padding-y",
  "--nc-container-width",
  "--nc-container-max-width",
  "--nc-container-min-height"
] as const;

export type NcContainerTokenName = (typeof ncContainerTokenNames)[number];