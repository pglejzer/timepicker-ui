import { Fragment, type ReactNode } from "react";
import { ApiTable } from "@/components/api-table";

export type OptionRow = {
  name: string;
  type: string;
  default: string;
  description: string;
};

export type LabelRow = {
  name: string;
  default: string;
  usedFor: string;
};

export function withCode(text: string): ReactNode {
  return text.split("`").map((part, index) =>
    index % 2 === 1 ? <code key={index}>{part}</code> : <Fragment key={index}>{part}</Fragment>,
  );
}

export function OptionTable({ rows, caption }: { rows: OptionRow[]; caption?: string }) {
  return (
    <ApiTable
      caption={caption}
      columns={[
        { key: "name", label: "Option" },
        { key: "type", label: "Type", mono: true },
        { key: "default", label: "Default", mono: true },
        { key: "description", label: "Description" },
      ]}
      rows={rows.map((row) => ({
        id: row.name,
        name: <code>{row.name}</code>,
        type: <code>{row.type}</code>,
        default: <code>{row.default}</code>,
        description: withCode(row.description),
      }))}
      rowKey="id"
    />
  );
}

export function LabelTable({ rows, caption }: { rows: LabelRow[]; caption?: string }) {
  return (
    <ApiTable
      caption={caption}
      columns={[
        { key: "name", label: "Option" },
        { key: "default", label: "Default", mono: true },
        { key: "usedFor", label: "Used for" },
      ]}
      rows={rows.map((row) => ({
        id: row.name,
        name: <code>{row.name}</code>,
        default: <code>{row.default}</code>,
        usedFor: withCode(row.usedFor),
      }))}
      rowKey="id"
    />
  );
}
