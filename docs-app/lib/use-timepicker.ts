"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { TimepickerUI } from "timepicker-ui";
import { useDarkMode } from "@/lib/use-dark-mode";

export type PluginName = "range" | "timezone" | "wheel";

type Callback = (data: unknown) => void;

type UseTimepickerOptions = {
  inputRef: RefObject<HTMLInputElement | null>;
  containerRef?: RefObject<HTMLElement | null>;
  options?: Record<string, unknown>;
  plugins?: PluginName[];
  theme?: string;
  mobile?: boolean;
  onValue?: (value: string) => void;
  onReady?: () => void;
};

async function loadTimepicker(plugins: PluginName[]) {
  const { TimepickerUI, PluginRegistry } = await import("timepicker-ui");
  if (plugins.includes("range")) {
    const { RangePlugin } = await import("timepicker-ui/plugins/range");
    PluginRegistry.register(RangePlugin);
  }
  if (plugins.includes("timezone")) {
    const { TimezonePlugin } = await import("timepicker-ui/plugins/timezone");
    PluginRegistry.register(TimezonePlugin);
  }
  if (plugins.includes("wheel")) {
    const { WheelPlugin } = await import("timepicker-ui/plugins/wheel");
    PluginRegistry.register(WheelPlugin);
  }
  return TimepickerUI;
}

export function useTimepicker({
  inputRef,
  containerRef,
  options = {},
  plugins = [],
  theme,
  mobile = false,
  onValue,
  onReady,
}: UseTimepickerOptions) {
  const isDark = useDarkMode();
  const pickerRef = useRef<TimepickerUI | null>(null);
  const handlers = useRef({ onValue, onReady });

  useEffect(() => {
    handlers.current = { onValue, onReady };
  });

  const explicitTheme = (options.ui as { theme?: string } | undefined)?.theme;
  const effectiveTheme = theme ?? explicitTheme ?? (isDark ? "dark" : undefined);
  const optionsKey = JSON.stringify(options);
  const pluginsKey = plugins.join(",");
  const inline = containerRef !== undefined;

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef?.current ?? null;
    if (!input || (inline && !container)) return;

    let cancelled = false;
    let picker: TimepickerUI | null = null;
    const userCallbacks = (options.callbacks ?? {}) as Record<string, Callback | undefined>;
    const report = () =>
      window.requestAnimationFrame(() => handlers.current.onValue?.(input.value));
    const withReport =
      (name: string): Callback =>
      (data) => {
        report();
        userCallbacks[name]?.(data);
      };

    loadTimepicker(plugins)
      .then((Timepicker) => {
        if (cancelled) return;
        // Without a container the demo renders as a field, so the example's own inline config is
        // dropped: the library throws when an enabled inline config has no container in the page.
        const { inline: ownInline, ...ownUi } = (options.ui ?? {}) as Record<string, unknown>;
        const ui: Record<string, unknown> = { ...ownUi };
        if (effectiveTheme) ui.theme = effectiveTheme;
        if (mobile) ui.mobile = true;
        if (container) {
          const inlineOptions = (ownInline ?? {}) as Record<string, unknown>;
          ui.inline = {
            ...inlineOptions,
            enabled: true,
            container,
            autoUpdate: true,
            showButtons: inlineOptions.showButtons ?? true,
          };
        }
        const config = {
          ...options,
          ui,
          callbacks: {
            ...userCallbacks,
            onConfirm: withReport("onConfirm"),
            onUpdate: withReport("onUpdate"),
            onRangeConfirm: withReport("onRangeConfirm"),
            onClear: withReport("onClear"),
          },
        };
        picker = new Timepicker(input, config as ConstructorParameters<typeof Timepicker>[1]);
        picker.create();
        pickerRef.current = picker;
        report();
        handlers.current.onReady?.();
      })
      .catch((error: unknown) => {
        console.error("timepicker-ui failed to load", error);
      });

    return () => {
      cancelled = true;
      picker?.destroy();
      pickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options and plugins are compared by value through optionsKey and pluginsKey
  }, [optionsKey, pluginsKey, effectiveTheme, mobile, inline]);

  return pickerRef;
}
