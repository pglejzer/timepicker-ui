"use client";

import { useCallback, useId, useRef, useState } from "react";
import type DatepickerUI from "@pglejzer/datepicker-ui";
import type { DatepickerEventMap, DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useDatepicker } from "@/lib/use-datepicker";
import styles from "../advanced.module.css";

const EVENTS = [
  "open",
  "close",
  "cancel",
  "confirm",
  "update",
  "error",
  "select:day",
  "select:month",
  "select:year",
  "range:start",
  "range:end",
  "navigate",
] as const satisfies readonly (keyof DatepickerEventMap)[];

const LOG_LIMIT = 8;
const DATA_LIMIT = 110;

const OPTIONS: DatepickerOptions = { ui: { todayButton: true, clearButton: true } };

type LogEntry = { id: number; name: string; data: string };

function summarize(data: unknown): string {
  const text = JSON.stringify(data, (_key, value: unknown) => {
    if (typeof value === "function") return "fn";
    if (typeof Node !== "undefined" && value instanceof Node) return "node";
    return value;
  });
  if (text === undefined) return "";
  return text.length > DATA_LIMIT ? `${text.slice(0, DATA_LIMIT)}...` : text;
}

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date", {
  ui: { todayButton: true, clearButton: true },
});
picker.create();

const events = [
  "open", "close", "cancel", "confirm", "update", "error",
  "select:day", "select:month", "select:year",
  "range:start", "range:end", "navigate",
];

const offs = events.map((name) =>
  picker.on(name, (data) => console.log(name, data)),
);

// Later: offs.forEach((off) => off());`;

const CALLBACKS_CODE = `new DatepickerUI("#date", {
  callbacks: {
    onConfirm: ({ value }) => console.log(value),
    onSelectDay: ({ value, selected }) => console.log(value.value, selected),
    onNavigate: ({ year, month }) => console.log(year, month),
  },
}).create();`;

export default function EventsExamplePage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const offs = useRef<Array<() => void>>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  const handlePicker = useCallback((picker: DatepickerUI | null) => {
    offs.current.forEach((off) => off());
    offs.current = [];
    if (!picker) return;
    offs.current = EVENTS.map((name) =>
      picker.on(name, (data) => {
        nextId.current += 1;
        const entry: LogEntry = { id: nextId.current, name, data: summarize(data) };
        setLog((previous) => [entry, ...previous].slice(0, LOG_LIMIT));
      }),
    );
  }, []);

  useDatepicker({ inputRef, options: OPTIONS, onPicker: handlePicker });

  const clearLog = () => setLog([]);

  return (
    <div>
      <PageHeader
        title="Events"
        description={
          <>
            Subscribe to every event of a picker and watch the payloads. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Event log">
        <p>
          <code>picker.on(event, handler)</code> subscribes and returns a function that unsubscribes. The demo
          subscribes to all twelve events. Open the picker, pick a day, move between months and open the month and
          year menus. The log keeps the last {LOG_LIMIT} events, newest first.
        </p>
        <Figure
          label="Event log"
          code={CODE}
          controls={
            <button type="button" className={demo.buttonSecondary} onClick={clearLog} disabled={log.length === 0}>
              Clear log
            </button>
          }
        >
          <div className={styles.stage}>
            <div className={demo.field}>
              <label htmlFor={inputId} className={demo.label}>
                Date
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                placeholder="Select date"
                className={demo.input}
              />
            </div>
            <ol className={styles.log} aria-label="Events received">
              {log.length === 0 && <li className={styles.empty}>No events yet</li>}
              {log.map((entry) => (
                <li key={entry.id} className={styles.logItem}>
                  <span className={styles.logName}>{entry.name}</span>
                  <span className={styles.logData}>{entry.data}</span>
                </li>
              ))}
            </ol>
          </div>
        </Figure>
      </Section>

      <Section title="Callbacks">
        <p>
          Each event has an <code>on*</code> option in the <code>callbacks</code> group that does the same without
          an instance.
        </p>
        <CodeBlock code={CALLBACKS_CODE} language="typescript" />
        <Callout>
          <code>setValue()</code> does not emit <code>confirm</code>. <code>setOptions()</code> emits{" "}
          <code>update</code>.
        </Callout>
      </Section>
    </div>
  );
}
