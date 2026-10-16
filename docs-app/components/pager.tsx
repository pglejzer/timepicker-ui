"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDocsPager } from "@/lib/nav";
import styles from "./pager.module.css";

export function Pager() {
  const pathname = usePathname() ?? "";
  const { prev, next } = getDocsPager(pathname);
  if (!prev && !next) return null;

  return (
    <nav aria-label="Previous and next page" className={styles.pager}>
      {prev ? (
        <Link href={prev.href} className={styles.link}>
          <span className={styles.label}>Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={`${styles.link} ${styles.next}`}>
          <span className={styles.label}>Next</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
