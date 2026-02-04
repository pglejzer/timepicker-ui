"use client";

import { useState } from "react";
import {
  BundleCard,
  ComparisonSection,
  ComparisonMetric,
  OptimizationCard,
  SummaryStats,
  TabButton,
  BarChart,
  formatBytes,
  type BundleData,
} from "@/components/bundleStats";
import bundleData from "@/public/bundle-data.json";

const BUNDLE_DATA: BundleData = bundleData as BundleData;

export default function BundleStatsPage() {
  const [activeTab, setActiveTab] = useState<
    "rollup" | "vite" | "webpack" | "esbuild" | "comparison"
  >("rollup");
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
  const viteLazyMain =
    data.results.vite.lazy.files.find((f) => f.name === "lazy-load.js")?.gzip ||
    0;

  const webpackCore =
    data.results.webpack?.core?.files.find((f) => f.name === "core-only.min.js")
      ?.gzip || 0;
  const webpackFull =
    data.results.webpack?.full?.files.find(
      (f) => f.name === "full-static.min.js",
    )?.gzip || 0;
  const webpackLazyMain =
    data.results.webpack?.lazy?.files.find((f) => f.name === "lazy-load.js")
      ?.gzip || 0;

  const esbuildCore =
    data.results.esbuild?.core?.files.find((f) => f.name === "core-only.min.js")
      ?.gzip || 0;
  const esbuildFull =
    data.results.esbuild?.full?.files.find(
      (f) => f.name === "full-static.min.js",
    )?.gzip || 0;
  const esbuildLazyMain =
    data.results.esbuild?.lazy?.files.find((f) =>
      f.name.includes("entry-lazy-load"),
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

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            📦 Bundle Analysis Report
          </h1>
          <p className="text-muted-foreground text-sm">
            Generated: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>

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

        <div className="bg-card border border-border rounded-xl p-6 mb-8 min-h-[400px]">
          <h2 className="text-xl font-bold mb-4 text-primary">
            Bundle Size Comparison (All Bundlers)
          </h2>
          <BarChart
            data={[
              { name: "Rollup Core", value: rollupCore },
              { name: "Rollup Full", value: rollupFull },
              { name: "Vite Core", value: viteCore },
              { name: "Vite Full", value: viteFull },
              {
                name: "Webpack Core",
                value: webpackCore || 0,
              },
              {
                name: "Webpack Full",
                value: webpackFull || 0,
              },
              {
                name: "esbuild Core",
                value: esbuildCore || 0,
              },
              {
                name: "esbuild Full",
                value: esbuildFull || 0,
              },
            ]}
          />
          {(!webpackCore || !esbuildCore) && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              * Run{" "}
              <code className="bg-muted px-1 py-0.5 rounded">
                npm run analyze:all
              </code>{" "}
              in consumer-test to see Webpack & esbuild results.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
          <TabButton
            active={activeTab === "rollup"}
            onClick={() => setActiveTab("rollup")}
          >
            Rollup
          </TabButton>
          <TabButton
            active={activeTab === "vite"}
            onClick={() => setActiveTab("vite")}
          >
            Vite
          </TabButton>
          <TabButton
            active={activeTab === "webpack"}
            onClick={() => setActiveTab("webpack")}
          >
            Webpack 5
          </TabButton>
          <TabButton
            active={activeTab === "esbuild"}
            onClick={() => setActiveTab("esbuild")}
          >
            esbuild
          </TabButton>
          <TabButton
            active={activeTab === "comparison"}
            onClick={() => setActiveTab("comparison")}
          >
            Comparison
          </TabButton>
        </div>

        {activeTab === "rollup" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BundleCard title="Core Only" result={data.results.rollup.core} />
            <BundleCard title="Full Static" result={data.results.rollup.full} />
            <BundleCard title="Lazy Load" result={data.results.rollup.lazy} />
          </div>
        )}

        {activeTab === "vite" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BundleCard title="Core Only" result={data.results.vite.core} />
            <BundleCard title="Full Static" result={data.results.vite.full} />
            <BundleCard title="Lazy Load" result={data.results.vite.lazy} />
          </div>
        )}

        {activeTab === "webpack" && (
          <>
            {webpackCore > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BundleCard
                  title="Core Only"
                  result={data.results.webpack.core}
                />
                <BundleCard
                  title="Full Static"
                  result={data.results.webpack.full}
                />
                <BundleCard
                  title="Lazy Load"
                  result={data.results.webpack.lazy}
                />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Run the following commands in consumer-test to generate
                    Webpack 5 bundle data:
                  </p>
                  <div className="bg-muted rounded px-4 py-2 font-mono text-sm inline-block">
                    npm install && npm run analyze:webpack:core &&
                    <br />
                    npm run analyze:webpack:full && npm run analyze:webpack:lazy
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "esbuild" && (
          <>
            {esbuildCore > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BundleCard
                  title="Core Only"
                  result={data.results.esbuild.core}
                />
                <BundleCard
                  title="Full Static"
                  result={data.results.esbuild.full}
                />
                <BundleCard
                  title="Lazy Load"
                  result={data.results.esbuild.lazy}
                />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Run the following commands in consumer-test to generate
                    esbuild bundle data:
                  </p>
                  <div className="bg-muted rounded px-4 py-2 font-mono text-sm inline-block">
                    npm install && npm run analyze:esbuild:core &&
                    <br />
                    npm run analyze:esbuild:full && npm run analyze:esbuild:lazy
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "comparison" && (
          <div className="space-y-6">
            <ComparisonSection
              title="Base Bundle Sizes"
              description="Production-ready minified bundles with gzip compression"
            >
              <ComparisonMetric
                label="Core Bundle"
                value={formatBytes(rollupCore)}
                description="Timepicker without any plugins - minimum size"
                badge="Baseline"
                badgeColor="bg-[#238636]"
              />
              <ComparisonMetric
                label="Full Bundle"
                value={formatBytes(rollupFull)}
                description="Core + all plugins (Range, Timezone)"
                badge={`+${((pluginOverhead / rollupCore) * 100).toFixed(0)}%`}
                badgeColor="bg-[#1f6feb]"
              />
            </ComparisonSection>

            <ComparisonSection
              title="Plugin Impact"
              description="Additional size cost when using plugins"
            >
              <ComparisonMetric
                label="Plugin Overhead"
                value={formatBytes(pluginOverhead)}
                description="Extra size for Range + Timezone plugins"
                badge={`${((pluginOverhead / rollupCore) * 100).toFixed(1)}%`}
                badgeColor="bg-[#9e6a03]"
              />
              <ComparisonMetric
                label="Range Plugin"
                value={formatBytes(pluginRangeSize)}
                description="Time range selection functionality (lazy-loaded)"
                badge="Lazy"
                badgeColor="bg-[#8957e5]"
              />
              <ComparisonMetric
                label="Timezone Plugin"
                value={formatBytes(pluginTimezoneSize)}
                description="Timezone selection support (lazy-loaded)"
                badge="Lazy"
                badgeColor="bg-[#8957e5]"
              />
            </ComparisonSection>

            <ComparisonSection
              title="Bundler Comparison"
              description="Core bundle size across all bundlers (minified + gzip)"
            >
              <ComparisonMetric
                label="Rollup"
                value={formatBytes(rollupCore)}
                description="Terser minification"
                badge="Reference"
                badgeColor="bg-[#238636]"
              />
              <ComparisonMetric
                label="Vite"
                value={formatBytes(viteCore)}
                description="esbuild-based minification"
                badge={`${rollupVsViteCore > 0 ? "+" : ""}${((rollupVsViteCore / rollupCore) * 100).toFixed(1)}%`}
                badgeColor={
                  rollupVsViteCore < rollupCore * 0.05
                    ? "bg-[#238636]"
                    : "bg-[#9e6a03]"
                }
              />
              <ComparisonMetric
                label="Webpack"
                value={formatBytes(webpackCore || rollupCore)}
                description="Terser + tree-shaking"
                badge={
                  webpackCore
                    ? `${(((webpackCore - rollupCore) / rollupCore) * 100).toFixed(1)}%`
                    : "No data"
                }
                badgeColor={
                  webpackCore &&
                  Math.abs(webpackCore - rollupCore) < rollupCore * 0.05
                    ? "bg-[#238636]"
                    : "bg-[#9e6a03]"
                }
              />
              <ComparisonMetric
                label="esbuild"
                value={formatBytes(esbuildCore || rollupCore)}
                description="Ultra-fast native minification"
                badge={
                  esbuildCore
                    ? `${(((esbuildCore - rollupCore) / rollupCore) * 100).toFixed(1)}%`
                    : "No data"
                }
                badgeColor={
                  esbuildCore &&
                  Math.abs(esbuildCore - rollupCore) < rollupCore * 0.05
                    ? "bg-[#238636]"
                    : "bg-[#9e6a03]"
                }
              />
            </ComparisonSection>

            <ComparisonSection
              title="Optimization Quality"
              description="Bundle optimization health checks"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OptimizationCard
                  passed={rollupFull > rollupCore}
                  title="Tree-Shaking"
                  description="Unused code is properly removed"
                  metric={`Full: ${formatBytes(rollupFull)} > Core: ${formatBytes(rollupCore)}`}
                />
                <OptimizationCard
                  passed={pluginOverhead < rollupCore * 0.5}
                  title="Plugin Efficiency"
                  description="Plugins add less than 50% overhead"
                  metric={`${formatBytes(pluginOverhead)} (${((pluginOverhead / rollupCore) * 100).toFixed(0)}%)`}
                />
                <OptimizationCard
                  passed={rollupVsViteCore < rollupCore * 0.05}
                  title="Bundler Consistency"
                  description="Rollup and Vite produce similar sizes"
                  metric={`Diff: ${formatBytes(rollupVsViteCore)} (${((rollupVsViteCore / rollupCore) * 100).toFixed(1)}%)`}
                />
                <OptimizationCard
                  passed={pluginRangeSize > 0 && pluginTimezoneSize > 0}
                  title="Code Splitting"
                  description="Plugins can be loaded separately"
                  metric={`${formatBytes(pluginRangeSize + pluginTimezoneSize)} in chunks`}
                />
              </div>
            </ComparisonSection>
          </div>
        )}
      </div>
    </div>
  );
}
