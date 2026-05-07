export const ncFloatLabelTokenNames = [
  "--nc-float-label-bg",
  "--nc-float-label-border",
  "--nc-float-label-text",
  "--nc-float-label-muted-text",
  "--nc-float-label-control-bg",
  "--nc-float-label-control-bg-hover",
  "--nc-float-label-label-bg",
  "--nc-float-label-label-text",
  "--nc-float-label-label-active-text",
  "--nc-float-label-required-text",
  "--nc-float-label-focus-ring",
  "--nc-float-label-radius",
  "--nc-float-label-padding-x",
  "--nc-float-label-height",
  "--nc-float-label-offset"
] as const;

export type NcFloatLabelTokenName = (typeof ncFloatLabelTokenNames)[number];