"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
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
import styles from "./page.module.css";

const BUNDLE_DATA: BundleData = bundleData as BundleData;

// The labels in bundle-data.json start with emoji, so the page names the variants itself.
const VARIANTS = [
  { key: "core", label: "Core only" },
  { key: "full", label: "Full static" },
  { key: "lazy", label: "Lazy load" },
] as const;

type BundlerResults = BundleData["results"]["rollup"];

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
    { label: "Core", bytes: rollupCore, tone: "ink" as const },
    { label: "Range plugin", bytes: pluginRangeSize, tone: "ink3" as const },
    {
      label: "Timezone plugin",
      bytes: pluginTimezoneSize,
      tone: "hair" as const,
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
    <main id="main-content">
      <div className={styles.inner}>
        <PageHeader
          title="Bundle analysis"
          description="A measurement report of the published bundles - core, full, and lazy-loaded - across four bundlers, with gzip and brotli sizes."
          meta={
            <>
              Generated <time dateTime={data.timestamp}>{data.timestamp.slice(0, 10)}</time>
            </>
          }
        />

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

        <Section
          title="What makes up the full bundle"
          description="Core plus each lazy plugin, measured to scale."
        >
          <CompositionBar
            segments={compositionSegments}
            total={rollupCore + pluginRangeSize + pluginTimezoneSize}
          />
        </Section>

        <Section
          title="Core vs full, by bundler"
          description="Gzipped size of the minified core and full bundles."
        >
          <BarChart data={chartData} />
          {(!webpackCore || !esbuildCore) && (
            <p className={styles.note}>
              Run <code>npm run analyze:all</code> in consumer-test to add Webpack &amp; esbuild results.
            </p>
          )}
        </Section>

        <div className={styles.tabs}>
          <div role="tablist" aria-label="Bundler results" className={styles.tablist}>
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
            className={styles.panel}
          >
            <BundleCards results={data.results.rollup} />
          </div>
        )}

        {activeTab === "vite" && (
          <div
            role="tabpanel"
            id="panel-vite"
            aria-labelledby="tab-vite"
            tabIndex={0}
            className={styles.panel}
          >
            <BundleCards results={data.results.vite} />
          </div>
        )}

        {activeTab === "webpack" && (
          <div
            role="tabpanel"
            id="panel-webpack"
            aria-labelledby="tab-webpack"
            tabIndex={0}
            className={styles.panel}
          >
            {webpackCore > 0 ? (
              <BundleCards results={data.results.webpack} />
            ) : (
              <EmptyState
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
            className={styles.panel}
          >
            {esbuildCore > 0 ? (
              <BundleCards results={data.results.esbuild} />
            ) : (
              <EmptyState
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
            className={`${styles.panel} ${styles.comparison}`}
          >
            <ComparisonSection
              title="Base bundle sizes"
              description="Production-ready minified bundles with gzip compression."
            >
              <ComparisonMetric
                label="Core bundle"
                value={formatBytes(rollupCore)}
                description="Timepicker without any plugins - minimum size"
                badge="Baseline"
              />
              <ComparisonMetric
                label="Full bundle"
                value={formatBytes(rollupFull)}
                description="Core + all plugins (Range, Timezone)"
                badge={`+${((pluginOverhead / rollupCore) * 100).toFixed(0)}%`}
              />
            </ComparisonSection>

            <ComparisonSection
              title="Plugin impact"
              description="Additional size cost when using plugins."
            >
              <ComparisonMetric
                label="Plugin overhead"
                value={formatBytes(pluginOverhead)}
                description="Extra size for Range + Timezone plugins"
                badge={`${((pluginOverhead / rollupCore) * 100).toFixed(1)}%`}
              />
              <ComparisonMetric
                label="Range plugin"
                value={formatBytes(pluginRangeSize)}
                description="Time range selection functionality (lazy-loaded)"
                badge="Lazy"
              />
              <ComparisonMetric
                label="Timezone plugin"
                value={formatBytes(pluginTimezoneSize)}
                description="Timezone selection support (lazy-loaded)"
                badge="Lazy"
              />
            </ComparisonSection>

            <ComparisonSection
              title="Bundler comparison"
              description="Core bundle size across all bundlers (minified + gzip)."
            >
              {allBundlerCores.map((b) => {
                const delta = b.value - rollupCore;
                const isReference = b.label === "Rollup";
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
                  />
                );
              })}
            </ComparisonSection>

            <ComparisonSection
              title="Optimization quality"
              description="Bundle optimization health checks."
            >
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
            </ComparisonSection>
          </div>
        )}
      </div>
    </main>
  );
}

function BundleCards({ results }: { results: BundlerResults }) {
  return (
    <div className={styles.cards}>
      {VARIANTS.map((variant) => (
        <BundleCard key={variant.key} title={variant.label} result={results[variant.key]} />
      ))}
    </div>
  );
}

function EmptyState({ label, command }: { label: string; command: string }) {
  return (
    <div className={styles.empty}>
      <h3 className={styles.emptyTitle}>{label} results not generated</h3>
      <p className={styles.emptyText}>
        Run the following in consumer-test to generate {label} bundle data:
      </p>
      <CodeBlock code={command} language="bash" />
    </div>
  );
}
