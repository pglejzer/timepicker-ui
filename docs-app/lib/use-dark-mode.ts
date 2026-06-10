"use client";

import { useSyncExternalStore } from "react";

// Subscribe to the `dark` class on <html>. The theme is applied pre-paint by an
// inline script in the layout, so we read the live DOM state instead of holding
// it in component state - this avoids a setState-in-effect and a hydration
// mismatch. The server snapshot is always `false`, matching the first client
// render; `useSyncExternalStore` then re-reads the real value post-mount.
function subscribeToDarkClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getDarkServerSnapshot() {
  return false;
}

/**
 * Hydration-safe read of the site's dark-mode state. Returns `false` on the
 * server and during the first client render, then settles to the real DOM
 * value after mount and stays in sync via a MutationObserver on the `dark`
 * class of `<html>`.
 */
export function useDarkMode(): boolean {
  return useSyncExternalStore(
    subscribeToDarkClass,
    getDarkSnapshot,
    getDarkServerSnapshot,
  );
}
