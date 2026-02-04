import { BundleResult, formatBytes } from "./types";

export function BundleCard({
  title,
  result,
}: {
  title: string;
  result: BundleResult;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all">
      <h2 className="text-lg font-bold mb-4 text-primary">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-semibold text-xs uppercase">
                File
              </th>
              <th className="text-right py-2 text-muted-foreground font-semibold text-xs uppercase">
                Raw
              </th>
              <th className="text-right py-2 text-muted-foreground font-semibold text-xs uppercase">
                Gzip
              </th>
              <th className="text-right py-2 text-muted-foreground font-semibold text-xs uppercase">
                Brotli
              </th>
            </tr>
          </thead>
          <tbody>
            {result.files.map((file, idx) => (
              <tr
                key={idx}
                className="border-t border-border hover:bg-accent transition-colors"
              >
                <td className="py-2 font-mono text-xs text-foreground">
                  {file.displayName || file.name}
                </td>
                <td className="py-2 text-right font-mono text-xs text-muted-foreground">
                  {formatBytes(file.raw)}
                </td>
                <td className="py-2 text-right font-mono text-xs text-primary font-semibold">
                  {formatBytes(file.gzip)}
                </td>
                <td className="py-2 text-right font-mono text-xs text-muted-foreground">
                  {formatBytes(file.brotli)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border font-bold">
              <td className="py-2 text-xs text-foreground">TOTAL</td>
              <td className="py-2 text-right font-mono text-xs text-muted-foreground">
                {formatBytes(result.total.raw)}
              </td>
              <td className="py-2 text-right font-mono text-xs text-primary">
                {formatBytes(result.total.gzip)}
              </td>
              <td className="py-2 text-right font-mono text-xs text-muted-foreground">
                {formatBytes(result.total.brotli)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
