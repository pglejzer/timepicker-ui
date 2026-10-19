"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import type DatepickerUI from "@pglejzer/datepicker-ui";
import type { DatepickerOptions, PickerValue } from "@pglejzer/datepicker-ui";
import { CodeBlock } from "@/components/code-block";
import demo from "@/components/demo-controls.module.css";
import example from "@/components/datepicker-example.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { DATEPICKER_THEMES } from "@/lib/datepicker";
import { THEMES } from "@/lib/site";
import { useDatepicker } from "@/lib/use-datepicker";
import { useTimepicker } from "@/lib/use-timepicker";

const DATE_OPTIONS: DatepickerOptions = {};
const TIME_OPTIONS = { clock: { type: "24h" } };

const SHARED_THEMES = DATEPICKER_THEMES.filter((name) => (THEMES as readonly string[]).includes(name));

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

function dateOf(value: PickerValue | null | undefined): string {
  return value && "value" in value ? value.value : "";
}

function timeOf(text: string): string {
  const match = TIME_PATTERN.exec(text.trim());
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

const INSTALL_CODE = `npm install @pglejzer/datepicker-ui timepicker-ui`;

const COMBINE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import { TimepickerUI } from "timepicker-ui";
import "@pglejzer/datepicker-ui/index.css";
import "timepicker-ui/index.css";

const dateInput = document.querySelector<HTMLInputElement>("#date")!;
const timeInput = document.querySelector<HTMLInputElement>("#time")!;
const output = document.querySelector("#datetime")!;

let date = "";
let time = "";

const render = () => {
  output.textContent = date && time ? \`\${date}T\${time}\` : "";
};

const datePicker = new DatepickerUI(dateInput, {
  ui: { theme: "m3-green" },
  callbacks: {
    onConfirm: ({ value }) => {
      date = value && "value" in value ? value.value : "";
      render();
    },
  },
});
datePicker.create();

const timePicker = new TimepickerUI(timeInput, {
  clock: { type: "24h" },
  ui: { theme: "m3-green" },
  callbacks: {
    onConfirm: () => {
      time = timeInput.value;
      render();
    },
  },
});
timePicker.create();`;

const THEME_CODE = `const theme = "crane";

new DatepickerUI("#date", { ui: { theme } }).create();
new TimepickerUI("#time", { ui: { theme } }).create();`;

const DEMO_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import { TimepickerUI } from "timepicker-ui";

const timeInput = document.querySelector<HTMLInputElement>("#time")!;

const datePicker = new DatepickerUI("#date");
datePicker.create();

const timePicker = new TimepickerUI(timeInput, { clock: { type: "24h" } });
timePicker.create();

const date = datePicker.getValue();
const datetime = date && "value" in date ? \`\${date.value}T\${timeInput.value}\` : "";`;

const RELATED = [
  { href: "/datepicker/docs/themes", title: "Date picker themes" },
  { href: "/datepicker/docs/frameworks", title: "Date picker with frameworks" },
  { href: "/docs/installation", title: "timepicker-ui installation" },
  { href: "/datepicker/api/methods", title: "Date picker methods" },
];

function DateTimeDemo() {
  const dateId = useId();
  const timeId = useId();
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<DatepickerUI | null>(null);
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useDatepicker({
    inputRef: dateRef,
    options: DATE_OPTIONS,
    theme,
    onPicker: (picker) => {
      pickerRef.current = picker;
    },
    onValue: () => setDate(dateOf(pickerRef.current?.getValue())),
  });

  useTimepicker({
    inputRef: timeRef,
    options: TIME_OPTIONS,
    theme,
    onValue: (text) => setTime(timeOf(text)),
  });

  const datetime = date && time ? `${date}T${time}` : "";

  const controls = (
    <label className={example.select}>
      <span className="sr-only">Theme</span>
      <select value={theme ?? "basic"} onChange={(event) => setTheme(event.target.value)}>
        {SHARED_THEMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <Figure
      label="Date and time"
      caption="One theme for both pickers"
      code={DEMO_CODE}
      controls={controls}
      status={datetime ? <output>{datetime}</output> : undefined}
    >
      <div className={example.stage} data-display="field">
        <div className={example.field}>
          <label htmlFor={dateId} className={demo.label}>
            Date
          </label>
          <input ref={dateRef} id={dateId} type="text" placeholder="Select date" className={demo.input} />
          <label htmlFor={timeId} className={demo.label}>
            Time
          </label>
          <input ref={timeRef} id={timeId} type="text" placeholder="Select time" className={demo.input} />
          <output className={example.message}>{datetime || "Pick a date and a time"}</output>
        </div>
      </div>
    </Figure>
  );
}

export default function DateAndTimePage() {
  return (
    <div>
      <PageHeader
        title="Date and Time Picker with timepicker-ui"
        description="@pglejzer/datepicker-ui is the companion of timepicker-ui. Use one for the date and one for the time, and join the two values into an ISO datetime string."
      />

      <Section title="Why pair them">
        <p>
          timepicker-ui picks a time and datepicker-ui picks a date. Each is a separate package with no dependency
          on the other. Put one input for each in a form and combine the two values yourself, which keeps both
          pickers small and lets each one use its own options.
        </p>
      </Section>

      <Section title="Install both">
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </Section>

      <Section title="Live demo">
        <p>
          Pick a date and a time. The result is shown under the fields as <code>YYYY-MM-DDTHH:mm</code>.
        </p>
        <DateTimeDemo />
      </Section>

      <Section title="Combining the values">
        <p>
          In single mode, <code>getValue()</code> of the date picker returns a <code>DateValue</code> whose{" "}
          <code>value</code> is an ISO date. With <code>clock.type: &quot;24h&quot;</code>, the time input of
          timepicker-ui holds 24-hour text such as <code>14:30</code>. Join the two with a <code>T</code>:
        </p>
        <CodeBlock code={COMBINE_CODE} language="typescript" />
        <p>
          The demo above does the same. It reads the date from <code>getValue()</code> and the time from the time
          input, and it shows the result only when both fields have a value. Hours below ten are padded to two
          digits there before the values are joined.
        </p>
      </Section>

      <Section title="Shared theme names">
        <p>
          Both packages share these theme names:{" "}
          {SHARED_THEMES.map((name, index) => (
            <span key={name}>
              {index > 0 && (index === SHARED_THEMES.length - 1 ? " and " : ", ")}
              <code>{name}</code>
            </span>
          ))}
          . Pass the same name to <code>ui.theme</code> of both pickers. timepicker-ui also has <code>dark</code> and{" "}
          <code>blueprint-dark</code>, which datepicker-ui does not have.
        </p>
        <CodeBlock code={THEME_CODE} language="typescript" />
      </Section>

      <Section title="Related">
        <ul>
          {RELATED.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
