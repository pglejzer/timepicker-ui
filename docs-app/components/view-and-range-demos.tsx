"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import "timepicker-ui/main.css";
import demo from "@/components/demo-controls.module.css";
import styles from "./companion-demos.module.css";

const MAX_LINES = 6;

export function ViewSwitchDemo() {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [view, setView] = useState("clock");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const picker = new TimepickerUI(input, { clock: { type: "24h" } });
    picker.create();
    picker.on("switch:view", (data) => {
      setView(data.view);
      setLines((previous) => [`switch:view ${data.view}`, ...previous].slice(0, MAX_LINES));
    });
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, []);

  const toggle = () => {
    const picker = pickerRef.current;
    if (!picker) return;
    const next = picker.getView() === "clock" ? "keyboard" : "clock";
    picker.setView(next);
    setView(next);
  };

  return (
    <div className={styles.stage}>
      <div className={demo.field}>
        <label htmlFor={fieldId} className={demo.label}>
          Select time
        </label>
        <input
          id={fieldId}
          ref={inputRef}
          type="text"
          className={demo.input}
          placeholder="Click to select time"
        />
        <div className={demo.row}>
          <button type="button" className={demo.button} onClick={toggle}>
            {view === "clock" ? "Keyboard" : "Clock"}
          </button>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() => pickerRef.current?.open()}
          >
            Open
          </button>
        </div>
      </div>
      <pre className={`${demo.output} ${styles.log}`} aria-live="polite">
        {lines.join("\n")}
      </pre>
    </div>
  );
}

export function ClearFromCodeDemo() {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const picker = new TimepickerUI(input, { clock: { type: "24h" } });
    picker.create();
    picker.on("clear", (data) => {
      setLines((previous) =>
        [`clear (previous: ${data.previousValue ?? "none"})`, ...previous].slice(0, MAX_LINES),
      );
    });
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={demo.field}>
        <label htmlFor={fieldId} className={demo.label}>
          Select time
        </label>
        <input
          id={fieldId}
          ref={inputRef}
          type="text"
          className={demo.input}
          placeholder="Click to select time"
        />
        <div className={demo.row}>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() => pickerRef.current?.setValue("10:30")}
          >
            Set 10:30
          </button>
          <button type="button" className={demo.button} onClick={() => pickerRef.current?.clear()}>
            Clear from code
          </button>
        </div>
      </div>
      <pre className={`${demo.output} ${styles.log}`} aria-live="polite">
        {lines.join("\n")}
      </pre>
    </div>
  );
}

export function EmbeddedTitleDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const picker = new TimepickerUI(input, {
      ui: {
        inline: { enabled: true, container, embedded: true, showTitle: false, autoUpdate: true },
      },
    });
    picker.create();

    return () => picker.destroy();
  }, []);

  return (
    <div className={styles.stage}>
      <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div ref={containerRef} />
    </div>
  );
}

export function RangeStartOnlyDemo() {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    PluginRegistry.register(RangePlugin);

    const picker = new TimepickerUI(input, {
      clock: { type: "24h" },
      range: { enabled: true },
    });
    picker.create();
    picker.on("range:change", (data) => {
      const time = (end: typeof data.from) => (end ? `${end.hour}:${end.minutes}` : "none");
      setLines((previous) =>
        [`range:change ${data.part} (from ${time(data.from)}, to ${time(data.to)})`, ...previous].slice(
          0,
          MAX_LINES,
        ),
      );
    });
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={demo.field}>
        <label htmlFor={fieldId} className={demo.label}>
          Select time range
        </label>
        <input
          id={fieldId}
          ref={inputRef}
          type="text"
          className={demo.input}
          placeholder="Select time range"
        />
        <div className={demo.row}>
          <button
            type="button"
            className={demo.button}
            onClick={() => pickerRef.current?.setRange({ from: "09:00" })}
          >
            Set start only
          </button>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() =>
              pickerRef.current?.setRangeCaptions({ from: "Wed Oct 21", to: "Thu Oct 22" })
            }
          >
            Add date captions
          </button>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() => pickerRef.current?.open()}
          >
            Open
          </button>
        </div>
      </div>
      <pre className={`${demo.output} ${styles.log}`} aria-live="polite">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
