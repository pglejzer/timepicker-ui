"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRelatedPages, type RelatedPages } from "@/lib/related-examples";
import styles from "./related-links.module.css";

const LABEL: Record<RelatedPages["kind"], string> = {
  examples: "Examples:",
  docs: "Docs:",
};

export function RelatedLinks() {
  const pathname = usePathname() ?? "";
  const related = getRelatedPages(pathname);
  if (!related) return null;

  return (
    <p className={styles.related}>
      <span className={styles.label}>{LABEL[related.kind]}</span>{" "}
      {related.links.map((link, index) => (
        <Fragment key={link.href}>
          {index > 0 && (
            <span aria-hidden="true" className={styles.separator}>
              {" · "}
            </span>
          )}
          <Link href={link.href}>{link.title}</Link>
        </Fragment>
      ))}
    </p>
  );
}
