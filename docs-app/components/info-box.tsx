import { ReactNode } from "react";

interface InfoBoxProps {
  emoji?: string;
  title?: string;
  children: ReactNode;
  variant?: "blue" | "emerald" | "purple" | "green" | "red" | "orange";
  className?: string;
}

const variantStyles = {
  blue: {
    container: "from-blue-500/5 to-cyan-500/5",
    icon: "bg-blue-500/10",
  },
  emerald: {
    container: "from-emerald-500/5 to-green-500/5",
    icon: "bg-emerald-500/10",
  },
  purple: {
    container: "from-purple-500/5 to-pink-500/5",
    icon: "bg-purple-500/10",
  },
  green: {
    container: "from-green-500/5 to-blue-500/5",
    icon: "bg-green-500/10",
  },
  red: {
    container: "from-red-500/5 to-orange-500/5",
    icon: "bg-red-500/10",
  },
  orange: {
    container: "from-orange-500/5 to-yellow-500/5",
    icon: "bg-orange-500/10",
  },
};

export function InfoBox({
  emoji = "💡",
  title,
  children,
  variant = "emerald",
  className,
}: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`mt-12 rounded-xl border border-primary/20 bg-gradient-to-br ${styles.container} p-6 md:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <span className="text-xl">{emoji}</span>
        </div>
        <div>
          {title && (
            <p className="font-medium mb-1 md:mb-2 text-foreground">{title}</p>
          )}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
