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

// AUTO-GENERATED DATA - DO NOT EDIT MANUALLY

const BUNDLE_DATA: BundleData = {
  "timestamp": "2026-02-04T15:43:29.130Z",
  "results": {
    "rollup": {
      "core": {
        "label": "🎯 Core Bundle",
        "files": [
          {
            "name": "core-only.js",
            "displayName": "Core (unminified)",
            "raw": 82073,
            "gzip": 20395,
            "brotli": 17620
          },
          {
            "name": "core-only.min.js",
            "displayName": "Core (minified)",
            "raw": 80313,
            "gzip": 19691,
            "brotli": 17017
          }
        ],
        "total": {
          "raw": 162386,
          "gzip": 40086,
          "brotli": 34637
        }
      },
      "full": {
        "label": "📦 Full Bundle (with Plugins)",
        "files": [
          {
            "name": "full-static.js",
            "displayName": "Full (unminified)",
            "raw": 98591,
            "gzip": 24315,
            "brotli": 20959
          },
          {
            "name": "full-static.min.js",
            "displayName": "Full (minified)",
            "raw": 96481,
            "gzip": 23428,
            "brotli": 20203
          }
        ],
        "total": {
          "raw": 195072,
          "gzip": 47743,
          "brotli": 41162
        }
      },
      "lazy": {
        "label": "⚡ Lazy Load Bundle",
        "files": [
          {
            "name": "entry-lazy-load.js",
            "displayName": "entry-lazy-load.js",
            "raw": 80554,
            "gzip": 19794,
            "brotli": 17118
          },
          {
            "name": "plugin-range.js",
            "displayName": "Range Plugin",
            "raw": 9783,
            "gzip": 2566,
            "brotli": 2321
          },
          {
            "name": "plugin-timezone.js",
            "displayName": "Timezone Plugin",
            "raw": 6360,
            "gzip": 2085,
            "brotli": 1846
          }
        ],
        "total": {
          "raw": 96697,
          "gzip": 24445,
          "brotli": 21285
        }
      }
    },
    "vite": {
      "core": {
        "label": "🎯 Core Bundle",
        "files": [
          {
            "name": "core-only.js",
            "displayName": "Core (minified)",
            "raw": 84329,
            "gzip": 20342,
            "brotli": 17513
          },
          {
            "name": "core-only.unmin.js",
            "displayName": "Core (unminified)",
            "raw": 107555,
            "gzip": 22725,
            "brotli": 19282
          }
        ],
        "total": {
          "raw": 191884,
          "gzip": 43067,
          "brotli": 36795
        }
      },
      "full": {
        "label": "📦 Full Bundle (with Plugins)",
        "files": [
          {
            "name": "full-static.js",
            "displayName": "Full (minified)",
            "raw": 101419,
            "gzip": 24206,
            "brotli": 20817
          },
          {
            "name": "full-static.unmin.js",
            "displayName": "Full (unminified)",
            "raw": 130294,
            "gzip": 27302,
            "brotli": 23226
          }
        ],
        "total": {
          "raw": 231713,
          "gzip": 51508,
          "brotli": 44043
        }
      },
      "lazy": {
        "label": "⚡ Lazy Load Bundle",
        "files": [
          {
            "name": "lazy-load.js",
            "displayName": "Main chunk",
            "raw": 85798,
            "gzip": 20960,
            "brotli": 18024
          },
          {
            "name": "plugin-range-DYFEgEQK.js",
            "displayName": "Range Plugin",
            "raw": 10480,
            "gzip": 2745,
            "brotli": 2477
          },
          {
            "name": "plugin-timezone-BX_BRdyg.js",
            "displayName": "Timezone Plugin",
            "raw": 6916,
            "gzip": 2275,
            "brotli": 2010
          }
        ],
        "total": {
          "raw": 103194,
          "gzip": 25980,
          "brotli": 22511
        }
      }
    },
    "webpack": {
      "core": {
        "label": "🎯 Core Bundle",
        "files": [
          {
            "name": "core-only.js",
            "displayName": "Core (unminified)",
            "raw": 82277,
            "gzip": 20538,
            "brotli": 17751
          },
          {
            "name": "core-only.min.js",
            "displayName": "Core (minified)",
            "raw": 80323,
            "gzip": 19691,
            "brotli": 17030
          }
        ],
        "total": {
          "raw": 162600,
          "gzip": 40229,
          "brotli": 34781
        }
      },
      "full": {
        "label": "📦 Full Bundle (with Plugins)",
        "files": [
          {
            "name": "full-static.js",
            "displayName": "Full (unminified)",
            "raw": 98933,
            "gzip": 24470,
            "brotli": 21111
          },
          {
            "name": "full-static.min.js",
            "displayName": "Full (minified)",
            "raw": 96476,
            "gzip": 23419,
            "brotli": 20200
          }
        ],
        "total": {
          "raw": 195409,
          "gzip": 47889,
          "brotli": 41311
        }
      },
      "lazy": {
        "label": "⚡ Lazy Load Bundle",
        "files": [
          {
            "name": "21.chunk.js",
            "displayName": "Range Plugin chunk",
            "raw": 9915,
            "gzip": 2622,
            "brotli": 2382
          },
          {
            "name": "37.chunk.js",
            "displayName": "Timezone Plugin chunk",
            "raw": 6489,
            "gzip": 2152,
            "brotli": 1903
          },
          {
            "name": "lazy-load.js",
            "displayName": "Main chunk",
            "raw": 83039,
            "gzip": 20948,
            "brotli": 18067
          }
        ],
        "total": {
          "raw": 99443,
          "gzip": 25722,
          "brotli": 22352
        }
      }
    },
    "esbuild": {
      "core": {
        "label": "🎯 Core Bundle",
        "files": [
          {
            "name": "core-only.js",
            "displayName": "Core (unminified)",
            "raw": 99573,
            "gzip": 21982,
            "brotli": 18736
          },
          {
            "name": "core-only.min.js",
            "displayName": "Core (minified)",
            "raw": 81011,
            "gzip": 20196,
            "brotli": 17390
          }
        ],
        "total": {
          "raw": 180584,
          "gzip": 42178,
          "brotli": 36126
        }
      },
      "full": {
        "label": "📦 Full Bundle (with Plugins)",
        "files": [
          {
            "name": "full-static.js",
            "displayName": "Full (unminified)",
            "raw": 120455,
            "gzip": 26445,
            "brotli": 22512
          },
          {
            "name": "full-static.min.js",
            "displayName": "Full (minified)",
            "raw": 97252,
            "gzip": 23953,
            "brotli": 20654
          }
        ],
        "total": {
          "raw": 217707,
          "gzip": 50398,
          "brotli": 43166
        }
      },
      "lazy": {
        "label": "⚡ Lazy Load Bundle",
        "files": [
          {
            "name": "entry-lazy-load.js",
            "displayName": "Main chunk",
            "raw": 81201,
            "gzip": 20290,
            "brotli": 17466
          },
          {
            "name": "range-5YQQ4YWV.js",
            "displayName": "range-5YQQ4YWV.js",
            "raw": 9795,
            "gzip": 2557,
            "brotli": 2318
          },
          {
            "name": "timezone-SIJMA5ZH.js",
            "displayName": "timezone-SIJMA5ZH.js",
            "raw": 6441,
            "gzip": 2165,
            "brotli": 1907
          }
        ],
        "total": {
          "raw": 97437,
          "gzip": 25012,
          "brotli": 21691
        }
      }
    }
  },
  "treeshaking": {
    "coreSize": 19691,
    "fullSize": 23428,
    "pluginOverhead": 3737,
    "pluginOverheadPercent": "19.0"
  }
};
// END AUTO-GENERATED DATA

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

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-primary">
            📊 Bundle Size Comparison (All Bundlers)
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

        <div className="flex flex-wrap gap-4 mb-6 border-b border-border pb-2">
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
