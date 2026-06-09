/**
 * timepicker-ui mark.
 * A monoline dial with hands at 10:10 - the hour hand neutral, the minute hand
 * in electric blue. Full-weight ring (never a faint spinner). Reads at 16px and
 * in pure black & white; the favicon is the same mark, white on an accent tile.
 */
export function Logo({
  className = "h-[22px] w-[22px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.75" strokeWidth="1.6" />
      {/* hour hand -> 10 o'clock */}
      <path d="M12 12 8.7 10.1" strokeWidth="1.7" />
      {/* minute hand -> 2 o'clock (accent) */}
      <path d="M12 12 16.8 9.2" strokeWidth="2" className="text-primary" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

