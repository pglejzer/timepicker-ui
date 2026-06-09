import { ReactNode } from "react";

interface SectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  /** Optional muted lead rendered under the title. */
  description?: ReactNode;
  /** Optional mono eyebrow above the title. */
  eyebrow?: string;
  children: React.ReactNode;
}

export function Section({
  icon: Icon,
  title,
  description,
  eyebrow,
  children,
}: SectionProps) {
  return (
    <section className="mb-12 scroll-mt-24">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="display text-xl font-semibold text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
        </div>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
        <div className="mt-4 h-px w-full bg-border" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}
