"use client";

import { Command, Search } from "lucide-react";

/**
 * Opens the global command menu, which is mounted at the root layout level and
 * listens for the `open-command-menu` window event (and Cmd/Ctrl+K) regardless
 * of route - so it still works from the 404 cover even though the header is
 * visually hidden. SSR-safe: the dispatch lives in a click handler, never at
 * module scope.
 */
export function NotFoundSearch() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      Search the docs
      <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground sm:flex">
        <Command className="h-3 w-3" aria-hidden="true" />K
      </kbd>
    </button>
  );
}

