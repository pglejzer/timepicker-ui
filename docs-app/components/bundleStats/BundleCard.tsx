import type { ReactNode } from "react";
import { ApiTable, type ApiColumn } from "@/components/api-table";
import { BundleResult, formatBytes } from "./types";
import styles from "./BundleCard.module.css";

const COLUMNS: ApiColumn[] = [
  { key: "file", label: "File" },
  { key: "raw", label: "Raw", mono: true },
  { key: "gzip", label: "Gzip", mono: true },
  { key: "brotli", label: "Brotli", mono: true },
];

export function BundleCard({ title, result }: { title: string; result: BundleResult }) {
  const rows: Array<Record<string, ReactNode>> = [
    ...result.files.map((file) => ({
      id: file.name,
      file: file.displayName || file.name,
      raw: formatBytes(file.raw),
      gzip: formatBytes(file.gzip),
      brotli: formatBytes(file.brotli),
    })),
    {
      id: "total",
      file: "TOTAL",
      raw: <strong>{formatBytes(result.total.raw)}</strong>,
      gzip: <strong>{formatBytes(result.total.gzip)}</strong>,
      brotli: <strong>{formatBytes(result.total.brotli)}</strong>,
    },
  ];

  return (
    <div className={styles.bundle}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{result.files.length} files</span>
      </div>
      <ApiTable columns={COLUMNS} rows={rows} rowKey="id" />
    </div>
  );
}
