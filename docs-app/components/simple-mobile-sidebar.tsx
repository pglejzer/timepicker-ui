"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function SimpleMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-simple-mobile-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-simple-mobile-sidebar", handleToggle);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden animate-in fade-in duration-200"
            onClick={closeMenu}
          />
          <div className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[85vw] bg-background shadow-2xl md:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  href="/docs"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  Documentation
                </Link>
                <Link
                  href="/examples"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  Examples
                </Link>
                <Link
                  href="/react"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  React
                </Link>
                <Link
                  href="/bundle-stats"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  Bundle Analysis
                </Link>
                <div className="border-t border-border my-2" />
                <a
                  href="https://github.com/pglejzer/timepicker-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/timepicker-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={closeMenu}
                >
                  npm Package
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
