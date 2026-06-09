"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import Link from "next/link";

interface MobileSidebarProps {
  children: ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // The element that had focus when the sidebar opened (the header trigger),
  // so focus can be restored to it on close.
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        if (!prev) {
          triggerRef.current = document.activeElement as HTMLElement | null;
        }
        return !prev;
      });
    };
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  // Open behaviour: lock body scroll, move focus into the panel, trap Tab,
  // close on Escape. All DOM access is inside the effect (SSR-safe).
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Restore focus to the trigger when the sidebar closes.
  useEffect(() => {
    if (isOpen) return;
    triggerRef.current?.focus?.();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 md:hidden animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="app-scroll fixed inset-y-0 left-0 z-[60] w-80 max-w-[85vw] bg-background shadow-2xl md:hidden overflow-y-auto animate-in slide-in-from-left duration-300"
      >
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            ref={closeButtonRef}
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

        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
