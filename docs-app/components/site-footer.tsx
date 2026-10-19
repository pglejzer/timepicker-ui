import Link from "next/link";
import { Logo } from "@/components/logo";
import { ISSUES_URL, LIBRARY_VERSION, NPM_URL, REPO_URL } from "@/lib/site";
import styles from "./site-footer.module.css";

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Docs",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "Options", href: "/docs/api/options" },
      { label: "Events", href: "/docs/api/events" },
    ],
  },
  {
    title: "Examples",
    links: [
      { label: "Themes", href: "/examples/themes/basic" },
      { label: "Plugins", href: "/examples/plugins/range" },
      { label: "React", href: "/react" },
      { label: "Datepicker", href: "/datepicker" },
      { label: "Bundle size", href: "/bundle-stats" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: REPO_URL, external: true },
      { label: "npm", href: NPM_URL, external: true },
      { label: "Issues", href: ISSUES_URL, external: true },
      { label: "Changelog", href: "/docs/changelog" },
      { label: "Roadmap", href: "/docs/roadmap" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.about}>
          <Link href="/" className={styles.brand}>
            <Logo size={20} />
            timepicker-ui
          </Link>
          <p>A time picker for the web with an analog clock, a scroll wheel and a compact wheel.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className={styles.heading}>{column.title}</h2>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.legal}>
        <span>© {year} Piotr Glejzer · MIT License</span>
        <span>timepicker-ui {LIBRARY_VERSION}</span>
      </div>
    </footer>
  );
}
