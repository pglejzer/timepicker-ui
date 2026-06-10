import { formatBytes } from "./types";

export interface CompositionSegment {
  label: string;
  bytes: number;
  /** Semantic fill, resolved to a theme token. */
  tone: "primary" | "info" | "ok" | "muted";
}

const TONE_BG: Record<CompositionSegment["tone"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  ok: "bg-ok",
  muted: "bg-muted-foreground/40",
};

const TONE_DOT: Record<CompositionSegment["tone"], string> = {
  primary: "bg-primary",
  info: "bg-info",
  ok: "bg-ok",
  muted: "bg-muted-foreground/50",
};

const TONE_TEXT: Record<CompositionSegment["tone"], string> = {
  primary: "text-primary-foreground",
  info: "text-info-foreground",
  ok: "text-ok-foreground",
  muted: "text-foreground",
};

/**
 * "Measuring-tape" composition bar: a single segmented horizontal bar whose
 * segments sum to `total`, overlaid with a hairline ruler that echoes the
 * site's `.tick-row`. Pure CSS/flex - no chart library. Accessible via
 * role="img" + a visually-hidden data table.
 */
export function CompositionBar({
  segments,
  total,
}: {
  segments: CompositionSegment[];
  total: number;
}) {
  const sum = segments.reduce((acc, s) => acc + s.bytes, 0);
  const denominator = total > 0 ? total : sum || 1;

  const ariaLabel = `Full bundle composition, ${formatBytes(denominator)} total: ${segments
    .map(
      (s) =>
        `${s.label} ${formatBytes(s.bytes)} (${((s.bytes / denominator) * 100).toFixed(0)}%)`,
    )
    .join(", ")}.`;

  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="tape-bar">
        {segments.map((seg, i) => {
          const pct = (seg.bytes / denominator) * 100;
          return (
            <div
              key={seg.label}
              className={`tape-seg ${TONE_BG[seg.tone]}`}
              style={{
                width: `${pct}%`,
                animationDelay: `${i * 90}ms`,
              }}
              aria-hidden="true"
            >
              <span
                className={`nums truncate text-[11px] font-medium ${TONE_TEXT[seg.tone]}`}
              >
                {pct >= 12 ? `${pct.toFixed(0)}%` : ""}
              </span>
            </div>
          );
        })}
        {/* Ruler overlays - the measuring-tape motif. */}
        <span className="tape-ruler" aria-hidden="true" />
        <span className="tape-ruler-major" aria-hidden="true" />
      </div>

      {/* Legend / readout */}
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {segments.map((seg) => {
          const pct = (seg.bytes / denominator) * 100;
          return (
            <div
              key={seg.label}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5"
            >
              <span
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-[2px] ${TONE_DOT[seg.tone]}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="truncate text-xs text-muted-foreground">
                  {seg.label}
                </dt>
                <dd className="nums mt-0.5 text-sm font-medium text-foreground">
                  {formatBytes(seg.bytes)}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {pct.toFixed(0)}%
                  </span>
                </dd>
              </div>
            </div>
          );
        })}
      </dl>

      {/* Visually-hidden table mirror for assistive tech / no-CSS. */}
      <table className="sr-only">
        <caption>Full bundle composition (gzipped)</caption>
        <thead>
          <tr>
            <th>Segment</th>
            <th>Size</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.label}>
              <td>{seg.label}</td>
              <td>{formatBytes(seg.bytes)}</td>
              <td>{((seg.bytes / denominator) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

