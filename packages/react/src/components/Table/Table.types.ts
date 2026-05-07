import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTableVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTableAlign = "left" | "center" | "right";
export type NcTableSortDirection = "asc" | "desc";

export type TableRow = Record<string, unknown>;

export interface TableColumn {
  key: string;
  header: ReactNode;
  accessor?: string | ((row: TableRow, index: number) => ReactNode);
  render?: (row: TableRow, index: number) => ReactNode;
  align?: NcTableAlign;
  width?: number | string;
  sortable?: boolean;
  className?: string;
}

export interface TableSortState {
  key: string;
  direction: NcTableSortDirection;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "rows" | "size"> {
  columns: TableColumn[];
  rows: TableRow[];
  caption?: ReactNode;
  emptyMessage?: ReactNode;
  getRowId?: (row: TableRow, index: number) => string | number;
  sort?: TableSortState;
  defaultSort?: TableSortState;
  onSortChange?: (sort: TableSortState) => void;
  variant?: NcTableVariant;
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
