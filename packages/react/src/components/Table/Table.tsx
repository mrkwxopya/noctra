import { forwardRef, useMemo, useState } from "react";
import type { CSSProperties, MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcTableSortDirection, TableColumn, TableProps, TableRow, TableSortState } from "./Table.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function toReactNode(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((item) => toReactNode(item));
  return String(value);
}

function getCellValue(row: TableRow, column: TableColumn, index: number): ReactNode {
  if (column.render) return column.render(row, index);
  if (typeof column.accessor === "function") return column.accessor(row, index);
  if (typeof column.accessor === "string") return toReactNode(row[column.accessor]);
  return toReactNode(row[column.key]);
}

function getSortablePrimitive(row: TableRow, column: TableColumn, index: number): string | number {
  const accessor = column.accessor;
  const value = typeof accessor === "string" ? row[accessor] : row[column.key];

  if (typeof value === "number") return value;
  if (typeof value === "string") return value.toLowerCase();

  const rendered = getCellValue(row, column, index);

  if (typeof rendered === "number") return rendered;
  if (typeof rendered === "string") return rendered.toLowerCase();

  return "";
}

function getNextDirection(current?: TableSortState, key?: string): NcTableSortDirection {
  if (!current || current.key !== key) return "asc";
  return current.direction === "asc" ? "desc" : "asc";
}

const sortIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.47 7.53a.75.75 0 0 0 1.06 0L10 5.06l2.47 2.47a.75.75 0 1 0 1.06-1.06l-3-3a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06ZM13.53 12.47a.75.75 0 0 0-1.06 0L10 14.94l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0 0-1.06Z" />
  </svg>
);

export const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  props,
  ref
): ReactElement {
  const {
    className,
    columns,
    rows,
    caption,
    emptyMessage = "No records found",
    getRowId,
    sort,
    defaultSort,
    onSortChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    striped = false,
    withBorder = true,
    withColumnBorders = false,
    stickyHeader = false,
    highlightOnHover = true,
    ...rest
  } = props;

  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<TableSortState | undefined>(defaultSort);
  const sortState = isControlled ? sort : internalSort;

  function commitSort(column: TableColumn): void {
    if (!column.sortable) return;

    const nextSort: TableSortState = {
      key: column.key,
      direction: getNextDirection(sortState, column.key)
    };

    if (!isControlled) {
      setInternalSort(nextSort);
    }

    onSortChange?.(nextSort);
  }

  const sortedRows = useMemo(() => {
    if (!sortState) return rows;

    const column = columns.find((item) => item.key === sortState.key);
    if (!column) return rows;

    return [...rows].sort((a, b) => {
      const aValue = getSortablePrimitive(a, column, rows.indexOf(a));
      const bValue = getSortablePrimitive(b, column, rows.indexOf(b));

      if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [columns, rows, sortState]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-table-root", className)}
      data-striped={striped || undefined}
      data-border={withBorder || undefined}
      data-column-borders={withColumnBorders || undefined}
      data-sticky-header={stickyHeader || undefined}
      data-highlight-on-hover={highlightOnHover || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: rows.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      <div className="nc-table__scroll">
        <table className="nc-table" {...ncSlot("table")}>
          {caption ? (
            <caption className="nc-table__caption" {...ncSlot("caption")}>
              {caption}
            </caption>
          ) : null}

          <thead className="nc-table__head" {...ncSlot("head")}>
            <tr className="nc-table__header-row" {...ncSlot("header-row")}>
              {columns.map((column) => {
                const activeSort = sortState?.key === column.key;
                const style = column.width !== undefined ? ({ width: column.width } as CSSProperties) : undefined;

                return (
                  <th
                    key={column.key}
                    className={cx("nc-table__header-cell", column.className)}
                    data-align={column.align ?? "left"}
                    aria-sort={activeSort ? (sortState?.direction === "asc" ? "ascending" : "descending") : undefined}
                    style={style}
                    scope="col"
                    {...ncSlot("header-cell")}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="nc-table__sort-button"
                        data-active={activeSort || undefined}
                        data-direction={activeSort ? sortState?.direction : undefined}
                        onClick={() => commitSort(column)}
                        {...ncSlot("sort-button")}
                      >
                        <span>{column.header}</span>
                        <span className="nc-table__sort-icon" aria-hidden="true" {...ncSlot("sort-icon")}>
                          {sortIcon}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="nc-table__body" {...ncSlot("body")}>
            {sortedRows.length > 0 ? (
              sortedRows.map((row, rowIndex) => {
                const key = getRowId?.(row, rowIndex) ?? row.id ?? rowIndex;

                return (
                  <tr key={String(key)} className="nc-table__row" {...ncSlot("row")}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cx("nc-table__cell", column.className)}
                        data-align={column.align ?? "left"}
                        {...ncSlot("cell")}
                      >
                        {getCellValue(row, column, rowIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr className="nc-table__row nc-table__row--empty" {...ncSlot("row")}>
                <td className="nc-table__empty" colSpan={Math.max(columns.length, 1)} {...ncSlot("empty")}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});