import type { ReactNode } from "react";
import { slugify } from "@/lib/slugify";
import styles from "./section.module.css";

type SectionProps = {
  title: string;
  description?: ReactNode;
  id?: string;
  children: ReactNode;
};

export function Section({ title, description, id, children }: SectionProps) {
  const anchor = id ?? slugify(title);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 id={anchor} className={styles.title}>
          {title}
        </h2>
        <a href={`#${anchor}`} className={styles.anchor} aria-label={`Link to section: ${title}`}>
          #
        </a>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
}
