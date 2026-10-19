"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import "timepicker-ui/main.css";
import demo from "@/components/demo-controls.module.css";
import styles from "./companion-demos.module.css";

export function RangeApiDemo() {
  const fieldId = useId();
  const linkedInputRef = useRef<HTMLInputElement>(null);
  const independentInputRef = useRef<HTMLInputElement>(null);
  const linkedRef = useRef<TimepickerUI | null>(null);
  const independentRef = useRef<TimepickerUI | null>(null);
  const [output, setOutput] = useState("");

  useEffect(() => {
    const linkedInput = linkedInputRef.current;
    const independentInput = independentInputRef.current;
    if (!linkedInput || !independentInput) return;

    PluginRegistry.register(RangePlugin);

    const linked = new TimepickerUI(linkedInput, {
      clock: { type: "24h" },
      range: { enabled: true },
    });
    linked.create();

    const independent = new TimepickerUI(independentInput, {
      clock: { type: "24h" },
      range: { enabled: true, linked: false, minDuration: 30 },
    });
    independent.create();

    linkedRef.current = linked;
    independentRef.current = independent;

    return () => {
      linked.destroy();
      independent.destroy();
      linkedRef.current = null;
      independentRef.current = null;
    };
  }, []);

  const show = (label: string, picker: TimepickerUI | null) => {
    if (!picker) return;
    setOutput(`${label}\n${JSON.stringify(picker.getRange(), null, 2)}`);
  };

  const setNineToFive = () => {
    const picker = linkedRef.current;
    if (!picker) return;
    picker.setRange({ from: "09:00", to: "17:00" });
    show("setRange 09:00 - 17:00", picker);
  };

  const editTo = () => {
    const picker = linkedRef.current;
    if (!picker) return;
    picker.open();
    const switched = picker.setActivePart("to");
    setOutput(`setActivePart('to') returned ${switched}`);
  };

  const setOvernight = () => {
    const picker = independentRef.current;
    if (!picker) return;
    picker.setRange({ from: "22:00", to: "01:00" });
    show("linked: false, setRange 22:00 - 01:00", picker);
  };

  return (
    <div className={styles.stage}>
      <div className={demo.field}>
        <label htmlFor={`${fieldId}-linked`} className={demo.label}>
          Linked range (default)
        </label>
        <input
          id={`${fieldId}-linked`}
          ref={linkedInputRef}
          type="text"
          className={demo.input}
          placeholder="Select time range"
        />
        <div className={demo.row}>
          <button type="button" className={demo.button} onClick={setNineToFive}>
            Set 09:00 - 17:00
          </button>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() => show("getRange()", linkedRef.current)}
          >
            getRange()
          </button>
          <button type="button" className={demo.buttonSecondary} onClick={editTo}>
            Edit To
          </button>
        </div>
      </div>

      <div className={demo.field}>
        <label htmlFor={`${fieldId}-independent`} className={demo.label}>
          Independent range (linked: false)
        </label>
        <input
          id={`${fieldId}-independent`}
          ref={independentInputRef}
          type="text"
          className={demo.input}
          placeholder="Select time range"
        />
        <div className={demo.row}>
          <button type="button" className={demo.button} onClick={setOvernight}>
            Set 22:00 - 01:00
          </button>
        </div>
      </div>

      <pre className={`${demo.output} ${styles.log}`} aria-live="polite">
        {output}
      </pre>
    </div>
  );
}
