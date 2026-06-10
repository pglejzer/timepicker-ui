"use client";

import { useCallback, useRef, useState } from "react";

/**
 * The 404 hero: an instrument-grade analog clock with HOUR + MINUTE hands fixed
 * at 4:04 (the wordplay - "404" reads as the time 4:04), and a SECOND hand that
 * sweeps continuously via CSS.
 *
 * Hydration safety: every part renders identically on the server and the first
 * client paint. The sweep is pure CSS (`.nf-second`), so there is no JS-driven
 * transform at mount and therefore no server/client mismatch. The only client
 * state is `searching`, which starts `false` (matching SSR) and only flips after
 * a user gesture post-mount.
 *
 * Interaction (tasteful 2026 wink): on hover, click, or keyboard activation the
 * hands spin briefly - as if the clock were "searching for the page" - then
 * settle back to 4:04, because the page is still lost. The spin is a CSS class
 * toggled by a short-lived state flag; it is GPU-only (transform/opacity).
 *
 * Reduced motion: under `prefers-reduced-motion` the sweep and the spin are both
 * neutralized in globals.css, so the hands simply rest at 4:04 and the element
 * stays fully usable. The clock is decorative (`aria-hidden`); the real "404" is
 * carried by accessible text in the page itself.
 */

// 4:04 → hour hand at 4h 4m = 122°, minute hand at 4m = 24°.
const HOUR_ANGLE = 4 * 30 + 4 * 0.5; // 122
const MINUTE_ANGLE = 4 * 6; // 24

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

export function NotFoundClock() {
  const [searching, setSearching] = useState(false);
  const timer = useRef<number | null>(null);

  const triggerSearch = useCallback(() => {
    if (searching) return;
    setSearching(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    // Matches the .nf-searching animation duration in globals.css.
    timer.current = window.setTimeout(() => setSearching(false), 900);
  }, [searching]);

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      role="presentation"
      onMouseEnter={triggerSearch}
      onClick={triggerSearch}
      className={`nf-clock h-full w-full cursor-pointer ${
        searching ? "nf-searching" : ""
      }`}
    >
      {/* Outer dial - hairline ring */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="1"
        strokeDasharray="1 5"
        opacity="0.6"
      />

      {/* 12 hour ticks - taller at the quarters, echoing .tick-row */}
      {TICKS.map((deg) => {
        const major = deg % 90 === 0;
        return (
          <line
            key={deg}
            x1="100"
            y1={major ? 14 : 17}
            x2="100"
            y2={major ? 26 : 24}
            stroke={
              major ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"
            }
            strokeWidth={major ? 2 : 1}
            strokeLinecap="round"
            transform={`rotate(${deg} 100 100)`}
            opacity={major ? 0.9 : 0.45}
          />
        );
      })}

      {/* Hour hand - neutral. Outer group does the optional "search" spin
          (0→360, returns to identity); inner group holds the static 4:04 base
          angle, so after the spin the hand always lands back at 4:04. */}
      <g className="nf-hand nf-hand-hour">
        <g transform={`rotate(${HOUR_ANGLE} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="56"
            stroke="hsl(var(--foreground))"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Minute hand - accent cobalt, base angle fixed at 4:04 */}
      <g className="nf-hand nf-hand-minute">
        <g transform={`rotate(${MINUTE_ANGLE} 100 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="32"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Second hand - continuous CSS sweep (decorative) */}
      <g className="nf-second">
        <line
          x1="100"
          y1="108"
          x2="100"
          y2="30"
          stroke="hsl(var(--primary))"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Center cap */}
      <circle
        cx="100"
        cy="100"
        r="5"
        fill="hsl(var(--background))"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
      <circle cx="100" cy="100" r="1.75" fill="hsl(var(--primary))" />
    </svg>
  );
}

