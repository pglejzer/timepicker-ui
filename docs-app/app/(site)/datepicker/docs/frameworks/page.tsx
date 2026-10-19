import Link from "next/link";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Tabs, type TabItem } from "@/components/tabs";

const REACT_CODE = `"use client";

import { useEffect, useRef } from "react";
import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

export function DateField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new DatepickerUI(inputRef.current, {
      calendar: { minDate: "today" },
    });
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
  picker = new DatepickerUI(input.value, { calendar: { minDate: "today" } });
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
    const picker = new DatepickerUI(input, { calendar: { minDate: "today" } });
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
    this.picker = new DatepickerUI(this.input.nativeElement, {
      calendar: { minDate: "today" },
    });
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}`;

const VANILLA_CODE = `<link
  rel="stylesheet"
  href="https://unpkg.com/@pglejzer/datepicker-ui/dist/css/index.css"
/>
<input id="date" />
<script src="https://unpkg.com/@pglejzer/datepicker-ui/dist/umd/index.js"></script>
<script>
  const picker = new DatepickerUI("#date", { calendar: { minDate: "today" } });
  picker.create();
</script>`;

const PAGE_CODE = `import { DateField } from "./date-field";

export default function Page() {
  return (
    <form>
      <DateField />
    </form>
  );
}`;

const FRAMEWORKS: TabItem[] = [
  { id: "react", label: "React / Next.js", content: <CodeBlock code={REACT_CODE} language="tsx" filename="date-field.tsx" /> },
  { id: "vue", label: "Vue", content: <CodeBlock code={VUE_CODE} language="markup" filename="DateField.vue" /> },
  { id: "svelte", label: "Svelte", content: <CodeBlock code={SVELTE_CODE} language="markup" filename="DateField.svelte" /> },
  {
    id: "angular",
    label: "Angular",
    content: <CodeBlock code={ANGULAR_CODE} language="typescript" filename="date-field.component.ts" />,
  },
  { id: "vanilla", label: "Vanilla + CDN", content: <CodeBlock code={VANILLA_CODE} language="html" filename="index.html" /> },
];

const RELATED = [
  { href: "/datepicker/quick-start", title: "Quick start" },
  { href: "/datepicker/installation", title: "Installation" },
  { href: "/datepicker/docs/display-modes", title: "Display modes" },
  { href: "/datepicker/api/methods", title: "Methods reference" },
];

export default function DatepickerFrameworksPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker with React, Vue, Svelte and Angular"
        description="@pglejzer/datepicker-ui, the companion of timepicker-ui, has a plain JS API. Create the picker on mount and call destroy() on unmount in any framework."
      />

      <Section title="Server rendering">
        <p>
          Importing the package does not touch <code>window</code> or <code>document</code>, so it is safe on the
          server. The constructor needs a document and throws without one, so create the picker on the client after
          the input is mounted, and call <code>destroy()</code> on unmount.
        </p>
      </Section>

      <Section title="Create on mount, destroy on unmount">
        <p>
          Every framework follows the same pattern: wait until the input exists, create the picker, and destroy it
          when the component goes away.
        </p>
        <Tabs label="Framework" items={FRAMEWORKS} />
        <Callout title="Angular styles">
          Add <code>node_modules/@pglejzer/datepicker-ui/dist/css/index.css</code> to the <code>styles</code> array
          of <code>angular.json</code>, or import <code>@pglejzer/datepicker-ui/index.css</code> from your global
          stylesheet.
        </Callout>
      </Section>

      <Section title="Next.js App Router">
        <p>
          Pages and layouts are Server Components by default. Put the picker in a file that starts with{" "}
          <code>&quot;use client&quot;</code>, as in the React tab, and render it from the page:
        </p>
        <CodeBlock code={PAGE_CODE} language="tsx" filename="page.tsx" />
        <p>
          Options that contain functions, such as <code>isDateDisabled</code> or callbacks, have to be defined inside
          the client component. A server component cannot pass functions to a client component.
        </p>
      </Section>

      <Section title="From a CDN">
        <p>
          The UMD build exposes the class itself as the global <code>DatepickerUI</code>. jsDelivr serves the same
          files from <code>https://cdn.jsdelivr.net/npm/@pglejzer/datepicker-ui/dist/</code>.
        </p>
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
