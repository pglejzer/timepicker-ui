import styles from "./ComparisonMetric.module.css";

export function ComparisonMetric({
  label,
  value,
  description,
  badge,
  fraction,
}: {
  label: string;
  value: string;
  description: string;
  badge?: string;
  /** Optional ranked bar, as a fraction (0–1) of the row width. */
  fraction?: number;
}) {
  const pct = typeof fraction === "number" ? Math.max(2, Math.min(100, fraction * 100)) : null;

  return (
    <div className={styles.metric}>
      <dt className={styles.label}>
        {label}
        {badge && <em className={styles.badge}>{badge}</em>}
      </dt>
      <dd className={styles.value}>{value}</dd>
      <dd className={styles.description}>{description}</dd>
      {pct !== null && (
        <dd className={styles.meter} aria-hidden="true">
          <span className={styles.fill} style={{ width: `${pct.toFixed(1)}%` }} />
        </dd>
      )}
    </div>
  );
}
