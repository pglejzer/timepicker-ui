"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatBytes } from "./types";
import { useEffect, useState } from "react";

export function BarChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const colors = {
    axis: isDark ? "#8b949e" : "#57606a",
    tooltipBg: isDark ? "#161b22" : "#ffffff",
    tooltipBorder: isDark ? "#30363d" : "#d0d7de",
    tooltipText: isDark ? "#c9d1d9" : "#1f2328",
    tooltipLabel: isDark ? "#58a6ff" : "#0969da",
    gradientStart: isDark ? "#58a6ff" : "#54aeff",
    gradientEnd: isDark ? "#1f6feb" : "#0969da",
  };

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
        >
          <XAxis
            dataKey="name"
            stroke={colors.axis}
            fontSize={12}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke={colors.axis}
            fontSize={12}
            tickFormatter={(value) => formatBytes(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "8px",
              color: colors.tooltipText,
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.4)"
                : "0 8px 24px rgba(0,0,0,0.12)",
            }}
            formatter={(value: number | undefined) =>
              value !== undefined ? [formatBytes(value), "Size"] : ["", ""]
            }
            labelStyle={{ color: colors.tooltipLabel, fontWeight: 600 }}
            cursor={{
              fill: isDark
                ? "rgba(88, 166, 255, 0.1)"
                : "rgba(9, 105, 218, 0.08)",
            }}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="url(#barGradient)"
            animationDuration={300}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.gradientStart} />
              <stop offset="100%" stopColor={colors.gradientEnd} />
            </linearGradient>
          </defs>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
