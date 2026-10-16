import { formatBytes } from "./types";
import { CriteriaItem } from "./CriteriaItem";
import styles from "./SummaryStats.module.css";

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
    <section aria-label="Bundle overview">
      <dl className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <dt className={styles.label}>{s.label}</dt>
            <dd className={styles.value}>{s.value}</dd>
            <dd className={styles.note}>{s.note}</dd>
          </div>
        ))}
      </dl>

      {criteria && criteria.length > 0 && (
        <>
          <h2 className={styles.heading}>Success criteria</h2>
          <ul className={styles.criteria}>
            {criteria.map((item, index) => (
              <CriteriaItem key={index} passed={item.passed} text={item.text} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
