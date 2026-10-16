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
import styles from "./BarChart.module.css";

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

// Only called inside an effect, so it never runs on the server.
function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "transparent";
}

function readPalette(): Palette {
  return {
    axis: cssVar("--ink-3"),
    grid: cssVar("--hair"),
    core: cssVar("--ink"),
    full: cssVar("--ink-3"),
    card: cssVar("--paper"),
    border: cssVar("--ink"),
    text: cssVar("--ink"),
    label: cssVar("--ink"),
    cursor: cssVar("--scene"),
  };
}

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Horizontal grouped bar chart: one row per bundler, two bars (Core / Full).
 * Recharts needs real colour values, so the palette is read from the site tokens
 * at runtime and re-read when the `.dark` class on <html> changes.
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

  // Nothing colour-bearing renders until the palette is read (no SSR mismatch).
  // The wrapper keeps its height, so there is no layout shift when the chart paints.
  const p = palette;

  const ariaLabel = data
    .map((d) => `${d.name}: core ${formatBytes(d.core)}, full ${formatBytes(d.full)}`)
    .join("; ");

  return (
    <div role="img" aria-label={`Gzipped bundle size by bundler. ${ariaLabel}.`} className={styles.chart}>
      {p && (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            barCategoryGap="28%"
            barGap={6}
          >
            <CartesianGrid horizontal={false} stroke={p.grid} strokeDasharray="2 4" />
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
                borderRadius: 0,
                color: p.text,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-small)",
                fontVariantNumeric: "tabular-nums",
              }}
              labelStyle={{ color: p.label, fontWeight: 700, marginBottom: 4 }}
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
                <span style={{ color: p.axis, fontSize: "var(--text-small)" }}>
                  {value === "core" ? "Core" : "Full"}
                </span>
              )}
            />
            <Bar
              dataKey="core"
              name="core"
              fill={p.core}
              isAnimationActive={!REDUCED_MOTION}
              animationDuration={REDUCED_MOTION ? 0 : 500}
            />
            <Bar
              dataKey="full"
              name="full"
              fill={p.full}
              isAnimationActive={!REDUCED_MOTION}
              animationDuration={REDUCED_MOTION ? 0 : 500}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
