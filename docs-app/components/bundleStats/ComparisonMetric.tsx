export type BadgeVariant = "ok" | "info" | "warn" | "neutral";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  ok: "bg-ok text-ok-foreground",
  info: "bg-info text-info-foreground",
  warn: "bg-warn text-warn-foreground",
  neutral: "bg-muted text-muted-foreground border border-border",
};

/** Optional ranked bar fill, expressed as a fraction (0–1) of the row width. */
export function ComparisonMetric({
  label,
  value,
  description,
  badge,
  badgeColor = "neutral",
  fraction,
}: {
  label: string;
  value: string;
  description: string;
  badge?: string;
  badgeColor?: BadgeVariant;
  fraction?: number;
}) {
  const pct =
    typeof fraction === "number"
      ? Math.max(2, Math.min(100, fraction * 100))
      : null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
      {pct !== null && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 bg-primary/[0.07]"
          style={{ width: `${pct}%` }}
        />
      )}
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{label}</span>
            {badge && (
              <span
                className={`nums rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${BADGE_STYLES[badgeColor]}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="nums text-xl font-semibold text-foreground">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
