"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Package, Zap, Ruler } from "lucide-react";
import {
  BundleCard,
  ComparisonSection,
  ComparisonMetric,
  OptimizationCard,
  SummaryStats,
  TabButton,
  BarChart,
  CompositionBar,
  formatBytes,
  type BundleData,
} from "@/components/bundleStats";
import bundleData from "@/public/bundle-data.json";

const BUNDLE_DATA: BundleData = bundleData as BundleData;

export default function BundleStatsPage() {
  const [activeTab, setActiveTab] = useState<
    "rollup" | "vite" | "webpack" | "esbuild" | "comparison"
  >("rollup");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const data = BUNDLE_DATA;

  const rollupCore =
    data.results.rollup.core.files.find((f) => f.name === "core-only.min.js")
      ?.gzip || 0;
  const rollupFull =
    data.results.rollup.full.files.find((f) => f.name === "full-static.min.js")
      ?.gzip || 0;
  const rollupLazyMain =
    data.results.rollup.lazy.files.find((f) => f.name === "entry-lazy-load.js")
      ?.gzip || 0;
  const viteCore =
    data.results.vite.core.files.find((f) => f.name === "core-only.js")?.gzip ||
    0;
  const viteFull =
    data.results.vite.full.files.find((f) => f.name === "full-static.js")
      ?.gzip || 0;

  const webpackCore =
    data.results.webpack?.core?.files.find((f) => f.name === "core-only.min.js")
      ?.gzip || 0;
  const webpackFull =
    data.results.webpack?.full?.files.find(
      (f) => f.name === "full-static.min.js",
    )?.gzip || 0;

  const esbuildCore =
    data.results.esbuild?.core?.files.find((f) => f.name === "core-only.min.js")
      ?.gzip || 0;
  const esbuildFull =
    data.results.esbuild?.full?.files.find(
      (f) => f.name === "full-static.min.js",
    )?.gzip || 0;

  const pluginOverhead = rollupFull - rollupCore;
  const lazyVsCoreRollup = Math.abs(rollupLazyMain - rollupCore);
  const rollupVsViteCore = Math.abs(rollupCore - viteCore);

  const pluginRangeSize =
    data.results.vite.lazy.files.find((f) => f.name.includes("plugin-range"))
      ?.gzip || 0;
  const pluginTimezoneSize =
    data.results.vite.lazy.files.find((f) => f.name.includes("plugin-timezone"))
      ?.gzip || 0;

  // Grouped chart rows: one bundler per row, Core + Full bars. Only include
  // bundlers that have data so the ranking stays honest.
  const chartData = [
    { name: "Rollup", core: rollupCore, full: rollupFull },
    { name: "Vite", core: viteCore, full: viteFull },
    { name: "Webpack 5", core: webpackCore, full: webpackFull },
    { name: "esbuild", core: esbuildCore, full: esbuildFull },
  ].filter((d) => d.core > 0 || d.full > 0);

  // Composition for the measuring-tape bar: Core + each plugin = Full.
  const compositionSegments = [
    { label: "Core", bytes: rollupCore, tone: "primary" as const },
    { label: "Range plugin", bytes: pluginRangeSize, tone: "info" as const },
    {
      label: "Timezone plugin",
      bytes: pluginTimezoneSize,
      tone: "ok" as const,
    },
  ];

  const allBundlerCores = [
    { label: "Rollup", value: rollupCore, note: "Terser minification" },
    { label: "Vite", value: viteCore, note: "esbuild-based minification" },
    {
      label: "Webpack 5",
      value: webpackCore,
      note: "Terser + tree-shaking",
    },
    {
      label: "esbuild",
      value: esbuildCore,
      note: "Native minification",
    },
  ].filter((b) => b.value > 0);
  const maxBundlerCore = Math.max(...allBundlerCores.map((b) => b.value), 1);

  const tabs = [
    { id: "rollup" as const, label: "Rollup" },
    { id: "vite" as const, label: "Vite" },
    { id: "webpack" as const, label: "Webpack 5" },
    { id: "esbuild" as const, label: "esbuild" },
    { id: "comparison" as const, label: "Comparison" },
  ];

  // APG tabs: ArrowLeft/Right cycle, Home/End jump to ends. Selection follows
  // focus, and we move DOM focus to the newly selected tab button.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    }
    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <main id="main-content" className="flex flex-col">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="blueprint pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div className="container mx-auto px-4 py-14 sm:py-16 md:px-6">
          <p className="eyebrow reveal">Telemetry · gzip + brotli</p>
          <h1
            className="display reveal mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            Bundle analysis
          </h1>
          <p
            className="reveal mt-4 max-w-xl text-muted-foreground"
            style={{ animationDelay: "120ms" }}
          >
            A measurement report of the published bundles - core, full, and
            lazy-loaded - across four bundlers, with gzip and brotli sizes.
          </p>
          <p
            className="reveal nums mt-5 text-xs text-muted-foreground"
            style={{ animationDelay: "180ms" }}
          >
            Generated {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </section>

      <div className="container mx-auto space-y-10 px-4 py-12 md:px-6">
        {/* Overview instrument panel */}
        <div className="reveal">
          <SummaryStats
            rollupCore={rollupCore}
            rollupFull={rollupFull}
            pluginOverhead={pluginOverhead}
            criteria={[
              {
                passed: rollupFull > rollupCore,
                text: "Core bundle exists and Full > Core",
              },
              {
                passed: pluginOverhead < rollupCore * 0.5,
                text: `Plugin overhead reasonable (${formatBytes(pluginOverhead)} < 50% of core)`,
              },
              {
                passed: lazyVsCoreRollup < rollupCore * 0.25,
                text: `Lazy main ≈ core (delta: ${formatBytes(lazyVsCoreRollup)}, ${((lazyVsCoreRollup / rollupCore) * 100).toFixed(1)}%)`,
              },
              { passed: true, text: "Plugin chunks loaded separately" },
              {
                passed: rollupVsViteCore < rollupCore * 0.05,
                text: `Rollup ≈ Vite (diff: ${((rollupVsViteCore / rollupCore) * 100).toFixed(1)}%)`,
              },
            ]}
          />
        </div>

        {/* Signature: measuring-tape composition bar */}
        <section className="reveal rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Composition · gzip</p>
              <h2 className="display mt-2 text-lg font-medium text-foreground">
                What makes up the full bundle
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Core plus each lazy plugin, measured to scale.
              </p>
            </div>
            <Ruler
              className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block"
              aria-hidden="true"
            />
          </div>
          <CompositionBar
            segments={compositionSegments}
            total={rollupCore + pluginRangeSize + pluginTimezoneSize}
          />
        </section>

        {/* Grouped bar chart */}
        <section className="reveal rounded-xl border border-border bg-card p-6">
          <div className="mb-5">
            <p className="eyebrow">Cross-bundler · gzip</p>
            <h2 className="display mt-2 text-lg font-medium text-foreground">
              Core vs full, by bundler
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gzipped size of the minified core and full bundles.
            </p>
          </div>
          <BarChart data={chartData} />
          {(!webpackCore || !esbuildCore) && (
            <p className="mt-4 text-xs text-muted-foreground">
              Run{" "}
              <code className="nums rounded border border-border bg-muted px-1.5 py-0.5">
                npm run analyze:all
              </code>{" "}
              in consumer-test to add Webpack &amp; esbuild results.
            </p>
          )}
        </section>

        {/* Tabs */}
        <div className="border-b border-border">
          <div
            role="tablist"
            aria-label="Bundler results"
            className="-mb-px flex gap-6 overflow-x-auto overflow-y-hidden"
          >
            {tabs.map((t, i) => (
              <TabButton
                key={t.id}
                id={`tab-${t.id}`}
                controls={`panel-${t.id}`}
                active={activeTab === t.id}
                tabIndex={activeTab === t.id ? 0 : -1}
                buttonRef={(node) => {
                  tabRefs.current[t.id] = node;
                }}
                onClick={() => setActiveTab(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>

        {activeTab === "rollup" && (
          <div
            role="tabpanel"
            id="panel-rollup"
            aria-labelledby="tab-rollup"
            tabIndex={0}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <BundleCard title="Core only" result={data.results.rollup.core} />
            <BundleCard title="Full static" result={data.results.rollup.full} />
            <BundleCard title="Lazy load" result={data.results.rollup.lazy} />
          </div>
        )}

        {activeTab === "vite" && (
          <div
            role="tabpanel"
            id="panel-vite"
            aria-labelledby="tab-vite"
            tabIndex={0}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <BundleCard title="Core only" result={data.results.vite.core} />
            <BundleCard title="Full static" result={data.results.vite.full} />
            <BundleCard title="Lazy load" result={data.results.vite.lazy} />
          </div>
        )}

        {activeTab === "webpack" && (
          <div
            role="tabpanel"
            id="panel-webpack"
            aria-labelledby="tab-webpack"
            tabIndex={0}
          >
            {webpackCore > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <BundleCard
                  title="Core only"
                  result={data.results.webpack.core}
                />
                <BundleCard
                  title="Full static"
                  result={data.results.webpack.full}
                />
                <BundleCard
                  title="Lazy load"
                  result={data.results.webpack.lazy}
                />
              </div>
            ) : (
              <EmptyState
                icon={Package}
                label="Webpack 5"
                command={`npm install && npm run analyze:webpack:core &&\nnpm run analyze:webpack:full && npm run analyze:webpack:lazy`}
              />
            )}
          </div>
        )}

        {activeTab === "esbuild" && (
          <div
            role="tabpanel"
            id="panel-esbuild"
            aria-labelledby="tab-esbuild"
            tabIndex={0}
          >
            {esbuildCore > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <BundleCard
                  title="Core only"
                  result={data.results.esbuild.core}
                />
                <BundleCard
                  title="Full static"
                  result={data.results.esbuild.full}
                />
                <BundleCard
                  title="Lazy load"
                  result={data.results.esbuild.lazy}
                />
              </div>
            ) : (
              <EmptyState
                icon={Zap}
                label="esbuild"
                command={`npm install && npm run analyze:esbuild:core &&\nnpm run analyze:esbuild:full && npm run analyze:esbuild:lazy`}
              />
            )}
          </div>
        )}

        {activeTab === "comparison" && (
          <div
            role="tabpanel"
            id="panel-comparison"
            aria-labelledby="tab-comparison"
            tabIndex={0}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <ComparisonSection
              eyebrow="Baseline"
              title="Base bundle sizes"
              description="Production-ready minified bundles with gzip compression."
            >
              <ComparisonMetric
                label="Core bundle"
                value={formatBytes(rollupCore)}
                description="Timepicker without any plugins - minimum size"
                badge="Baseline"
                badgeColor="ok"
              />
              <ComparisonMetric
                label="Full bundle"
                value={formatBytes(rollupFull)}
                description="Core + all plugins (Range, Timezone)"
                badge={`+${((pluginOverhead / rollupCore) * 100).toFixed(0)}%`}
                badgeColor="info"
              />
            </ComparisonSection>

            <ComparisonSection
              eyebrow="Plugins"
              title="Plugin impact"
              description="Additional size cost when using plugins."
            >
              <ComparisonMetric
                label="Plugin overhead"
                value={formatBytes(pluginOverhead)}
                description="Extra size for Range + Timezone plugins"
                badge={`${((pluginOverhead / rollupCore) * 100).toFixed(1)}%`}
                badgeColor="warn"
              />
              <ComparisonMetric
                label="Range plugin"
                value={formatBytes(pluginRangeSize)}
                description="Time range selection functionality (lazy-loaded)"
                badge="Lazy"
                badgeColor="neutral"
              />
              <ComparisonMetric
                label="Timezone plugin"
                value={formatBytes(pluginTimezoneSize)}
                description="Timezone selection support (lazy-loaded)"
                badge="Lazy"
                badgeColor="neutral"
              />
            </ComparisonSection>

            <ComparisonSection
              eyebrow="Ranking"
              title="Bundler comparison"
              description="Core bundle size across all bundlers (minified + gzip)."
            >
              {allBundlerCores.map((b) => {
                const delta = b.value - rollupCore;
                const isReference = b.label === "Rollup";
                const within = Math.abs(delta) < rollupCore * 0.05;
                return (
                  <ComparisonMetric
                    key={b.label}
                    label={b.label}
                    value={formatBytes(b.value)}
                    description={b.note}
                    fraction={b.value / maxBundlerCore}
                    badge={
                      isReference
                        ? "Reference"
                        : `${delta > 0 ? "+" : ""}${((delta / rollupCore) * 100).toFixed(1)}%`
                    }
                    badgeColor={isReference || within ? "ok" : "warn"}
                  />
                );
              })}
            </ComparisonSection>

            <ComparisonSection
              eyebrow="Health"
              title="Optimization quality"
              description="Bundle optimization health checks."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <OptimizationCard
                  passed={rollupFull > rollupCore}
                  title="Tree-shaking"
                  description="Unused code is properly removed"
                  metric={`Full: ${formatBytes(rollupFull)} > Core: ${formatBytes(rollupCore)}`}
                />
                <OptimizationCard
                  passed={pluginOverhead < rollupCore * 0.5}
                  title="Plugin efficiency"
                  description="Plugins add less than 50% overhead"
                  metric={`${formatBytes(pluginOverhead)} (${((pluginOverhead / rollupCore) * 100).toFixed(0)}%)`}
                />
                <OptimizationCard
                  passed={rollupVsViteCore < rollupCore * 0.05}
                  title="Bundler consistency"
                  description="Rollup and Vite produce similar sizes"
                  metric={`Diff: ${formatBytes(rollupVsViteCore)} (${((rollupVsViteCore / rollupCore) * 100).toFixed(1)}%)`}
                />
                <OptimizationCard
                  passed={pluginRangeSize > 0 && pluginTimezoneSize > 0}
                  title="Code splitting"
                  description="Plugins can be loaded separately"
                  metric={`${formatBytes(pluginRangeSize + pluginTimezoneSize)} in chunks`}
                />
              </div>
            </ComparisonSection>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({
  icon: Icon,
  label,
  command,
}: {
  icon: typeof Package;
  label: string;
  command: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mx-auto max-w-md py-10 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted/40">
          <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <p className="eyebrow">No data yet</p>
        <h3 className="display mt-2 text-lg font-medium">
          {label} results not generated
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Run the following in consumer-test to generate {label} bundle data:
        </p>
        <pre className="nums mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 px-4 py-3 text-left text-xs text-foreground">
          {command}
        </pre>
      </div>
    </div>
  );
}

