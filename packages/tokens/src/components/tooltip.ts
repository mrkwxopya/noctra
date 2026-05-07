export const ncTooltipTokenNames = [
  "--nc-tooltip-bg",
  "--nc-tooltip-border",
  "--nc-tooltip-text",
  "--nc-tooltip-muted-text",
  "--nc-tooltip-trigger-bg",
  "--nc-tooltip-trigger-bg-hover",
  "--nc-tooltip-focus-ring",
  "--nc-tooltip-radius",
  "--nc-tooltip-padding-x",
  "--nc-tooltip-padding-y",
  "--nc-tooltip-gap",
  "--nc-tooltip-width",
  "--nc-tooltip-offset",
  "--nc-tooltip-z-index"
] as const;

export type NcTooltipTokenName = (typeof ncTooltipTokenNames)[number];