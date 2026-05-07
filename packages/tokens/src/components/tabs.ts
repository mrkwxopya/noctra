export const ncTabsTokenNames = [
  "--nc-tabs-bg",
  "--nc-tabs-border",
  "--nc-tabs-text",
  "--nc-tabs-muted-text",
  "--nc-tabs-list-bg",
  "--nc-tabs-tab-bg",
  "--nc-tabs-tab-bg-hover",
  "--nc-tabs-tab-bg-active",
  "--nc-tabs-tab-text-active",
  "--nc-tabs-tab-indicator",
  "--nc-tabs-tab-badge-bg",
  "--nc-tabs-tab-badge-text",
  "--nc-tabs-panel-bg",
  "--nc-tabs-focus-ring",
  "--nc-tabs-radius",
  "--nc-tabs-padding",
  "--nc-tabs-gap",
  "--nc-tabs-tab-height"
] as const;

export type NcTabsTokenName = (typeof ncTabsTokenNames)[number];