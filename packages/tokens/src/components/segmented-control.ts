export const ncSegmentedControlTokenNames = [
  "--nc-segmented-control-bg",
  "--nc-segmented-control-border",
  "--nc-segmented-control-indicator-bg",
  "--nc-segmented-control-indicator-shadow",
  "--nc-segmented-control-item-text",
  "--nc-segmented-control-item-text-selected",
  "--nc-segmented-control-item-bg-hover",
  "--nc-segmented-control-focus-ring",
  "--nc-segmented-control-radius",
  "--nc-segmented-control-padding",
  "--nc-segmented-control-height",
  "--nc-segmented-control-label-text",
  "--nc-segmented-control-description-text",
  "--nc-segmented-control-error-text"
] as const;

export type NcSegmentedControlTokenName = (typeof ncSegmentedControlTokenNames)[number];