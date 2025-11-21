"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import type { TimepickerEventData } from "@/components/examples/types";
import { Clock } from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Getting Started
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple examples to start using Timepicker-UI
        </p>
      </div>

      <Section icon={Clock} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          The simplest way to create a timepicker with default settings:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker-input');
const picker = new TimepickerUI(input);
picker.create();`}
          options={{}}
        />
      </Section>

      <Section icon={Clock} title="With Options">
        <p className="text-muted-foreground mb-4">
          Add custom options to personalize your timepicker:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker-input');
const picker = new TimepickerUI(input, {
  ui: {
    theme: 'dark'
  },
  clock: {
    type: '24h'
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  }
});

picker.create();`}
          options={{
            ui: { theme: "dark" },
            clock: { type: "24h" },
            labels: {
              ok: "Confirm",
              cancel: "Close",
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Event Handling">
        <p className="text-muted-foreground mb-4">
          Listen to events and handle user interactions:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker-input');
const picker = new TimepickerUI(input, {
  onOpen: (data) => {
    console.log('Picker opened', data);
  },
  onConfirm: (data) => {
    console.log('Time selected:', data.hour, data.minutes, data.type);
  },
  onCancel: (data) => {
    console.log('Picker cancelled', data);
  }
});

picker.create();`}
          options={{
            callbacks: {
              onOpen: (data: TimepickerEventData) =>
                console.log("Picker opened", data),
              onCancel: (data: TimepickerEventData) =>
                console.log("Picker cancelled", data),
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="React Integration">
        <p className="text-muted-foreground mb-4">
          Use timepicker in React applications with proper instance management:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function TimePickerComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  // Memoize options to prevent re-initialization on every render
  const options = useMemo(() => ({
    ui: { theme: 'basic' },
    clock: { type: '12h' }
  }), []);

  useEffect(() => {
    if (!inputRef.current) return;

    // Create instance once
    pickerRef.current = new TimepickerUI(inputRef.current, options);
    pickerRef.current.create();

    // Cleanup on unmount
    return () => {
      pickerRef.current?.destroy();
    };
  }, []); // Empty deps - initialize only once

  return (
    <input 
      ref={inputRef}
      type="text"
      placeholder="Select time"
    />
  );
}`}
          language="typescript"
        />
      </Section>

      <Section icon={Clock} title="Vue Integration">
        <p className="text-muted-foreground mb-4">
          Use timepicker in Vue applications with proper cleanup:
        </p>
        <CodeBlock
          code={`<template>
  <input ref="timepickerInput" type="text" placeholder="Select time" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { TimepickerUI } from 'timepicker-ui';

const timepickerInput = ref(null);
let picker = null; // Store instance outside reactive state

onMounted(() => {
  if (timepickerInput.value) {
    picker = new TimepickerUI(timepickerInput.value, {
      ui: { theme: 'basic' }
    });
    picker.create();
  }
});

onUnmounted(() => {
  // Always cleanup on unmount
  if (picker) {
    picker.destroy();
    picker = null;
  }
});
</script>`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
