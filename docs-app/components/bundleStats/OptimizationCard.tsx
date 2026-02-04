export function OptimizationCard({
  passed,
  title,
  description,
  metric,
}: {
  passed: boolean;
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        passed
          ? "bg-background border-green-600 dark:border-green-500"
          : "bg-background border-red-600 dark:border-red-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            passed
              ? "bg-green-600 dark:bg-green-500"
              : "bg-red-600 dark:bg-red-500"
          }`}
        >
          <span className="text-white font-bold text-lg">
            {passed ? "✓" : "✗"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
          <p className="text-xs font-mono text-primary break-all">{metric}</p>
        </div>
      </div>
    </div>
  );
}
