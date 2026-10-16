import type { ReactNode } from "react";
import { RelatedLinks } from "@/components/related-links";
import styles from "./page-header.module.css";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({ title, description, badge, meta }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      {description && <p className={styles.lede}>{description}</p>}
      <RelatedLinks />
      {meta && <div className={styles.meta}>{meta}</div>}
    </header>
  );
}
