"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav, findNavMeta } from "@/lib/nav";
import styles from "./breadcrumb.module.css";

export function Breadcrumb() {
  const pathname = usePathname() ?? "";
  const { section, title } = findNavMeta(docsNav, pathname);

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        <li>
          <Link href="/docs">Docs</Link>
        </li>
        {section && <li>{section}</li>}
        {title && <li aria-current="page">{title}</li>}
      </ol>
    </nav>
  );
}
