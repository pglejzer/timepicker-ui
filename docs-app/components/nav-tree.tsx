"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavSection } from "@/lib/nav";
import styles from "./nav-tree.module.css";

type NavTreeProps = {
  sections: NavSection[];
  onNavigate?: () => void;
  collapseInactive?: boolean;
};

export function NavTree({ sections, onNavigate, collapseInactive = false }: NavTreeProps) {
  const pathname = usePathname();

  return (
    <div className={styles.tree}>
      {sections.map((section) => {
        const containsCurrent = section.links.some((link) => link.href === pathname);
        return (
          <details
            key={section.title}
            className={styles.group}
            open={!collapseInactive || containsCurrent}
          >
            <summary className={styles.summary}>{section.title}</summary>
            <ul className={styles.list}>
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.link}
                    >
                      {link.title}
                      <span className={styles.badge} aria-hidden="true">
                        ↗
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={styles.link}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      {link.title}
                      {link.badge && <span className={styles.badge}>({link.badge})</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
