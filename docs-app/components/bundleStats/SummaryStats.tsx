import { formatBytes } from "./types";
import { CriteriaItem } from "./CriteriaItem";

export function SummaryStats({
  rollupCore,
  rollupFull,
  pluginOverhead,
  criteria,
}: {
  rollupCore: number;
  rollupFull: number;
  pluginOverhead: number;
  criteria?: Array<{ passed: boolean; text: string }>;
}) {
  const stats = [
    {
      value: formatBytes(rollupCore),
      label: "Core bundle",
      note: "Minimum production size",
    },
    {
      value: formatBytes(rollupFull),
      label: "Full bundle",
      note: "With all plugins",
    },
    {
      value: formatBytes(pluginOverhead),
      label: "Plugin cost",
      note: "Additional overhead",
    },
    {
      value: `${((pluginOverhead / rollupCore) * 100).toFixed(1)}%`,
      label: "Overhead ratio",
      note: "Relative increase",
    },
  ];

  return (
    <section
      aria-label="Bundle overview"
      className="rounded-xl border border-border bg-card"
    >
      {/* Instrument panel - divided columns, big tabular numerals. */}
      <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-7">
            <div className="nums text-2xl font-semibold text-foreground sm:text-3xl">
              {s.value}
            </div>
            <div className="eyebrow mt-2">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.note}</div>
          </div>
        ))}
      </div>

      {criteria && criteria.length > 0 && (
        <div className="border-t border-border p-6">
          <p className="eyebrow">Success criteria</p>
          <ul className="mt-4 space-y-2">
            {criteria.map((item, index) => (
              <CriteriaItem key={index} passed={item.passed} text={item.text} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

