import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDataGridVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDataGridAlign = "left" | "center" | "right";
export type NcDataGridSortDirection = "asc" | "desc";

export type DataGridRow = Record<string, unknown>;
export type DataGridRowId = string | number;

export interface DataGridColumn {
  key: string;
  header: ReactNode;
  accessor?: string | ((row: DataGridRow, index: number) => ReactNode);
  render?: (row: DataGridRow, index: number) => ReactNode;
  align?: NcDataGridAlign;
  width?: number | string;
  minWidth?: number | string;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;
}

export interface DataGridSortState {
  key: string;
  direction: NcDataGridSortDirection;
}

export interface DataGridProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "rows" | "size" | "title"> {
  columns: DataGridColumn[];
  rows: DataGridRow[];
  title?: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  emptyMessage?: ReactNode;
  getRowId?: (row: DataGridRow, index: number) => DataGridRowId;
  sort?: DataGridSortState;
  defaultSort?: DataGridSortState;
  onSortChange?: (sort: DataGridSortState) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  selectable?: boolean;
  selectedRowIds?: DataGridRowId[];
  defaultSelectedRowIds?: DataGridRowId[];
  onSelectedRowIdsChange?: (rowIds: DataGridRowId[]) => void;
  variant?: NcDataGridVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  striped?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  stickyHeader?: boolean;
  highlightOnHover?: boolean;
}
