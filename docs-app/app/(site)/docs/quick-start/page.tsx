import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Quick Start",
  description:
    "Quick start guide for timepicker-ui - render your first analog clock time picker in minutes. Zero-dependency, framework-agnostic, SSR-safe and fully typed.",
  path: "/docs/quick-start",
});

export default function QuickStartPage() {
  return (
    <div>
      <PageHeader
        title="Quick Start"
        description="Get up and running with Timepicker-UI in minutes"
      />

      <Section title="Basic Usage">
        <p>
          Create a simple time picker with default settings:
        </p>

        <h3>HTML</h3>
        <CodeBlock
          code={`<input id="timepicker" type="text" placeholder="Select time" />`}
          language="html"
        />

        <h3>JavaScript</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="With Options">
        <p>
          Customize the picker with options (v4.0.0 grouped structure):
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true
  },
  clock: {
    type: '24h'
  },
  callbacks: {
    onConfirm: (data) => {
      console.log('Selected time:', data);
    }
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Framework Integration">
        <h3>React</h3>
        <Callout title="Important for React" tone="warning">
          Use <code>useRef</code>{" "}
          to store the picker instance and avoid re-initialization on every
          render. If you pass options as an object, memoize them with{" "}
          <code>useMemo</code>{" "}
          to prevent unnecessary re-renders. Render the input inside{" "}
          <code>{'<div className="tp-ui">'}</code>, so unmounting the
          component does not throw.{" "}
          <Link href="/docs/guides/server-rendering">Server Rendering</Link>{" "}
          explains why.
        </Callout>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';

export default function TimePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  // Memoize options to prevent re-initialization
  const options = useMemo(() => ({
    callbacks: {
      onConfirm: (data) => console.log('Time:', data)
    }
  }), []);

  useEffect(() => {
    if (!inputRef.current) return;
    
    // Create instance only once
    pickerRef.current = new TimepickerUI(inputRef.current, options);
    pickerRef.current.create();
    
    // Cleanup on unmount
    return () => {
      pickerRef.current?.destroy();
    };
  }, []); // Empty deps - create only once

  return (
    <div className="tp-ui">
      <input ref={inputRef} type="text" />
    </div>
  );
}`}
          language="tsx"
        />

        <h3>Vue</h3>
        <CodeBlock
          code={`<template>
  <input ref="timepickerInput" type="text" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { TimepickerUI } from 'timepicker-ui';

const timepickerInput = ref(null);
let picker = null; // Store instance outside reactive state

onMounted(() => {
  picker = new TimepickerUI(timepickerInput.value);
  picker.create();
});

onUnmounted(() => {
  // Always cleanup to prevent memory leaks
  picker?.destroy();
  picker = null;
});
</script>`}
          language="vue"
        />

        <h3>Angular</h3>
        <CodeBlock
          code={`import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TimepickerUI } from 'timepicker-ui';

@Component({
  selector: 'app-timepicker',
  template: '<input #timepicker type="text" />'
})
export class TimepickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timepicker') input: ElementRef;
  private picker: TimepickerUI;

  ngAfterViewInit() {
    this.picker = new TimepickerUI(this.input.nativeElement);
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}`}
          language="typescript"
        />

        <h3>Svelte</h3>
        <CodeBlock
          code={`<script>
  import { onMount } from 'svelte';
  import { TimepickerUI } from 'timepicker-ui';
  import 'timepicker-ui/index.css';

  let input;

  onMount(() => {
    const picker = new TimepickerUI(input);
    picker.create();
    return () => picker.destroy();
  });
</script>

<input bind:this={input} type="text" />`}
          language="svelte"
        />
        <p>
          For SvelteKit, see{" "}
          <Link href="/docs/guides/server-rendering#sveltekit">
            Server Rendering
          </Link>
          .
        </p>
      </Section>

      <Callout title="Pro tip" tone="tip">
        Always call <code>destroy()</code>{" "}
        when unmounting to prevent memory leaks. In React, use{" "}
        <code>useMemo</code>{" "}
        for options objects to avoid re-initialization on every render.
      </Callout>
    </div>
  );
}
