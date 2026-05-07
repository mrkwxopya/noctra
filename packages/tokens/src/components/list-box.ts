export const ncListBoxTokenNames = [
  "--nc-list-box-bg",
  "--nc-list-box-border",
  "--nc-list-box-text",
  "--nc-list-box-muted-text",
  "--nc-list-box-control-bg",
  "--nc-list-box-control-bg-hover",
  "--nc-list-box-option-bg-hover",
  "--nc-list-box-option-bg-selected",
  "--nc-list-box-option-text-selected",
  "--nc-list-box-focus-ring",
  "--nc-list-box-radius",
  "--nc-list-box-gap",
  "--nc-list-box-max-height"
] as const;

export type NcListBoxTokenName = (typeof ncListBoxTokenNames)[number];