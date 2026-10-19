"use client";

import { useEffect, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";
import type { TimeOfDay } from "timepicker-ui";
import "timepicker-ui/main.css";
import demo from "@/components/demo-controls.module.css";
import styles from "./companion-demos.module.css";

export function DisabledFunctionDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const lunchBreakRef = useRef(false);
  const [lunchBreak, setLunchBreak] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const isTimeDisabled = ({ hour }: TimeOfDay): boolean => {
      if (hour < 9 || hour >= 17) return true;
      return lunchBreakRef.current && hour === 12;
    };

    const picker = new TimepickerUI(input, {
      clock: { type: "24h", isTimeDisabled },
      ui: { inline: { enabled: true, container, autoUpdate: true } },
      callbacks: {
        onUpdate: ({ hour, minutes }) => setValue(`${hour}:${minutes}`),
      },
    });
    picker.create();
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, []);

  const toggleLunchBreak = () => {
    lunchBreakRef.current = !lunchBreakRef.current;
    setLunchBreak(lunchBreakRef.current);
    pickerRef.current?.refreshDisabledTime();
  };

  return (
    <div className={styles.stage}>
      <div className={demo.row}>
        <button
          type="button"
          className={demo.button}
          aria-pressed={lunchBreak}
          onClick={toggleLunchBreak}
        >
          Toggle lunch break
        </button>
        <span className={demo.output}>Lunch break: {lunchBreak ? "on" : "off"}</span>
        {value && <output className={demo.output}>{value}</output>}
      </div>
      <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div ref={containerRef} />
    </div>
  );
}
