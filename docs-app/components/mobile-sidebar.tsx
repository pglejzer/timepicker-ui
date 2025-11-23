"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";

interface MobileSidebarProps {
  children: ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[85vw] bg-background shadow-2xl md:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-border p-4">
              <nav className="flex flex-col gap-3">
                <Link
                  href="/docs"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>
                <Link
                  href="/examples"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Examples
                </Link>
                <Link
                  href="/react"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  React
                </Link>
              </nav>
            </div>

            <div className="p-4" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}
