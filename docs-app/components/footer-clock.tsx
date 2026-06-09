"use client";

import { useEffect, useRef, useState } from "react";

const PLACEHOLDER = "--:--:--";

interface ClockState {
  /** "HH:MM:SS" in 24h, tabular-friendly. Empty string before mount. */
  time: string;
  /** ISO-8601 string for the <time dateTime> attribute. */
  iso: string;
  /** Short timezone label, e.g. "CET" or "GMT+2". */
  zone: string;
}

function read(): ClockState {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let zone = "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).formatToParts(now);
    zone = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    zone = "";
  }

  return { time, iso: now.toISOString(), zone };
}

/**
 * Live local-time readout - the footer's signature dynamic element.
 *
 * Hydration safety: the server render and the FIRST client render both emit a
 * stable placeholder ("--:--:--"), never a real time. Real time only appears
 * after mount, inside useEffect, so the server HTML can never disagree with the
 * client. The digits live in a tabular `.nums` span with a reserved width, so
 * the swap from placeholder to live time causes no layout shift.
 *
 * Accessibility: the visible ticking digits are aria-hidden (a per-second live
 * region would spam screen readers). A single <time> element carries the
 * machine-readable value via dateTime; its visually-hidden text is updated only
 * to the minute so assistive tech gets a stable, useful label, not a stream.
 *
 * Performance / motion: one setInterval (1s), cleared on unmount and paused
 * while the tab is hidden. The blinking colon is decorative and disabled under
 * prefers-reduced-motion (see globals.css); the digits keep updating because
 * they are information, not decoration.
 */
export function FooterClock() {
  const [state, setState] = useState<ClockState | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => setState(read());

    const start = () => {
      if (intervalRef.current !== null) return;
      tick();
      intervalRef.current = window.setInterval(tick, 1000);
    };

    const stop = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const mounted = state !== null;
  const display = mounted ? state.time : PLACEHOLDER;
  const [hh, mm, ss] = display.split(":");

  // A minute-resolution label keeps the accessible name from churning each second.
  const accessibleLabel = mounted
    ? `Your local time: ${hh}:${mm}${state.zone ? ` ${state.zone}` : ""}`
    : "Your local time";

  return (
    <div className="flex items-baseline gap-3">
      <time
        dateTime={mounted ? state.iso : undefined}
        aria-label={accessibleLabel}
        className="nums text-3xl font-semibold leading-none text-foreground sm:text-4xl"
      >
        <span aria-hidden="true">
          {hh}
          <span className="footer-clock-colon text-muted-foreground/70">:</span>
          {mm}
          <span className="footer-clock-colon text-muted-foreground/70">:</span>
          {ss}
        </span>
      </time>
      <span
        aria-hidden="true"
        className="nums text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground"
      >
        {mounted && state.zone ? state.zone : "local"}
      </span>
    </div>
  );
}

