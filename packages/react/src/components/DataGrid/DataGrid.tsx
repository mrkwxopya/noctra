import { forwardRef, useMemo, useState } from "react";
import type { CSSProperties, ChangeEvent, MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DataGridColumn, DataGridProps, DataGridRow, DataGridRowId, DataGridSortState, NcDataGridSortDirection } from "./DataGrid.types";

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

function getRowIdValue(row: DataGridRow, index: number, getRowId?: (row: DataGridRow, index: number) => DataGridRowId): DataGridRowId {
  if (getRowId) return getRowId(row, index);
  const candidate = row.id;
  return typeof candidate === "string" || typeof candidate === "number" ? candidate : index;
}

function getCellValue(row: DataGridRow, column: DataGridColumn, index: number): ReactNode {
  if (column.render) return column.render(row, index);
  if (typeof column.accessor === "function") return column.accessor(row, index);
  if (typeof column.accessor === "string") return toReactNode(row[column.accessor]);
  return toReactNode(row[column.key]);
}

function getSearchPrimitive(row: DataGridRow, column: DataGridColumn, index: number): string {
  const value = typeof column.accessor === "string" ? row[column.accessor] : row[column.key];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).toLowerCase();
  const rendered = getCellValue(row, column, index);
  if (typeof rendered === "string" || typeof rendered === "number" || typeof rendered === "boolean") return String(rendered).toLowerCase();
  return "";
}

function getSortablePrimitive(row: DataGridRow, column: DataGridColumn, index: number): string | number {
  const value = typeof column.accessor === "string" ? row[column.accessor] : row[column.key];

  if (typeof value === "number") return value;
  if (typeof value === "string") return value.toLowerCase();

  const rendered = getCellValue(row, column, index);

  if (typeof rendered === "number") return rendered;
  if (typeof rendered === "string") return rendered.toLowerCase();

  return "";
}

function getNextDirection(current?: DataGridSortState, key?: string): NcDataGridSortDirection {
  if (!current || current.key !== key) return "asc";
  return current.direction === "asc" ? "desc" : "asc";
}

const sortIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.47 7.53a.75.75 0 0 0 1.06 0L10 5.06l2.47 2.47a.75.75 0 1 0 1.06-1.06l-3-3a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06ZM13.53 12.47a.75.75 0 0 0-1.06 0L10 14.94l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0 0-1.06Z" />
  </svg>
);

export const DataGrid = forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  props,
  ref
): ReactElement {
  const {
    className,
    columns,
    rows,
    title,
    description,
    caption,
    emptyMessage = "No records found",
    getRowId,
    sort,
    defaultSort,
    onSortChange,
    searchValue,
    defaultSearchValue = "",
    onSearchChange,
    searchPlaceholder = "Search records",
    selectable = false,
    selectedRowIds,
    defaultSelectedRowIds = [],
    onSelectedRowIdsChange,
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

  const sortControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<DataGridSortState | undefined>(defaultSort);
  const sortState = sortControlled ? sort : internalSort;

  const searchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const query = searchControlled ? searchValue : internalSearch;

  const selectionControlled = selectedRowIds !== undefined;
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<DataGridRowId[]>(defaultSelectedRowIds);
  const currentSelectedRowIds = selectionControlled ? selectedRowIds : internalSelectedRowIds;

  const searchableColumns = columns.filter((column) => column.searchable !== false);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return rows;

    return rows.filter((row, index) =>
      searchableColumns.some((column) => getSearchPrimitive(row, column, index).includes(normalizedQuery))
    );
  }, [normalizedQuery, rows, searchableColumns]);

  const sortedRows = useMemo(() => {
    if (!sortState) return filteredRows;

    const column = columns.find((item) => item.key === sortState.key);
    if (!column) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = getSortablePrimitive(a, column, rows.indexOf(a));
      const bValue = getSortablePrimitive(b, column, rows.indexOf(b));

      if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [columns, filteredRows, rows, sortState]);

  const visibleRowIds = sortedRows.map((row, index) => getRowIdValue(row, index, getRowId));
  const selectedSet = new Set(currentSelectedRowIds);
  const allVisibleSelected = visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = visibleRowIds.some((id) => selectedSet.has(id));

  function commitSort(column: DataGridColumn): void {
    if (!column.sortable) return;

    const nextSort: DataGridSortState = {
      key: column.key,
      direction: getNextDirection(sortState, column.key)
    };

    if (!sortControlled) {
      setInternalSort(nextSort);
    }

    onSortChange?.(nextSort);
  }

  function commitSearch(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.currentTarget.value;

    if (!searchControlled) {
      setInternalSearch(nextValue);
    }

    onSearchChange?.(nextValue);
  }

  function commitSelection(nextIds: DataGridRowId[]): void {
    if (!selectionControlled) {
      setInternalSelectedRowIds(nextIds);
    }

    onSelectedRowIdsChange?.(nextIds);
  }

  function toggleRow(id: DataGridRowId): void {
    const next = new Set(currentSelectedRowIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    commitSelection(Array.from(next));
  }

  function toggleAllVisible(): void {
    const next = new Set(currentSelectedRowIds);

    if (allVisibleSelected) {
      visibleRowIds.forEach((id) => next.delete(id));
    } else {
      visibleRowIds.forEach((id) => next.add(id));
    }

    commitSelection(Array.from(next));
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-data-grid-root", className)}
      data-striped={striped || undefined}
      data-border={withBorder || undefined}
      data-column-borders={withColumnBorders || undefined}
      data-sticky-header={stickyHeader || undefined}
      data-highlight-on-hover={highlightOnHover || undefined}
      data-selectable={selectable || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: sortedRows.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      {title || description || onSearchChange || searchValue !== undefined || defaultSearchValue ? (
        <div className="nc-data-grid__toolbar" {...ncSlot("toolbar")}>
          {title || description ? (
            <div className="nc-data-grid__heading">
              {title ? (
                <div className="nc-data-grid__title" {...ncSlot("title")}>
                  {title}
                </div>
              ) : null}

              {description ? (
                <div className="nc-data-grid__description" {...ncSlot("description")}>
                  {description}
                </div>
              ) : null}
            </div>
          ) : null}

          <input
            className="nc-data-grid__search"
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            onChange={commitSearch}
            {...ncSlot("search")}
          />
        </div>
      ) : null}

      <div className="nc-data-grid__table-wrap" {...ncSlot("table-wrap")}>
        <table className="nc-data-grid__table" {...ncSlot("table")}>
          {caption ? (
            <caption className="nc-data-grid__caption" {...ncSlot("caption")}>
              {caption}
            </caption>
          ) : null}

          <thead className="nc-data-grid__head" {...ncSlot("head")}>
            <tr className="nc-data-grid__header-row" {...ncSlot("header-row")}>
              {selectable ? (
                <th className="nc-data-grid__select-cell" scope="col" {...ncSlot("select-cell")}>
                  <input
                    className="nc-data-grid__checkbox"
                    type="checkbox"
                    checked={allVisibleSelected}
                    aria-checked={someVisibleSelected && !allVisibleSelected ? "mixed" : allVisibleSelected}
                    aria-label="Select all rows"
                    onChange={toggleAllVisible}
                    {...ncSlot("checkbox")}
                  />
                </th>
              ) : null}

              {columns.map((column) => {
                const activeSort = sortState?.key === column.key;
                const style = {
                  width: column.width,
                  minWidth: column.minWidth
                } as CSSProperties;

                return (
                  <th
                    key={column.key}
                    className={cx("nc-data-grid__header-cell", column.className)}
                    data-align={column.align ?? "left"}
                    aria-sort={activeSort ? (sortState?.direction === "asc" ? "ascending" : "descending") : undefined}
                    style={style}
                    scope="col"
                    {...ncSlot("header-cell")}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="nc-data-grid__sort-button"
                        data-active={activeSort || undefined}
                        data-direction={activeSort ? sortState?.direction : undefined}
                        onClick={() => commitSort(column)}
                        {...ncSlot("sort-button")}
                      >
                        <span>{column.header}</span>
                        <span className="nc-data-grid__sort-icon" aria-hidden="true" {...ncSlot("sort-icon")}>
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

          <tbody className="nc-data-grid__body" {...ncSlot("body")}>
            {sortedRows.length > 0 ? (
              sortedRows.map((row, rowIndex) => {
                const rowId = getRowIdValue(row, rowIndex, getRowId);
                const selected = selectedSet.has(rowId);

                return (
                  <tr key={String(rowId)} className="nc-data-grid__row" data-selected={selected || undefined} {...ncSlot("row")}>
                    {selectable ? (
                      <td className="nc-data-grid__select-cell" {...ncSlot("select-cell")}>
                        <input
                          className="nc-data-grid__checkbox"
                          type="checkbox"
                          checked={selected}
                          aria-label={`Select row ${rowIndex + 1}`}
                          onChange={() => toggleRow(rowId)}
                          {...ncSlot("checkbox")}
                        />
                      </td>
                    ) : null}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cx("nc-data-grid__cell", column.className)}
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
              <tr className="nc-data-grid__row nc-data-grid__row--empty" {...ncSlot("row")}>
                <td className="nc-data-grid__empty" colSpan={Math.max(columns.length + (selectable ? 1 : 0), 1)} {...ncSlot("empty")}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="nc-data-grid__footer" {...ncSlot("footer")}>
        <span>{sortedRows.length} of {rows.length} rows</span>
        {selectable ? <span>{currentSelectedRowIds.length} selected</span> : null}
      </div>
    </div>
  );
});