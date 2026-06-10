import { ReactNode } from "react";

interface PageHeaderProps {
  /** The single page-level heading. Renders as the only <h1> on the page. */
  title: string;
  /** Lead paragraph(s). May contain inline markup (code, links). */
  description?: ReactNode;
  /** Short mono kicker above the title, e.g. "Guide", "Example · Themes". */
  eyebrow?: string;
  /** Optional pill/badge rendered next to the eyebrow row. */
  badge?: ReactNode;
  /** Optional secondary line of metadata under the lead (e.g. mono stats). */
  meta?: ReactNode;
}

/**
 * Editorial spec-sheet page header. A mono eyebrow kicker, a fluid `.display`
 * headline (the single <h1> per page), a readable lead, and a hairline tick
 * accent — cohesive with the homepage. Server component; the `.reveal`
 * entrances respect `prefers-reduced-motion` via globals.css.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  badge,
  meta,
}: PageHeaderProps) {
  return (
    <header className="mb-10 sm:mb-12">
      {(eyebrow || badge) && (
        <div
          className="reveal flex flex-wrap items-center gap-x-3 gap-y-2"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {badge}
        </div>
      )}

      <h1
        className="display reveal mt-3 max-w-3xl text-balance text-3xl font-semibold text-foreground sm:text-4xl"
        style={{ animationDelay: "60ms" }}
      >
        {title}
      </h1>

      {description && (
        <p
          className="reveal mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          {description}
        </p>
      )}

      {meta && (
        <div
          className="reveal mt-4 font-mono text-xs text-muted-foreground"
          style={{ animationDelay: "150ms" }}
        >
          {meta}
        </div>
      )}

      <div
        className="reveal mt-6 flex items-center gap-3"
        style={{ animationDelay: "180ms" }}
      >
        <span
          className="tick-row max-w-[7rem] shrink-0"
          aria-hidden="true"
        />
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </header>
  );
}
