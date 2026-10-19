"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";
import demo from "@/components/demo-controls.module.css";
import styles from "./companion-demos.module.css";

const MAX_LINES = 6;

export function UnsubscribeDemo() {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const picker = new TimepickerUI(input, { clock: { type: "24h" } });
    picker.create();
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
      unsubscribeRef.current = null;
    };
  }, []);

  const log = (line: string) =>
    setLines((previous) => [line, ...previous].slice(0, MAX_LINES));

  const subscribe = () => {
    const picker = pickerRef.current;
    if (!picker || unsubscribeRef.current) return;
    unsubscribeRef.current = picker.on("confirm", ({ hour, minutes }) =>
      log(`confirm ${hour}:${minutes}`),
    );
    setSubscribed(true);
    log("subscribed");
  };

  const unsubscribe = () => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setSubscribed(false);
    log("unsubscribed");
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
          <button type="button" className={demo.button} disabled={subscribed} onClick={subscribe}>
            Subscribe to confirm
          </button>
          <button
            type="button"
            className={demo.buttonSecondary}
            disabled={!subscribed}
            onClick={unsubscribe}
          >
            Unsubscribe
          </button>
        </div>
      </div>
      <pre className={`${demo.output} ${styles.log}`} aria-live="polite">
        {lines.join("\n")}
      </pre>
    </div>
  );
}
