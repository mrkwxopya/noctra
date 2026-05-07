import type { ReactNode } from "react";

export interface DocsTableColumn<T> {
  key: keyof T;
  label: string;
}

export interface DocsTableProps<T> {
  columns: Array<DocsTableColumn<T>>;
  rows: readonly T[];
}

export function DocsTable<T extends Record<string, ReactNode>>(props: DocsTableProps<T>) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {props.columns.map((column) => (
                <td key={String(column.key)}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}