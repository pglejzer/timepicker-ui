import { Check, X } from "lucide-react";

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
  const Icon = passed ? Check : X;
  return (
    <div
      className={`rounded-lg border bg-muted/20 p-4 transition-colors ${
        passed ? "border-ok/40" : "border-destructive/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            passed
              ? "bg-ok text-ok-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{title}</h4>
            <span
              className={`nums text-[10px] font-semibold uppercase tracking-wider ${
                passed ? "text-ok" : "text-destructive"
              }`}
            >
              {passed ? "pass" : "fail"}
            </span>
          </div>
          <p className="mb-2 mt-1 text-xs text-muted-foreground">
            {description}
          </p>
          <p className="nums break-all text-xs text-foreground">{metric}</p>
        </div>
      </div>
    </div>
  );
}
