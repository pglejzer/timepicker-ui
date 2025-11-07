import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Zap, Code2, Box } from "lucide-react";

export const metadata = {
  title: "Quick Start - Timepicker-UI",
};

export default function QuickStartPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with Timepicker-UI in minutes
        </p>
      </div>

      <Section icon={Zap} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          Create a simple time picker with default settings:
        </p>

        <h3 className="text-lg font-semibold mb-3 text-foreground">HTML</h3>
        <CodeBlock
          code={`<input id="timepicker" type="text" placeholder="Select time" />`}
          language="html"
        />

        <h3 className="text-lg font-semibold mb-3 mt-6 text-foreground">
          JavaScript
        </h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Code2} title="With Options">
        <p className="text-muted-foreground mb-4">
          Customize the picker with options:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  theme: 'dark',
  clockType: '24h',
  animation: true,
  backdrop: true,
  onConfirm: (data) => {
    console.log('Selected time:', data);
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Box} title="Framework Integration">
        <h3 className="text-lg font-semibold mb-3 text-foreground">React</h3>
        <InfoBox title="Important for React" variant="orange" className="mb-4">
          Use{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
            useRef
          </code>{" "}
          to store the picker instance and avoid re-initialization on every
          render. If you pass options as an object, memoize them with{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
            useMemo
          </code>{" "}
          to prevent unnecessary re-renders.
        </InfoBox>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';

export default function TimePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  // Memoize options to prevent re-initialization
  const options = useMemo(() => ({
    onConfirm: (data) => console.log('Time:', data)
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

  return <input ref={inputRef} type="text" />;
}`}
          language="tsx"
        />

        <h3 className="text-lg font-semibold mb-3 mt-6 text-foreground">Vue</h3>
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

        <h3 className="text-lg font-semibold mb-3 mt-6 text-foreground">
          Angular
        </h3>
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
      </Section>

      <InfoBox title="Pro tip" variant="emerald">
        Always call{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          destroy()
        </code>{" "}
        when unmounting to prevent memory leaks. In React, use{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          useMemo
        </code>{" "}
        for options objects to avoid re-initialization on every render.
      </InfoBox>
    </div>
  );
}
