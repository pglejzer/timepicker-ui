"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { examplesNav } from "@/lib/nav";
import styles from "./page.module.css";

export default function ExamplesPage() {
  return (
    <div>
      <PageHeader
        title="Examples"
        description="Working configurations you can copy into your project."
      />

      <p>
        Demos run inline so you can try them right away. In your app the picker
        opens in a modal when the input is clicked. Switch a demo to Modal to
        see that.
      </p>

      <nav aria-label="All examples" className={styles.catalog}>
        {examplesNav.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2 className={styles.groupTitle}>
              {group.title}{" "}
              <span className={styles.count}>
                {group.links.filter((link) => link.href !== "/examples").length}
              </span>
            </h2>
            <ul className={styles.links}>
              {group.links
                .filter((link) => link.href !== "/examples")
                .map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.title}</Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </nav>

      <Callout title="React examples">
        These examples use React and Next.js, but{" "}
        <strong>TimepickerUI works with any JavaScript framework</strong> or
        vanilla JS. The same API is available in Vue, Angular, Svelte, or plain
        JavaScript. Check the{" "}
        <Link href="/docs/quick-start">Quick Start</Link>{" "}
        guide for framework-specific examples.
      </Callout>

      <Section title="Basic Usage">
        <h3>Default Timepicker</h3>
        <p>Simple time picker with default settings</p>
        <TimepickerExample
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function BasicTimePicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" placeholder="Select time" />;
}`}
        />
      </Section>

      <Section title="Clock Format">
        <h3>24-Hour Format</h3>
        <p>Use 24-hour clock instead of 12-hour with AM/PM</p>
        <TimepickerExample
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function Clock24Example() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { type: "24h" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
          options={{
            clock: { type: "24h" },
          }}
          inputPlaceholder="24-hour format"
        />
      </Section>

      <Section title="Theming">
        <h3>Dark Theme</h3>
        <p>Apply dark theme for better visual hierarchy</p>
        <TimepickerExample
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";
import "timepicker-ui/theme-dark.css";

export default function DarkThemeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      ui: { theme: "dark" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
          options={{
            ui: { theme: "dark" },
          }}
          inputPlaceholder="Dark theme"
        />
      </Section>

      <Section title="Callbacks">
        <h3>Handle Time Selection</h3>
        <p>React to user actions with callback functions</p>
        <TimepickerExample
          code={`import { useEffect, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function CallbackExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      callbacks: {
        onConfirm: (data) => {
          const time = \`\${data.hour}:\${data.minutes}\${data.type ? " " + data.type : ""}\`;
          setSelectedTime(time);
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" />
      {selectedTime && <p>Selected: {selectedTime}</p>}
    </div>
  );
}`}
        />
      </Section>

      <Section title="Increments">
        <h3>Custom Minute Steps</h3>
        <p>Allow only specific minute intervals (e.g., 15-minute increments)</p>
        <TimepickerExample
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function IncrementExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { incrementMinutes: 15 },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
          options={{
            clock: { incrementMinutes: 15 },
          }}
          inputPlaceholder="15-minute intervals"
        />
      </Section>

      <Section title="Restrictions">
        <h3>Disabled Time Ranges</h3>
        <p>Prevent selection of specific hours or time ranges</p>
        <TimepickerExample
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function DisabledTimeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: {
        disabledTime: {
          ranges: "12:00 PM - 1:00 PM",
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
          options={{
            clock: {
              disabledTime: {
                ranges: "12:00 PM - 1:00 PM",
              },
            },
          }}
          inputPlaceholder="Restricted hours"
        />
      </Section>
    </div>
  );
}
