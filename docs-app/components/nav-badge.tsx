interface NavBadgeProps {
  /** Badge label. Defaults to "new". */
  label?: string;
}

/**
 * Small, design-consistent pill used next to sidebar links (e.g. a "NEW" tag).
 * Uses the primary token tint so it adapts to light/dark themes — no hardcoded
 * colors. It is decorative: the link's accessible name stays the title, so the
 * pill is hidden from assistive tech and the real word is exposed via sr-only.
 */
export function NavBadge({ label = "new" }: NavBadgeProps) {
  return (
    <span className="ml-1.5 inline-flex items-center rounded border border-primary/30 bg-primary/10 px-1.5 font-mono text-[9px] font-medium uppercase leading-[1.4] tracking-wider text-primary">
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
