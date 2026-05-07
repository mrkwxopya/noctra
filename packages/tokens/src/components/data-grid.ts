export const ncDataGridTokenNames = [
  "--nc-data-grid-bg",
  "--nc-data-grid-border",
  "--nc-data-grid-toolbar-bg",
  "--nc-data-grid-header-bg",
  "--nc-data-grid-header-text",
  "--nc-data-grid-row-bg-hover",
  "--nc-data-grid-row-bg-striped",
  "--nc-data-grid-row-bg-selected",
  "--nc-data-grid-cell-text",
  "--nc-data-grid-muted-text",
  "--nc-data-grid-sort-text",
  "--nc-data-grid-focus-ring",
  "--nc-data-grid-radius",
  "--nc-data-grid-cell-padding-x",
  "--nc-data-grid-cell-padding-y"
] as const;

export type NcDataGridTokenName = (typeof ncDataGridTokenNames)[number];