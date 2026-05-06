import type { ReactNode } from "react";
import "./Table.scss";

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type TableProps<T extends Record<string, unknown>> = {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: keyof T;
  emptyLabel?: string;
};

export default function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  emptyLabel = "No data available.",
}: TableProps<T>) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} style={{ textAlign: column.align ?? "left" }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="table__empty" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row[rowKey])}>
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={String(column.key)} style={{ textAlign: column.align ?? "left" }}>
                      {column.render ? column.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
