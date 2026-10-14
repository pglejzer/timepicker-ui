"use client";

import { useEffect } from "react";
import type { TimepickerUI } from "timepicker-ui";

declare global {
  interface Window {
    TimepickerUI?: typeof TimepickerUI;
    __timepickerConsoleBanner?: boolean;
  }
}

const LOGO = [
  "████████╗██╗███╗   ███╗███████╗██████╗ ██╗ ██████╗██╗  ██╗███████╗██████╗",
  "╚══██╔══╝██║████╗ ████║██╔════╝██╔══██╗██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗",
  "   ██║   ██║██╔████╔██║█████╗  ██████╔╝██║██║     █████╔╝ █████╗  ██████╔╝",
  "   ██║   ██║██║╚██╔╝██║██╔══╝  ██╔═══╝ ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗",
  "   ██║   ██║██║ ╚═╝ ██║███████╗██║     ██║╚██████╗██║  ██╗███████╗██║  ██║ ui",
  "   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝",
].join("\n");

const TIP =
  "Tip: `TimepickerUI` is available in the console. Try `TimepickerUI.getAllInstances()` on any /examples page.";

// #527aff is the dark-mode --primary token; it stays readable on both light
// and dark DevTools backgrounds.
const LOGO_STYLE =
  "color: #527aff; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 1;";
const TIP_STYLE = "color: #527aff; font-family: monospace; font-size: 12px;";

export function ConsoleBanner() {
  useEffect(() => {
    // One print per page load: StrictMode re-runs effects in development and
    // the root layout can remount, but `window` lives until the next load.
    if (window.__timepickerConsoleBanner) return;
    window.__timepickerConsoleBanner = true;

    console.log(`%c\n${LOGO}\n`, LOGO_STYLE);

    // Lazy import keeps the library out of the first-load bundle and resolves
    // to the same module instance the example pages create their pickers from.
    import("timepicker-ui")
      .then(({ TimepickerUI }) => {
        window.TimepickerUI = TimepickerUI;
        console.log(`%c${TIP}`, TIP_STYLE);
      })
      .catch(() => undefined);
  }, []);

  return null;
}
