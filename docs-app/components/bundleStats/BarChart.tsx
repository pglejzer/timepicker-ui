"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { formatBytes } from "./types";

export interface GroupedDatum {
  name: string;
  core: number;
  full: number;
}

interface Palette {
  axis: string;
  grid: string;
  core: string;
  full: string;
  card: string;
  border: string;
  text: string;
  label: string;
  cursor: string;
}

/**
 * Reads a `H S% L%` HSL triplet from a CSS custom property on the document
 * root and returns a usable `hsl(...)` (or `hsl(... / a)`) string. SSR-safe:
 * only ever called inside an effect.
 */
function hslVar(name: string, alpha?: number): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return "transparent";
  return alpha === undefined ? `hsl(${raw})` : `hsl(${raw} / ${alpha})`;
}

function readPalette(): Palette {
  return {
    axis: hslVar("--muted-foreground"),
    grid: hslVar("--border"),
    core: hslVar("--primary"),
    full: hslVar("--muted-foreground", 0.55),
    card: hslVar("--card"),
    border: hslVar("--border"),
    text: hslVar("--foreground"),
    label: hslVar("--primary"),
    cursor: hslVar("--primary", 0.08),
  };
}

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Horizontal grouped bar chart: one row per bundler, two bars (Core / Full).
 * All colors derive from the site's CSS variables at runtime, so the chart
 * tracks the active theme automatically via a MutationObserver on `.dark`.
 */
export function BarChart({ data }: { data: GroupedDatum[] }) {
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    const sync = () => setPalette(readPalette());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Render nothing color-bearing until the palette is read (avoids a flash of
  // wrong colors / SSR mismatch). The wrapper keeps its height so there is no
  // layout shift when the chart paints.
  const p = palette;

  const ariaLabel = data
    .map(
      (d) =>
        `${d.name}: core ${formatBytes(d.core)}, full ${formatBytes(d.full)}`,
    )
    .join("; ");

  return (
    <div
      role="img"
      aria-label={`Gzipped bundle size by bundler. ${ariaLabel}.`}
      className="h-[320px] w-full sm:h-[360px] md:h-[420px]"
    >
      {p && (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            barCategoryGap="28%"
            barGap={6}
          >
            <CartesianGrid
              horizontal={false}
              stroke={p.grid}
              strokeDasharray="2 4"
            />
            <XAxis
              type="number"
              stroke={p.axis}
              tick={{ fill: p.axis, fontSize: 11, fontFamily: "var(--font-mono)" }}
              tickLine={{ stroke: p.grid }}
              axisLine={{ stroke: p.grid }}
              tickFormatter={(v: number) => formatBytes(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              stroke={p.axis}
              tick={{ fill: p.text, fontSize: 12, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: p.grid }}
            />
            <Tooltip
              cursor={{ fill: p.cursor }}
              contentStyle={{
                backgroundColor: p.card,
                border: `1px solid ${p.border}`,
                borderRadius: "0.5rem",
                color: p.text,
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontVariantNumeric: "tabular-nums",
                boxShadow: "0 8px 24px hsl(0 0% 0% / 0.12)",
              }}
              labelStyle={{ color: p.label, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ fontVariantNumeric: "tabular-nums" }}
              formatter={(value, name) => [
                formatBytes(typeof value === "number" ? value : 0),
                name === "core" ? "Core" : "Full",
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={28}
              iconType="square"
              iconSize={10}
              formatter={(value: string) => (
                <span
                  style={{
                    color: p.axis,
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {value === "core" ? "Core" : "Full"}
                </span>
              )}
            />
            <Bar
              dataKey="core"
              name="core"
              fill={p.core}
              radius={[0, 3, 3, 0]}
              isAnimationActive={!REDUCED_MOTION}
              animationDuration={REDUCED_MOTION ? 0 : 500}
            />
            <Bar
              dataKey="full"
              name="full"
              fill={p.full}
              radius={[0, 3, 3, 0]}
              isAnimationActive={!REDUCED_MOTION}
              animationDuration={REDUCED_MOTION ? 0 : 500}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
