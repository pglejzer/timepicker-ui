"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./not-found-clock.module.css";

/**
 * The 404 clock: hour and minute hands fixed at 4:04 ("404" read as a time) and a
 * second hand that sweeps through CSS.
 *
 * Hydration safety: the markup is identical on the server and the first client
 * paint. The sweep is pure CSS, and `searching` starts `false` and only flips after
 * a user gesture. Hover, click or tap spins the hands once, then they settle back
 * at 4:04. Under `prefers-reduced-motion` the module CSS turns both animations off.
 */

// 4:04 → hour hand at 4h 4m = 122°, minute hand at 4m = 24°.
const HOUR_ANGLE = 4 * 30 + 4 * 0.5;
const MINUTE_ANGLE = 4 * 6;

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

export function NotFoundClock() {
  const [searching, setSearching] = useState(false);
  const timer = useRef<number | null>(null);

  const triggerSearch = useCallback(() => {
    if (searching) return;
    setSearching(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    // Matches the spin duration in not-found-clock.module.css.
    timer.current = window.setTimeout(() => setSearching(false), 900);
  }, [searching]);

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      role="presentation"
      onMouseEnter={triggerSearch}
      onClick={triggerSearch}
      className={`${styles.clock} ${searching ? styles.searching : ""}`}
    >
      <circle cx="100" cy="100" r="92" className={styles.ring} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="84" className={styles.ringInner} strokeWidth="1" strokeDasharray="1 5" />

      {TICKS.map((deg) => {
        const major = deg % 90 === 0;
        return (
          <line
            key={deg}
            x1="100"
            y1={major ? 14 : 17}
            x2="100"
            y2={major ? 26 : 24}
            className={major ? styles.tickMajor : styles.tickMinor}
            strokeWidth={major ? 2 : 1}
            strokeLinecap="round"
            transform={`rotate(${deg} 100 100)`}
          />
        );
      })}

      {/* The outer group spins on "search" (0 → 360°, back to identity); the inner
          group holds the 4:04 angle, so the hand always lands back at 4:04. */}
      <g className={`${styles.hand} ${styles.hour}`}>
        <g transform={`rotate(${HOUR_ANGLE} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="56" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </g>

      <g className={`${styles.hand} ${styles.minute}`}>
        <g transform={`rotate(${MINUTE_ANGLE} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="32" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      <g className={styles.second}>
        <line x1="100" y1="108" x2="100" y2="30" strokeWidth="1.25" strokeLinecap="round" />
      </g>

      <circle cx="100" cy="100" r="5" className={styles.cap} strokeWidth="2" />
      <circle cx="100" cy="100" r="1.75" className={styles.pin} />
    </svg>
  );
}
