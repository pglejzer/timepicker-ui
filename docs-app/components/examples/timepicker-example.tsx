"use client";

import { useEffect, useRef, useState, useMemo, useId } from "react";
import { CodeBlock } from "@/components/code-block";
import { Eye, Code } from "lucide-react";
import { TimepickerUI } from "timepicker-ui";

interface TimepickerExampleProps {
  code: string;
  options?: Record<string, unknown>;
  inputPlaceholder?: string;
  showCode?: boolean;
}

export function TimepickerExample({
  code,
  options = {},
  inputPlaceholder = "Select time",
  showCode = true,
}: TimepickerExampleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [currentValue, setCurrentValue] = useState<string>("");
  const uniqueId = useId();

  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  useEffect(() => {
    (async () => {
      const { TimepickerUI } = await import("timepicker-ui");
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

        const picker = new TimepickerUI(inputRef.current, {
          ...memoizedOptions,
          onConfirm: (data) => {
            const time =
              data.hour && data.minutes
                ? `${data.hour}:${data.minutes}${
                    data.type ? ` ${data.type}` : ""
                  }`
                : "";
            setCurrentValue(time);
            if (
              memoizedOptions.onConfirm &&
              typeof memoizedOptions.onConfirm === "function"
            ) {
              (memoizedOptions.onConfirm as (data: unknown) => void)(data);
            }
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
  }, [memoizedOptions, viewMode]);

  return (
    <div className="space-y-4">
      {showCode && (
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "preview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "code"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="h-4 w-4" />
            Code
          </button>
        </div>
      )}

      {viewMode === "preview" ? (
        <div className="rounded-lg border border-border bg-muted/30 p-8">
          <div className="mx-auto max-w-sm space-y-4">
            <div>
              <label
                htmlFor={uniqueId}
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Select time
              </label>
              <input
                ref={inputRef}
                type="text"
                id={uniqueId}
                placeholder={inputPlaceholder}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {currentValue && (
              <div className="rounded-lg bg-primary/10 p-3 text-sm">
                <span className="font-medium text-primary">Selected: </span>
                <span className="text-foreground">{currentValue}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <CodeBlock code={code} language="typescript" />
      )}
    </div>
  );
}
