import { ApiTable } from "@/components/api-table";
import type { RemovedItem } from "@/lib/removed-in-v5";

export function RemovedInV5Table({ items }: { items: RemovedItem[] }) {
  return (
    <ApiTable
      columns={[
        { key: "name", label: "Deprecated in 4.5.0" },
        { key: "action", label: "What to do" },
      ]}
      rows={items.map((item) => ({
        id: item.id,
        name: item.name,
        action: item.action,
      }))}
      rowKey="id"
    />
  );
}
