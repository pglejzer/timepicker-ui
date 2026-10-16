"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { LIBRARY_VERSION, NPM_URL, REPO_URL } from "@/lib/site";
import { toggleDarkMode, useDarkMode } from "@/lib/use-dark-mode";
import styles from "./site-header.module.css";

const NAV = [
  { href: "/docs", label: "Docs", match: (p: string) => p.startsWith("/docs") && !p.startsWith("/docs/changelog") },
  { href: "/examples", label: "Examples", match: (p: string) => p.startsWith("/examples") },
  { href: "/playground", label: "Playground", match: (p: string) => p.startsWith("/playground") },
  { href: "/react", label: "React", match: (p: string) => p.startsWith("/react") },
  { href: "/docs/changelog", label: "Changelog", match: (p: string) => p.startsWith("/docs/changelog") },
];

const openSearch = () => window.dispatchEvent(new CustomEvent("open-command-menu"));
const openMenu = () => window.dispatchEvent(new CustomEvent("open-mobile-menu"));

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const isDark = useDarkMode();

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="timepicker-ui home">
          <Logo size={22} />
          <span>timepicker-ui</span>
        </Link>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              aria-current={item.match(pathname) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.search}
            onClick={openSearch}
            aria-label="Search the docs"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <SearchIcon size={18} />
            <span className={styles.searchLabel} aria-hidden="true">
              Search the docs
            </span>
            <kbd className={styles.kbd} aria-hidden="true">
              ⌘K
            </kbd>
          </button>
          <a href={NPM_URL} target="_blank" rel="noreferrer" className={styles.version}>
            {LIBRARY_VERSION}
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={styles.textLink}>
            GitHub
          </a>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.themeButton}`}
            onClick={toggleDarkMode}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            onClick={openMenu}
            aria-label="Open navigation"
            aria-haspopup="dialog"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
