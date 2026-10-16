import { formatBytes } from "./types";
import styles from "./CompositionBar.module.css";

export interface CompositionSegment {
  label: string;
  bytes: number;
  /** Segment fill, from the darkest to the lightest ink token. */
  tone: "ink" | "ink2" | "ink3" | "hair";
}

const TICKS = Array.from({ length: 21 }, (_, index) => index);

/**
 * "Measuring-tape" composition bar: one segmented bar whose segments sum to
 * `total`, with a ruler scale under it. Plain CSS, no chart library.
 * Accessible via role="img" plus a visually hidden data table.
 */
export function CompositionBar({ segments, total }: { segments: CompositionSegment[]; total: number }) {
  const sum = segments.reduce((acc, s) => acc + s.bytes, 0);
  const denominator = total > 0 ? total : sum || 1;

  const ariaLabel = `Full bundle composition, ${formatBytes(denominator)} total: ${segments
    .map((s) => `${s.label} ${formatBytes(s.bytes)} (${((s.bytes / denominator) * 100).toFixed(0)}%)`)
    .join(", ")}.`;

  return (
    <div>
      <div role="img" aria-label={ariaLabel} className={styles.bar}>
        {segments.map((seg) => {
          const pct = (seg.bytes / denominator) * 100;
          return (
            <div
              key={seg.label}
              className={`${styles.seg} ${styles[seg.tone]}`}
              style={{ width: `${pct.toFixed(2)}%` }}
              aria-hidden="true"
            >
              <span className={styles.segLabel}>{pct >= 12 ? `${pct.toFixed(0)}%` : ""}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.ruler} aria-hidden="true">
        {TICKS.map((tick) => (
          <span key={tick} className={tick % 2 === 0 ? styles.major : styles.minor} />
        ))}
      </div>

      <dl className={styles.legend}>
        {segments.map((seg) => {
          const pct = (seg.bytes / denominator) * 100;
          return (
            <div key={seg.label} className={styles.item}>
              <dt className={styles.name}>
                <span className={`${styles.swatch} ${styles[seg.tone]}`} aria-hidden="true" />
                {seg.label}
              </dt>
              <dd className={styles.size}>
                {formatBytes(seg.bytes)} <span className={styles.share}>{pct.toFixed(0)}%</span>
              </dd>
            </div>
          );
        })}
      </dl>

      <table className="sr-only">
        <caption>Full bundle composition (gzipped)</caption>
        <thead>
          <tr>
            <th>Segment</th>
            <th>Size</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.label}>
              <td>{seg.label}</td>
              <td>{formatBytes(seg.bytes)}</td>
              <td>{((seg.bytes / denominator) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
