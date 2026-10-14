import type { RemovedItem } from "@/lib/removed-in-v5";

export function RemovedInV5Table({ items }: { items: RemovedItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm leading-relaxed text-muted-foreground">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-semibold text-foreground">
              Deprecated in 4.5.0
            </th>
            <th className="text-left py-2 px-4 font-semibold text-foreground">
              What to do
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="py-2 pr-4 align-top">{item.name}</td>
              <td className="py-2 px-4 align-top">{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
