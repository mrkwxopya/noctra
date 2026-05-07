export const ncTableTokenNames = [
  "--nc-table-bg",
  "--nc-table-border",
  "--nc-table-header-bg",
  "--nc-table-header-text",
  "--nc-table-row-bg-hover",
  "--nc-table-row-bg-striped",
  "--nc-table-cell-text",
  "--nc-table-caption-text",
  "--nc-table-empty-text",
  "--nc-table-sort-text",
  "--nc-table-focus-ring",
  "--nc-table-radius",
  "--nc-table-cell-padding-x",
  "--nc-table-cell-padding-y"
] as const;

export type NcTableTokenName = (typeof ncTableTokenNames)[number];