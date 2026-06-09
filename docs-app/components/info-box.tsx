import { ReactNode } from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

interface InfoBoxProps {
  /** @deprecated kept for backwards-compat; icon is derived from `variant`. */
  emoji?: string;
  title?: string;
  children: ReactNode;
  variant?: "blue" | "emerald" | "purple" | "green" | "red" | "orange";
  className?: string;
}

type Tone = "info" | "success" | "warning" | "danger";

/**
 * Token-driven tones. Colors come from the design-system telemetry tokens
 * (`--info`/primary, `--ok`, `--warn`, `destructive`) so callouts stay legible
 * in both light and dark themes — no hardcoded palette values.
 */
const tones: Record<
  Tone,
  { accent: string; surface: string; icon: string; Icon: LucideIcon }
> = {
  info: {
    accent: "border-l-primary",
    surface: "bg-primary/[0.04]",
    icon: "text-primary",
    Icon: Info,
  },
  success: {
    accent: "border-l-[hsl(var(--ok))]",
    surface: "bg-[hsl(var(--ok)/0.05)]",
    icon: "text-[hsl(var(--ok))]",
    Icon: CheckCircle2,
  },
  warning: {
    accent: "border-l-[hsl(var(--warn))]",
    surface: "bg-[hsl(var(--warn)/0.05)]",
    icon: "text-[hsl(var(--warn))]",
    Icon: AlertTriangle,
  },
  danger: {
    accent: "border-l-destructive",
    surface: "bg-destructive/[0.05]",
    icon: "text-destructive",
    Icon: AlertCircle,
  },
};

const variantTone: Record<NonNullable<InfoBoxProps["variant"]>, Tone> = {
  blue: "info",
  purple: "info",
  emerald: "success",
  green: "success",
  orange: "warning",
  red: "danger",
};

export function InfoBox({
  title,
  children,
  variant = "blue",
  className,
}: InfoBoxProps) {
  const tone = tones[variantTone[variant]];
  const { Icon } = tone;

  return (
    <div
      className={`mt-10 rounded-lg border border-l-2 border-border ${tone.accent} ${tone.surface} p-5 md:p-6 ${className ?? ""}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.icon}`} />
        <div className="min-w-0">
          {title && (
            <p className="mb-1 font-medium text-foreground">{title}</p>
          )}
          <div className="text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
