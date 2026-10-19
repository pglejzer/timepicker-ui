"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";
import demo from "@/components/demo-controls.module.css";
import styles from "./companion-demos.module.css";

export function EmbeddedDialogDemo() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [value, setValue] = useState("");

  useEffect(
    () => () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    },
    [],
  );

  const openDialog = () => {
    dialogRef.current?.showModal();
    const input = inputRef.current;
    const container = containerRef.current;
    if (pickerRef.current || !input || !container) return;

    const picker = new TimepickerUI(input, {
      ui: {
        inline: { enabled: true, container, embedded: true, autoUpdate: true },
      },
      callbacks: {
        onUpdate: ({ hour, minutes, type }) =>
          setValue(`${hour}:${minutes}${type ? ` ${type}` : ""}`),
      },
    });
    picker.create();
    pickerRef.current = picker;
  };

  return (
    <div className={styles.stage}>
      <div className={demo.row}>
        <button type="button" className={demo.button} onClick={openDialog}>
          Open dialog
        </button>
        {value && <output className={demo.output}>{value}</output>}
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}>
        <h3 id={titleId} className={styles.dialogTitle}>
          Pick a time
        </h3>
        <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
        <div ref={containerRef} />
        <div className={styles.dialogActions}>
          <button
            type="button"
            className={demo.buttonSecondary}
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
