import styles from "./OptimizationCard.module.css";

export function OptimizationCard({
  passed,
  title,
  description,
  metric,
}: {
  passed: boolean;
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <div className={styles.check}>
      <dt className={styles.title}>
        {title} <em className={styles.status}>{passed ? "pass" : "fail"}</em>
      </dt>
      <dd className={styles.description}>{description}</dd>
      <dd className={styles.metric}>{metric}</dd>
    </div>
  );
}
