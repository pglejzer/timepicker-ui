"use client";

import { useEffect, useRef, useState, useMemo, useId } from "react";
import type { KeyboardEvent } from "react";
import { CodeBlock } from "@/components/code-block";
import { Eye, Code2, ArrowRight } from "lucide-react";
import { TimepickerUI } from "timepicker-ui";

interface ConfirmEventData {
  hour?: string;
  minutes?: string;
  type?: string;
}

interface RangeConfirmEventData {
  from: string;
  to: string;
  duration: number;
}

interface TimepickerExampleProps {
  code: string;
  options?: Record<string, unknown>;
  inputPlaceholder?: string;
  showCode?: boolean;
  plugins?: Array<"range" | "timezone" | "wheel">;
}

export function TimepickerExample({
  code,
  options = {},
  inputPlaceholder = "Select time",
  showCode = true,
  plugins = [],
}: TimepickerExampleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [currentValue, setCurrentValue] = useState<string>("");
  const [rangeValue, setRangeValue] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const uniqueId = useId();
  const previewTabRef = useRef<HTMLButtonElement>(null);
  const codeTabRef = useRef<HTMLButtonElement>(null);

  // APG tabs: Left/Right (and Home/End) move between the two tabs, selection
  // follows focus, and we move DOM focus to the newly selected tab.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next: "preview" | "code" | null = null;
    if (e.key === "ArrowRight" || e.key === "End") {
      next = "code";
    } else if (e.key === "ArrowLeft" || e.key === "Home") {
      next = "preview";
    }
    if (!next) return;
    e.preventDefault();
    setViewMode(next);
    (next === "preview" ? previewTabRef : codeTabRef).current?.focus();
  };

  // Serialize the options so the picker is only recreated when the option
  // values actually change, not on every render that passes a new object
  // literal. The serialized key is the real dependency here.
  const optionsKey = JSON.stringify(options);
  const pluginsKey = plugins.join(",");
  const memoizedOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- optionsKey tracks `options` by value; depending on `options` directly would re-memo on every render
    [optionsKey],
  );

  useEffect(() => {
    (async () => {
      const { TimepickerUI, PluginRegistry } = await import("timepicker-ui");

      if (plugins.includes("range")) {
        const { RangePlugin } = await import("timepicker-ui/plugins/range");
        PluginRegistry.register(RangePlugin);
      }
      if (plugins.includes("timezone")) {
        const { TimezonePlugin } =
          await import("timepicker-ui/plugins/timezone");
        PluginRegistry.register(TimezonePlugin);
      }
      if (plugins.includes("wheel")) {
        const { WheelPlugin } = await import("timepicker-ui/plugins/wheel");
        PluginRegistry.register(WheelPlugin);
      }

      if (
        typeof window === "undefined" ||
        !inputRef.current ||
        viewMode !== "preview"
      ) {
        return;
      }

      try {
        if (pickerRef.current) {
          pickerRef.current.destroy();
          pickerRef.current = null;
        }

        const rangeEnabled =
          plugins.includes("range") ||
          (memoizedOptions.range as { enabled?: boolean } | undefined)
            ?.enabled === true;

        const picker = new TimepickerUI(inputRef.current, {
          ...memoizedOptions,
          callbacks: {
            ...(memoizedOptions.callbacks as
              | Record<string, unknown>
              | undefined),
            onConfirm: (data: ConfirmEventData) => {
              if (rangeEnabled) return;
              const time =
                data.hour && data.minutes
                  ? `${data.hour}:${data.minutes}${
                      data.type ? ` ${data.type}` : ""
                    }`
                  : "";
              setCurrentValue(time);
              const originalCallback = (
                memoizedOptions.callbacks as Record<string, unknown> | undefined
              )?.onConfirm;
              if (typeof originalCallback === "function") {
                (originalCallback as (data: ConfirmEventData) => void)(data);
              }
            },
            onRangeConfirm: (data: RangeConfirmEventData) => {
              setRangeValue({ from: data.from, to: data.to });
              setCurrentValue("");
              const originalCallback = (
                memoizedOptions.callbacks as Record<string, unknown> | undefined
              )?.onRangeConfirm;
              if (typeof originalCallback === "function") {
                (originalCallback as (data: RangeConfirmEventData) => void)(
                  data,
                );
              }
            },
          },
        });

        picker.create();
        pickerRef.current = picker;
      } catch (error) {
        console.error("Failed to load timepicker:", error);
      }
    })();

    return () => {
      if (pickerRef.current) {
        try {
          pickerRef.current.destroy();
          pickerRef.current = null;
        } catch (error) {
          console.error("Error destroying timepicker:", error);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pluginsKey tracks `plugins` by value; `plugins` is a new array literal each render
  }, [memoizedOptions, viewMode, pluginsKey]);

  // The live preview panel — shared by both the tabbed and code-less layouts.
  const preview = (
    <div className="relative overflow-hidden bg-muted/20 p-8 sm:p-10">
      {/* Atmospheric blueprint backdrop (theme-aware, non-interactive). */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="relative mx-auto max-w-sm space-y-4">
        <div>
          <label
            htmlFor={uniqueId}
            className="eyebrow mb-2 block"
          >
            Select time
          </label>
          <input
            ref={inputRef}
            type="text"
            id={uniqueId}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
        </div>
        {rangeValue && (
          <div className="flex items-center justify-between rounded-lg border border-ok/30 bg-ok/10 px-3 py-2.5 text-sm">
            <span className="eyebrow text-ok">Range</span>
            <span className="nums inline-flex items-center gap-1.5 text-foreground">
              {rangeValue.from}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              {rangeValue.to}
            </span>
          </div>
        )}
        {currentValue && !rangeValue && (
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm">
            <span className="eyebrow text-primary">Selected</span>
            <span className="nums text-foreground">{currentValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  // When code is hidden, render the bare preview card — no tabs, no toolbar.
  if (!showCode) {
    return (
      <div className="bench-in overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {preview}
      </div>
    );
  }

  return (
    <div className="bench-in overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Toolbar with segmented control */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-3 py-2">
        <div
          role="tablist"
          aria-label="Preview and code"
          className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 p-0.5"
        >
          <button
            ref={previewTabRef}
            type="button"
            role="tab"
            id={`${uniqueId}-tab-preview`}
            aria-controls={`${uniqueId}-panel-preview`}
            aria-selected={viewMode === "preview"}
            tabIndex={viewMode === "preview" ? 0 : -1}
            onClick={() => setViewMode("preview")}
            onKeyDown={onTabKeyDown}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              viewMode === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Preview
          </button>
          <button
            ref={codeTabRef}
            type="button"
            role="tab"
            id={`${uniqueId}-tab-code`}
            aria-controls={`${uniqueId}-panel-code`}
            aria-selected={viewMode === "code"}
            tabIndex={viewMode === "code" ? 0 : -1}
            onClick={() => setViewMode("code")}
            onKeyDown={onTabKeyDown}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              viewMode === "code"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            Code
          </button>
        </div>
        <span className="eyebrow hidden sm:inline">Live</span>
      </div>

      {/* Preview panel — kept mounted so the live picker instance persists. */}
      <div
        role="tabpanel"
        id={`${uniqueId}-panel-preview`}
        aria-labelledby={`${uniqueId}-tab-preview`}
        hidden={viewMode !== "preview"}
      >
        {preview}
      </div>

      {/* Code panel */}
      <div
        role="tabpanel"
        id={`${uniqueId}-panel-code`}
        aria-labelledby={`${uniqueId}-tab-code`}
        tabIndex={0}
        hidden={viewMode !== "code"}
        className="p-3"
      >
        <CodeBlock code={code} language="typescript" />
      </div>
    </div>
  );
}
