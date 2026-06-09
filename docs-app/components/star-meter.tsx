"use client";

import { useEffect, useRef, useState } from "react";

interface StarMeterProps {
  /** Final, real star count fetched on the server. */
  count: number;
  /** Next round milestone above the current count. */
  milestone: number;
}

const ANIM_MS = 1100;
const GAUGE_MS = 900;

/** Ease-out cubic - fast start, gentle settle, like a sweep hand braking. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Client-only motion island for the star call-out. The data fetch stays in the
 * parent server component; this only animates values it is handed.
 *
 * Hydration safety: both the server render and the FIRST client render show the
 * final, real numbers (state is initialised to `count` / final width). The
 * count-up only begins after mount, once the section scrolls into view - so a
 * no-JS visitor and the pre-hydration HTML always show the true figure, never a
 * flash of zero.
 */
export function StarMeter({ count, milestone }: StarMeterProps) {
  const pct = Math.min(100, (count / milestone) * 100);
  const countLabel = count.toLocaleString("en-US");
  const milestoneLabel = milestone.toLocaleString("en-US");

  // Initialised to the FINAL values → server HTML and first client render match.
  const [display, setDisplay] = useState(count);
  const [gaugeWidth, setGaugeWidth] = useState(pct);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;

    // Reduced motion, or no IntersectionObserver → leave the final values in
    // place. Nothing to animate.
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }

    const runCountUp = () => {
      const start = performance.now();
      const from = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ANIM_MS);
        const value = Math.round(from + (count - from) * easeOutCubic(t));
        setDisplay(value);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const fire = () => {
      // Drop to the animation's starting state, then animate up on the next
      // frame so the CSS gauge transition has a width to ease toward.
      setDisplay(0);
      setGaugeWidth(0);
      requestAnimationFrame(() => {
        setGaugeWidth(pct);
        runCountUp();
      });
    };

    if (!node) {
      fire();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          observer.disconnect();
          fire();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [count, pct]);

  return (
    <div ref={sectionRef}>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="nums text-4xl font-semibold sm:text-5xl">
          {display.toLocaleString("en-US")}
        </span>
        <span className="nums text-sm text-muted-foreground">
          / {milestoneLabel}
        </span>
        <ClockMark className="ml-auto self-center" />
      </div>

      <div className="mt-5">
        <p className="eyebrow text-[0.62rem]">Next milestone</p>
        <div
          role="img"
          aria-label={`${countLabel} of ${milestoneLabel} stars toward the next milestone`}
          className="relative mt-2 h-[7px] w-full overflow-hidden rounded-full bg-border"
        >
          <div
            className="star-gauge-fill absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{
              width: `${gaugeWidth}%`,
              transitionDuration: `${GAUGE_MS}ms`,
            }}
          />
          <div className="tick-overlay pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  );
}

/**
 * Signature visual: a hairline analog clock face whose single second hand sweeps
 * continuously. Purely decorative → aria-hidden. The sweep is CSS-driven and
 * pauses under prefers-reduced-motion (see globals.css).
 */
function ClockMark({ className }: { className?: string }) {
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <span
      aria-hidden="true"
      className={`star-clock inline-flex shrink-0 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 48 48"
        width="48"
        height="48"
        fill="none"
        className="text-primary"
      >
        {/* Face */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        {/* 12 tick marks */}
        {ticks.map((i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const outer = 21;
          const inner = i % 3 === 0 ? 17 : 19;
          const x1 = (24 + outer * Math.sin(angle)).toFixed(3);
          const y1 = (24 - outer * Math.cos(angle)).toFixed(3);
          const x2 = (24 + inner * Math.sin(angle)).toFixed(3);
          const y2 = (24 - inner * Math.cos(angle)).toFixed(3);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
            />
          );
        })}
        {/* Sweeping second hand */}
        <line
          className="star-clock-hand"
          x1="24"
          y1="24"
          x2="24"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="24" cy="24" r="1.6" fill="currentColor" />
      </svg>
    </span>
  );
}

