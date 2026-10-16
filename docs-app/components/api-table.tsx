import type { ReactNode } from "react";
import styles from "./api-table.module.css";

export type ApiColumn = { key: string; label: string; mono?: boolean };

type ApiTableProps = {
  columns: ApiColumn[];
  rows: Array<Record<string, ReactNode>>;
  rowKey: string;
  caption?: ReactNode;
};

function keyOf(row: Record<string, ReactNode>, rowKey: string, index: number): string {
  const value = row[rowKey];
  return typeof value === "string" || typeof value === "number" ? String(value) : String(index);
}

export function ApiTable({ columns, rows, rowKey, caption }: ApiTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table} role="table">
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((column) => (
              <th key={column.key} scope="col" role="columnheader">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, index) => (
            <tr key={keyOf(row, rowKey, index)} role="row">
              {columns.map((column, columnIndex) => {
                let className: string | undefined;
                if (columnIndex === 0) className = styles.first;
                else if (column.mono) className = styles.mono;
                return (
                  <td key={column.key} role="cell" data-label={column.label} className={className}>
                    {row[column.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
