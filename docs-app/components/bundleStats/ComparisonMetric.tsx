export function ComparisonMetric({
  label,
  value,
  description,
  badge,
  badgeColor,
}: {
  label: string;
  value: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-foreground">{label}</span>
          {badge && (
            <span
              className={`px-2 py-0.5 text-xs font-bold rounded ${badgeColor} text-white`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-right sm:text-right">
        <span className="text-xl font-bold font-mono text-primary">
          {value}
        </span>
      </div>
    </div>
  );
}
