"use client";

import { CodeBlock } from "@/components/code-block";
import { Tabs } from "@/components/tabs";

type Snippet = { id: string; label: string; filename: string; language: string; code: string };

const SNIPPETS: Snippet[] = [
  {
    id: "js",
    label: "JavaScript",
    filename: "main.ts",
    language: "typescript",
    code: `import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/index.css';

const picker = new TimepickerUI('#time', {
  clock: { type: '24h' },
  callbacks: { onConfirm: (data) => console.log(data.hour, data.minutes) },
});
picker.create();`,
  },
  {
    id: "react",
    label: "React",
    filename: "App.tsx",
    language: "tsx",
    code: `import { Timepicker } from 'timepicker-ui-react';
import 'timepicker-ui/main.css';

export function App() {
  return (
    <Timepicker
      placeholder="Select time"
      onConfirm={(data) => console.log(data.hour, data.minutes, data.type)}
    />
  );
}`,
  },
  {
    id: "vue",
    label: "Vue",
    filename: "TimeField.vue",
    language: "markup",
    code: `<template>
  <input ref="timepickerInput" type="text" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/index.css';

const timepickerInput = ref(null);
let picker = null;

onMounted(() => {
  picker = new TimepickerUI(timepickerInput.value);
  picker.create();
});

onUnmounted(() => {
  picker?.destroy();
  picker = null;
});
</script>`,
  },
  {
    id: "angular",
    label: "Angular",
    filename: "timepicker.component.ts",
    language: "typescript",
    code: `import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TimepickerUI } from 'timepicker-ui';

@Component({
  selector: 'app-timepicker',
  template: '<input #timepicker type="text" />',
})
export class TimepickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timepicker') input!: ElementRef<HTMLInputElement>;
  private picker?: TimepickerUI;

  ngAfterViewInit() {
    this.picker = new TimepickerUI(this.input.nativeElement);
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}`,
  },
  {
    id: "svelte",
    label: "Svelte",
    filename: "TimeField.svelte",
    language: "markup",
    code: `<script>
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

<input bind:this={input} type="text" />`,
  },
];

export function FrameworkTabs() {
  return (
    <Tabs
      label="Framework"
      items={SNIPPETS.map((snippet) => ({
        id: snippet.id,
        label: snippet.label,
        content: <CodeBlock code={snippet.code} language={snippet.language} filename={snippet.filename} />,
      }))}
    />
  );
}
