import { ApiTable } from "@/components/api-table";
import type { RenamedRow } from "@/lib/renamed-options";

export function RenamedOptionsTable({ rows }: { rows: RenamedRow[] }) {
  return (
    <ApiTable
      columns={[
        { key: "from", label: "Old name" },
        { key: "to", label: "New name", mono: true },
        { key: "note", label: "Note" },
      ]}
      rows={rows.map((row) => ({
        id: row.from,
        from: <code>{row.from}</code>,
        to: <code>{row.to}</code>,
        note: row.note,
      }))}
      rowKey="id"
    />
  );
}
