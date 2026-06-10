"use client";

import { Moon, Sun, Github, Menu, Search, Command } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { useDarkMode } from "@/lib/use-dark-mode";

const NAV = [
  { href: "/docs", label: "Docs", match: "/docs" },
  { href: "/examples", label: "Examples", match: "/examples" },
  { href: "/react", label: "React", match: "/react" },
];

export function Header() {
  const isDark = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // The progress hairline writes to a CSS variable on this ref every frame,
  // so the page-scroll motion never re-renders the React tree.
  const headerRef = useRef<HTMLElement | null>(null);

  const hasDocsSidebar =
    pathname?.startsWith("/docs") ||
    pathname?.startsWith("/examples") ||
    pathname?.startsWith("/react");

  // One consolidated, passive + rAF-throttled scroll handler. It updates the
  // `scrolled` flag (only when it flips) and writes the 0..1 reading-progress
  // ratio straight to a CSS custom property via the ref - no per-frame setState.
  useEffect(() => {
    let frame = 0;
    let lastScrolled = false;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;

      const next = y > 8;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setScrolled(next);
      }

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      headerRef.current?.style.setProperty("--scroll-progress", String(ratio));
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toggleDark = () => {
    const nextDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  const handleMobileSidebarOpen = () => {
    if (hasDocsSidebar) {
      window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
    } else {
      window.dispatchEvent(new CustomEvent("toggle-simple-mobile-sidebar"));
    }
  };

  const openSearch = () =>
    window.dispatchEvent(new CustomEvent("open-command-menu"));

  return (
    <header
      ref={headerRef}
      data-scrolled={scrolled ? "" : undefined}
      className="site-header sticky top-0 z-50 w-full border-b border-border"
    >
      {/*
        Outer header height is FIXED (h-16) so a sticky shrink never reflows the
        page below it. Only the inner bar condenses (h-16 -> h-14) and the
        backdrop / border / shadow sharpen on scroll - all GPU/compositor work.
      */}
      <div className="site-header-bar container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-7">
          <button
            onClick={handleMobileSidebarOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="site-wordmark group flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="timepicker-ui home"
          >
            <span className="site-logo">
              <Logo />
            </span>
            <span className="font-mono text-[15px] font-semibold tracking-tight">
              timepicker
              <span className="text-muted-foreground">-ui</span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 text-sm font-medium md:flex"
          >
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.match) ?? false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  data-active={active ? "" : undefined}
                  className="site-nav-link rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active]:text-foreground"
                >
                  {item.label}
                  <span className="site-nav-tick" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openSearch}
            className="hidden h-10 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="ml-2 flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px] tracking-wider opacity-80">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
          <button
            onClick={openSearch}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:hidden"
            aria-label="Search documentation"
          >
            <Search className="h-5 w-5" />
          </button>

          <a
            href="https://www.npmjs.com/package/timepicker-ui"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex sm:h-10"
            aria-label="npm version"
          >
            v4.4.0
          </a>

          <button
            onClick={toggleDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <a
            href="https://github.com/pglejzer/timepicker-ui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Reading-progress hairline pinned to the header's bottom edge. Purely
          decorative; tracks document scroll 0..1 via --scroll-progress. */}
      <span className="site-header-progress" aria-hidden="true" />
    </header>
  );
}

