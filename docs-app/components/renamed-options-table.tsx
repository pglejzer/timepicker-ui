import type { RenamedRow } from "@/lib/renamed-options";

export function RenamedOptionsTable({ rows }: { rows: RenamedRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Old name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              New name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Note
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.from} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-muted-foreground">
                <code className="text-xs">{row.from}</code>
              </td>
              <td className="px-4 py-3">
                <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                  {row.to}
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
