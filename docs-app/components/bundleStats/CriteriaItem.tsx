import { Check, X } from "lucide-react";

interface CriteriaItemProps {
  passed: boolean;
  text: string;
}

export function CriteriaItem({ passed, text }: CriteriaItemProps) {
  const Icon = passed ? Check : X;
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          passed
            ? "bg-ok/15 text-ok"
            : "bg-destructive/15 text-destructive"
        }`}
      >
        <Icon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="text-sm text-foreground">{text}</span>
    </li>
  );
}
