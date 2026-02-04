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
  return (
    <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 md:p-8 mb-8 transition-colors">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-primary">
        Bundle Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          value={formatBytes(rollupCore)}
          label="Core Bundle"
          description="Minimum production size"
        />
        <StatCard
          value={formatBytes(rollupFull)}
          label="Full Bundle"
          description="With all plugins"
        />
        <StatCard
          value={formatBytes(pluginOverhead)}
          label="Plugin Cost"
          description="Additional overhead"
        />
        <StatCard
          value={`${((pluginOverhead / rollupCore) * 100).toFixed(1)}%`}
          label="Overhead Ratio"
          description="Relative increase"
        />
      </div>

      {criteria && criteria.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4 mt-8 text-foreground">
            Success Criteria
          </h3>
          <ul className="space-y-2">
            {criteria.map((item, index) => (
              <CriteriaItem key={index} passed={item.passed} text={item.text} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StatCard({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
        {value}
      </div>
      <div className="text-xs text-foreground uppercase font-semibold mb-1">
        {label}
      </div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
