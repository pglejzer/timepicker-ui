import type { ReactNode } from "react";
import styles from "./ComparisonSection.module.css";

export function ComparisonSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <dl className={styles.list}>{children}</dl>
    </section>
  );
}
