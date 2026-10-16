import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundClock } from "@/components/not-found-clock";
import { NotFoundSearch } from "@/components/not-found-search";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Page not found",
  robots: { index: false, follow: true },
};

const quickLinks = [
  { label: "Docs", note: "Guides & API", href: "/docs" },
  { label: "Examples", note: "Live demos", href: "/examples" },
  { label: "Bundle stats", note: "Size breakdown", href: "/bundle-stats" },
];

/**
 * Global 404. It lives outside the `(site)` route group, so it renders under the
 * root layout with no site header or footer. The quick links below replace them.
 * The clock reads 4:04 (404 as a time) and is decorative: the real message is in the h1.
 */
export default function NotFound() {
  return (
    <main id="main-content" className={styles.main}>
      <div className={styles.inner}>
        <div className={styles.clock}>
          <NotFoundClock />
        </div>

        <p className={styles.readout}>4:04</p>

        <h1 className={styles.title}>
          <span className="sr-only">404 - page not found. </span>
          This moment doesn&apos;t exist.
        </h1>

        <p className={styles.lede}>
          The page you&apos;re after is out of time. The clock kept ticking, but the URL did not.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Back to home
          </Link>
          <NotFoundSearch />
        </div>

        <nav aria-label="Quick links" className={styles.quick}>
          <ul className={styles.links}>
            {quickLinks.map((l) => (
              <li key={l.href} className={styles.item}>
                <Link href={l.href} className={styles.link}>
                  {l.label}
                </Link>
                <span className={styles.note}>{l.note}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
