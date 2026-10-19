import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Tabs, type TabItem } from "@/components/tabs";

const HTML_CODE = `<input id="date" />`;

const JS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date", {
  calendar: { minDate: "today" },
  ui: { theme: "m3-green" },
  callbacks: {
    onConfirm: ({ value }) => console.log(value),
  },
});

picker.create();`;

const GROUPS_DEMO: DatepickerOptions = {
  calendar: { weekStart: "monday" },
  ui: { todayButton: true, clearButton: true },
  labels: { today: "Go to today" },
  behavior: { closeOnSelect: true },
};

const GROUPS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { weekStart: "monday" },
  ui: { todayButton: true, clearButton: true },
  labels: { today: "Go to today" },
  behavior: { closeOnSelect: true },
}).create();`;

const REACT_CODE = `"use client";

import { useEffect, useRef } from "react";
import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

export function DateField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new DatepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} />;
}`;

const VUE_CODE = `<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const input = ref<HTMLInputElement | null>(null);
let picker: DatepickerUI | null = null;

onMounted(() => {
  if (!input.value) return;
  picker = new DatepickerUI(input.value);
  picker.create();
});

onBeforeUnmount(() => picker?.destroy());
</script>

<template>
  <input ref="input" />
</template>`;

const SVELTE_CODE = `<script lang="ts">
  import { onMount } from "svelte";
  import DatepickerUI from "@pglejzer/datepicker-ui";
  import "@pglejzer/datepicker-ui/index.css";

  let input: HTMLInputElement;

  onMount(() => {
    const picker = new DatepickerUI(input);
    picker.create();
    return () => picker.destroy();
  });
</script>

<input bind:this={input} />`;

const ANGULAR_CODE = `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import DatepickerUI from "@pglejzer/datepicker-ui";

@Component({
  selector: "app-date-field",
  standalone: true,
  template: "<input #date />",
})
export class DateFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild("date") input!: ElementRef<HTMLInputElement>;
  private picker?: DatepickerUI;

  ngAfterViewInit() {
    this.picker = new DatepickerUI(this.input.nativeElement);
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}`;

const FRAMEWORKS: TabItem[] = [
  { id: "react", label: "React / Next.js", content: <CodeBlock code={REACT_CODE} language="tsx" /> },
  { id: "vue", label: "Vue", content: <CodeBlock code={VUE_CODE} language="markup" filename="DateField.vue" /> },
  {
    id: "svelte",
    label: "Svelte",
    content: <CodeBlock code={SVELTE_CODE} language="markup" filename="DateField.svelte" />,
  },
  {
    id: "angular",
    label: "Angular",
    content: <CodeBlock code={ANGULAR_CODE} language="typescript" filename="date-field.component.ts" />,
  },
];

const GROUPS = [
  {
    name: "calendar",
    text: (
      <>
        Which days exist and what the user selects: <code>mode</code>, <code>minDate</code>,{" "}
        <code>maxDate</code>, disabled dates, <code>locale</code>, <code>weekStart</code>, <code>months</code>{" "}
        and <code>precision</code>.
      </>
    ),
  },
  {
    name: "ui",
    text: (
      <>
        Presentation: <code>displayMode</code>, <code>inline</code>, <code>format</code>, <code>theme</code>,{" "}
        <code>colorScheme</code> and the footer buttons.
      </>
    ),
  },
  { name: "labels", text: <>Every button text and accessible name. Month and weekday names come from Intl.</> },
  {
    name: "behavior",
    text: (
      <>
        Interaction rules: <code>closeOnSelect</code>, <code>commitOnChange</code>, <code>returnFocus</code> and
        the instance <code>id</code>.
      </>
    ),
  },
  {
    name: "callbacks",
    text: (
      <>
        One <code>on*</code> function per event, such as <code>onConfirm</code> and <code>onOpen</code>.
      </>
    ),
  },
];

export default function DatepickerQuickStartPage() {
  return (
    <div>
      <PageHeader
        title="Quick Start"
        description="Turn a text input into a date picker with @pglejzer/datepicker-ui, the companion of timepicker-ui."
      />

      <Section title="Your first picker">
        <p>Add a text input to the page:</p>
        <CodeBlock code={HTML_CODE} language="html" />
        <p>Import the class and the stylesheet, create the picker and call <code>create()</code>:</p>
        <CodeBlock code={JS_CODE} language="typescript" />
        <p>
          The options argument is optional. The first argument is a selector, an <code>&lt;input&gt;</code> or an
          element that contains an <code>&lt;input&gt;</code>. A bare <code>&lt;input&gt;</code> is wrapped in a{" "}
          <code>div.dp-ui</code> host. For any other element, the parent of the input becomes the host. The
          constructor throws when no input is found.
        </p>
      </Section>

      <Section title="Option groups">
        <p>
          Options come in five groups. Every option is optional. A value of the wrong type or an unknown choice
          falls back to the default and emits an <code>error</code> event with the code{" "}
          <code>invalid-option</code>.
        </p>
        <dl>
          {GROUPS.map((group) => (
            <div key={group.name}>
              <dt>
                <code>{group.name}</code>
              </dt>
              <dd>{group.text}</dd>
            </div>
          ))}
        </dl>
        <p>
          All of them are listed on the <Link href="/datepicker/api/options">Options</Link> page. This demo sets
          one option from four of the groups:
        </p>
        <DatepickerExample label="Option groups" options={GROUPS_DEMO} code={GROUPS_CODE} />
      </Section>

      <Section title="Frameworks">
        <p>
          Create the picker on the client after the input is mounted, and call <code>destroy()</code> when the
          component unmounts:
        </p>
        <Tabs label="Framework" items={FRAMEWORKS} />
        <Callout title="Angular styles">
          Add <code>node_modules/@pglejzer/datepicker-ui/dist/css/index.css</code> to the <code>styles</code>{" "}
          array of <code>angular.json</code>, or import <code>@pglejzer/datepicker-ui/index.css</code> from your
          global stylesheet.
        </Callout>
        <p>
          More on server rendering and each framework in{" "}
          <Link href="/datepicker/docs/frameworks">Frameworks and SSR</Link>.
        </p>
      </Section>

      <h2>Next steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/datepicker/docs/display-modes">Display Modes</Link>
          </dt>
          <dd>Docked popover, modal dialog and inline calendar</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/docs/selection-modes">Selection Modes</Link>
          </dt>
          <dd>Single date, date range and multiple dates, and the values they return</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/examples">Examples</Link>
          </dt>
          <dd>Live demos with code</dd>
        </div>
      </dl>
    </div>
  );
}
