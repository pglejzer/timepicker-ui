"use client";

import { Moon, Sun, Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  const NavLinks = () => (
    <>
      <Link
        href="/docs"
        className="transition-colors hover:text-primary"
        onClick={() => setMobileMenuOpen(false)}
      >
        Documentation
      </Link>
      <Link
        href="/examples"
        className="transition-colors hover:text-primary"
        onClick={() => setMobileMenuOpen(false)}
      >
        Examples
      </Link>
      {process.env.NODE_ENV === "development" && (
        <Link
          href="/playground"
          className="transition-colors hover:text-primary"
          onClick={() => setMobileMenuOpen(false)}
        >
          Playground
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Timepicker-UI
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>
      )}
    </header>
  );
}
