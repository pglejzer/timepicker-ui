"use client";

import { SearchIcon } from "@/components/icons";
import styles from "./not-found-search.module.css";

/**
 * Opens the global command menu. It is mounted in the root layout and listens for
 * the `open-command-menu` window event (and Cmd/Ctrl+K), so search works on the
 * 404 even though that page has no site header. The dispatch lives in a click
 * handler, never at module scope, so the component stays SSR-safe.
 */
export function NotFoundSearch() {
  return (
    <button
      type="button"
      aria-keyshortcuts="Control+K Meta+K"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
      className={styles.button}
    >
      <SearchIcon size={18} />
      Search the docs
      <kbd aria-hidden="true" className={styles.kbd}>
        ⌘K
      </kbd>
    </button>
  );
}
