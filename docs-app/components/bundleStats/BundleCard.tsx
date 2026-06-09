import { BundleResult, formatBytes } from "./types";

export function BundleCard({
  title,
  result,
}: {
  title: string;
  result: BundleResult;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Variant</p>
          <h3 className="mt-1.5 font-medium text-foreground">{title}</h3>
        </div>
        <span className="nums text-xs text-muted-foreground/60">
          {result.files.length} files
        </span>
      </div>

      {/* Right-edge fade mask hints at horizontal scroll on small screens. */}
      <div className="relative">
        <div
          className="overflow-x-auto [mask-image:linear-gradient(to_right,#000_92%,transparent)] sm:[mask-image:none]"
        >
          <table className="w-full min-w-[20rem] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="eyebrow py-2 text-left">File</th>
                <th className="eyebrow py-2 text-right">Raw</th>
                <th className="eyebrow py-2 text-right">Gzip</th>
                <th className="eyebrow py-2 text-right">Brotli</th>
              </tr>
            </thead>
            <tbody>
              {result.files.map((file, idx) => (
                <tr
                  key={idx}
                  className="border-t border-border transition-colors hover:bg-muted/40"
                >
                  <td className="py-2 pr-3 font-mono text-xs text-foreground">
                    {file.displayName || file.name}
                  </td>
                  <td className="nums py-2 text-right text-xs text-muted-foreground">
                    {formatBytes(file.raw)}
                  </td>
                  <td className="nums py-2 text-right text-xs font-medium text-primary">
                    {formatBytes(file.gzip)}
                  </td>
                  <td className="nums py-2 text-right text-xs text-muted-foreground">
                    {formatBytes(file.brotli)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td className="py-2 pr-3 font-mono text-xs font-semibold text-foreground">
                  TOTAL
                </td>
                <td className="nums py-2 text-right text-xs font-semibold text-muted-foreground">
                  {formatBytes(result.total.raw)}
                </td>
                <td className="nums py-2 text-right text-xs font-semibold text-primary">
                  {formatBytes(result.total.gzip)}
                </td>
                <td className="nums py-2 text-right text-xs font-semibold text-muted-foreground">
                  {formatBytes(result.total.brotli)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
