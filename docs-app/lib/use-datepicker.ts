"use client";

import { useEffect, useRef, type RefObject } from "react";
import type DatepickerUI from "@pglejzer/datepicker-ui";
import type { BehaviorOptions, DatepickerOptions, UIOptions } from "@pglejzer/datepicker-ui";
import { isDatepickerTheme } from "@/lib/datepicker";
import { useDarkMode } from "@/lib/use-dark-mode";

export type UseDatepickerOptions = {
  inputRef: RefObject<HTMLInputElement | null>;
  containerRef?: RefObject<HTMLElement | null>;
  endInputRef?: RefObject<HTMLInputElement | null>;
  toggleRef?: RefObject<HTMLElement | null>;
  options?: DatepickerOptions;
  theme?: string;
  onValue?: (value: string) => void;
  onReady?: () => void;
  onPicker?: (picker: DatepickerUI | null) => void;
};

const NO_OPTIONS: DatepickerOptions = {};

function optionsKey(options: DatepickerOptions): string {
  return JSON.stringify(options, (_key, value: unknown) => {
    if (typeof value === "function") return `fn:${value.toString()}`;
    if (typeof Node !== "undefined" && value instanceof Node) return "node";
    return value;
  });
}

export function useDatepicker({
  inputRef,
  containerRef,
  endInputRef,
  toggleRef,
  options = NO_OPTIONS,
  theme,
  onValue,
  onReady,
  onPicker,
}: UseDatepickerOptions): RefObject<DatepickerUI | null> {
  const isDark = useDarkMode();
  const pickerRef = useRef<DatepickerUI | null>(null);
  const latest = useRef({ options, onValue, onReady, onPicker });

  useEffect(() => {
    latest.current = { options, onValue, onReady, onPicker };
  });

  const key = optionsKey(options);
  const ownScheme = options.ui?.colorScheme;
  const colorScheme = ownScheme ?? (isDark ? "dark" : "light");
  const inline = containerRef !== undefined;

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef?.current ?? null;
    if (!input || (inline && !container)) return;

    let cancelled = false;
    let picker: DatepickerUI | null = null;
    let frame = 0;
    const offs: Array<() => void> = [];
    const report = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => latest.current.onValue?.(input.value));
    };

    import("@pglejzer/datepicker-ui")
      .then(({ default: Datepicker }) => {
        if (cancelled) return;
        const own = latest.current.options;
        const ui: UIOptions = { ...own.ui, colorScheme };
        const behavior: BehaviorOptions = { ...own.behavior };
        if (theme && isDatepickerTheme(theme)) ui.theme = theme;
        if (container) {
          ui.inline = { ...own.ui?.inline, enabled: true, container };
          if (own.ui?.footer === undefined && own.behavior?.commitOnChange === undefined) {
            behavior.commitOnChange = true;
          }
        } else {
          delete ui.inline;
        }
        const endInput = endInputRef?.current;
        if (endInput) ui.endInput = endInput;
        const toggle = toggleRef?.current;
        if (toggle) ui.toggleButton = toggle;
        picker = new Datepicker(input, { ...own, ui, behavior });
        picker.create();
        offs.push(picker.on("confirm", report), picker.on("update", report));
        pickerRef.current = picker;
        latest.current.onPicker?.(picker);
        report();
        latest.current.onReady?.();
      })
      .catch((error: unknown) => {
        console.error("datepicker-ui failed to load", error);
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      offs.forEach((off) => off());
      picker?.destroy();
      pickerRef.current = null;
      latest.current.onPicker?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are compared by value through key
  }, [key, theme, colorScheme, inline]);

  return pickerRef;
}
