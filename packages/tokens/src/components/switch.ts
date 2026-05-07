export const ncSwitchTokenNames = [
  "--nc-switch-bg",
  "--nc-switch-border",
  "--nc-switch-text",
  "--nc-switch-muted-text",
  "--nc-switch-track-bg",
  "--nc-switch-track-bg-checked",
  "--nc-switch-track-border",
  "--nc-switch-track-border-checked",
  "--nc-switch-track-label",
  "--nc-switch-thumb-bg",
  "--nc-switch-thumb-text",
  "--nc-switch-focus-ring",
  "--nc-switch-radius",
  "--nc-switch-gap",
  "--nc-switch-track-width",
  "--nc-switch-track-height",
  "--nc-switch-thumb-size"
] as const;

export type NcSwitchTokenName = (typeof ncSwitchTokenNames)[number];