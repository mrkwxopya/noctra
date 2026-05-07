export const ncEmptyStateTokenNames = [
  "--nc-empty-state-bg",
  "--nc-empty-state-border",
  "--nc-empty-state-text",
  "--nc-empty-state-muted-text",
  "--nc-empty-state-icon-bg",
  "--nc-empty-state-icon-text",
  "--nc-empty-state-action-bg",
  "--nc-empty-state-action-text",
  "--nc-empty-state-secondary-bg",
  "--nc-empty-state-secondary-text",
  "--nc-empty-state-focus-ring",
  "--nc-empty-state-radius",
  "--nc-empty-state-gap",
  "--nc-empty-state-padding",
  "--nc-empty-state-icon-size"
] as const;

export type NcEmptyStateTokenName = (typeof ncEmptyStateTokenNames)[number];