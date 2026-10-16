"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { NavTree } from "@/components/nav-tree";
import { areaOf, navByArea } from "@/lib/nav";
import { LIBRARY_VERSION, REPO_URL } from "@/lib/site";
import { toggleDarkMode, useDarkMode } from "@/lib/use-dark-mode";
import styles from "./mobile-menu.module.css";

const isPlayground = (pathname: string) => pathname.startsWith("/playground");

const AREAS: { href: string; label: string; match: (pathname: string) => boolean }[] = [
  { href: "/docs", label: "Docs", match: (p) => areaOf(p) === "docs" && !isPlayground(p) },
  { href: "/examples", label: "Examples", match: (p) => areaOf(p) === "examples" },
  { href: "/playground", label: "Playground", match: isPlayground },
  { href: "/react", label: "React", match: (p) => areaOf(p) === "react" },
];

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname() ?? "/";
  const area = areaOf(pathname);
  const isDark = useDarkMode();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const open = () => {
      if (dialog.open) return;
      const root = document.documentElement;
      root.style.setProperty("--page-scrollbar", `${window.innerWidth - root.clientWidth}px`);
      dialog.showModal();
    };
    const desktop = window.matchMedia("(min-width: 60rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) dialog.close();
    };
    window.addEventListener("open-mobile-menu", open);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("open-mobile-menu", open);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-label="Navigation">
      <div className={styles.top}>
        <span className={styles.brand}>
          <Logo size={20} />
          timepicker-ui
        </span>
        <button type="button" className={styles.iconButton} onClick={close} aria-label="Close navigation">
          <CloseIcon />
        </button>
      </div>
      <nav aria-label="Sections" className={styles.areas}>
        {AREAS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.area}
            aria-current={item.match(pathname) ? "true" : undefined}
            onClick={close}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Pages" className={styles.tree}>
        <NavTree sections={navByArea[area]} onNavigate={close} collapseInactive />
      </nav>
      <div className={styles.footer}>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className={styles.version}>{LIBRARY_VERSION}</span>
        <button type="button" className={styles.themeButton} onClick={toggleDarkMode}>
          {isDark ? "Light" : "Dark"}
        </button>
      </div>
    </dialog>
  );
}
