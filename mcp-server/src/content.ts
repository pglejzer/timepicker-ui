export const FRAMEWORK_NAMES = ['vanilla', 'react', 'next', 'vue', 'angular', 'svelte'] as const;
export type Framework = (typeof FRAMEWORK_NAMES)[number];

export interface FrameworkRecipe {
  title: string;
  notes: string[];
  code: string;
}

export const FRAMEWORK_RECIPES: Record<Framework, FrameworkRecipe> = {
  vanilla: {
    title: 'Vanilla JS / TS',
    notes: [
      'Call create() once the input exists in the DOM.',
      'Call destroy() when you remove the input to release listeners and the modal.',
    ],
    code: [
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      "const input = document.querySelector('#time');",
      'const picker = new TimepickerUI(input, { clock: { type: \'24h\' } });',
      'picker.create();',
    ].join('\n'),
  },
  react: {
    title: 'React',
    notes: [
      'Construct in an effect after mount; destroy in the cleanup. Never construct during render.',
      'Empty dependency array so it initializes once. Read values via picker.getValue() or the events.',
      'There is also an official wrapper: the `timepicker-ui-react` package.',
    ],
    code: [
      "import { useEffect, useRef } from 'react';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'export function TimePicker() {',
      '  const ref = useRef<HTMLInputElement>(null);',
      '  useEffect(() => {',
      '    if (!ref.current) return;',
      '    const picker = new TimepickerUI(ref.current, { clock: { type: \'24h\' } });',
      '    picker.create();',
      "    picker.on('confirm', (d) => console.log(d.hour, d.minutes));",
      '    return () => picker.destroy();',
      '  }, []);',
      '  return <input ref={ref} />;',
      '}',
    ].join('\n'),
  },
  next: {
    title: 'Next.js (App Router)',
    notes: [
      'The component must be a Client Component — add "use client" at the top.',
      'timepicker-ui touches the DOM, so keep all usage inside useEffect (runs only in the browser). The library is SSR-safe (no DOM access at import time), but you still must not call create() on the server.',
      'If you ever see hydration/DOM errors, dynamic-import the picker component with { ssr: false }.',
    ],
    code: [
      "'use client';",
      "import { useEffect, useRef } from 'react';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'export function TimePicker() {',
      '  const ref = useRef<HTMLInputElement>(null);',
      '  useEffect(() => {',
      '    if (!ref.current) return;',
      '    const picker = new TimepickerUI(ref.current);',
      '    picker.create();',
      '    return () => picker.destroy();',
      '  }, []);',
      '  return <input ref={ref} />;',
      '}',
    ].join('\n'),
  },
  vue: {
    title: 'Vue 3',
    notes: [
      'Create in onMounted, destroy in onBeforeUnmount.',
      'Use a template ref to the input element.',
    ],
    code: [
      '<script setup lang="ts">',
      "import { ref, onMounted, onBeforeUnmount } from 'vue';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'const el = ref<HTMLInputElement | null>(null);',
      'let picker: TimepickerUI | null = null;',
      'onMounted(() => {',
      '  if (!el.value) return;',
      '  picker = new TimepickerUI(el.value, { clock: { type: \'24h\' } });',
      '  picker.create();',
      '});',
      'onBeforeUnmount(() => picker?.destroy());',
      '</script>',
      '',
      '<template>',
      '  <input ref="el" />',
      '</template>',
    ].join('\n'),
  },
  angular: {
    title: 'Angular',
    notes: [
      'Create in ngAfterViewInit (the view/input exists), destroy in ngOnDestroy.',
      'Add timepicker-ui/main.css to angular.json styles or import it in styles.css.',
      'Use ViewChild + ElementRef to reach the input.',
    ],
    code: [
      "import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';",
      "import { TimepickerUI } from 'timepicker-ui';",
      '',
      '@Component({',
      "  selector: 'app-time',",
      "  template: '<input #time />',",
      '})',
      'export class TimeComponent implements AfterViewInit, OnDestroy {',
      "  @ViewChild('time') input!: ElementRef<HTMLInputElement>;",
      '  private picker?: TimepickerUI;',
      '  ngAfterViewInit() {',
      '    this.picker = new TimepickerUI(this.input.nativeElement, { clock: { type: \'24h\' } });',
      '    this.picker.create();',
      '  }',
      '  ngOnDestroy() {',
      '    this.picker?.destroy();',
      '  }',
      '}',
    ].join('\n'),
  },
  svelte: {
    title: 'Svelte',
    notes: [
      'Bind the input, create in onMount, destroy in the returned cleanup.',
    ],
    code: [
      '<script lang="ts">',
      "  import { onMount } from 'svelte';",
      "  import { TimepickerUI } from 'timepicker-ui';",
      "  import 'timepicker-ui/main.css';",
      '',
      '  let input: HTMLInputElement;',
      '  onMount(() => {',
      '    const picker = new TimepickerUI(input, { clock: { type: \'24h\' } });',
      '    picker.create();',
      '    return () => picker.destroy();',
      '  });',
      '</script>',
      '',
      '<input bind:this={input} />',
    ].join('\n'),
  },
};

export interface MigrationMapping {
  group: string;
  rows: { from: string; to: string }[];
}

export const MIGRATION_V3_TO_V4: { summary: string[]; mappings: MigrationMapping[]; notes: string[] } = {
  summary: [
    'v4 replaced the flat options object (40+ fields) with grouped options. There is NO backward-compatibility layer — all v3 code must be updated.',
    'Event handling also moved to the EventEmitter API (picker.on(event, handler)) and the grouped callbacks.* options.',
  ],
  mappings: [
    {
      group: 'clock',
      rows: [
        { from: 'clockType', to: 'clock.type' },
        { from: 'incrementHours', to: 'clock.incrementHours' },
        { from: 'incrementMinutes', to: 'clock.incrementMinutes' },
        { from: 'autoSwitchToMinutes', to: 'clock.autoSwitchToMinutes' },
        { from: 'disabledTime', to: 'clock.disabledTime' },
        { from: 'currentTime', to: 'clock.currentTime' },
      ],
    },
    {
      group: 'ui',
      rows: [
        { from: 'theme', to: 'ui.theme' },
        { from: 'animation', to: 'ui.animation' },
        { from: 'backdrop', to: 'ui.backdrop' },
        { from: 'mobile', to: 'ui.mobile' },
        { from: 'enableSwitchIcon', to: 'ui.enableSwitchIcon' },
        { from: 'editable', to: 'ui.editable' },
        { from: 'enableScrollbar', to: 'ui.enableScrollbar' },
        { from: 'cssClass', to: 'ui.cssClass' },
        { from: 'appendModalSelector', to: 'ui.appendModalSelector' },
        { from: 'iconTemplate', to: 'ui.iconTemplate' },
        { from: 'iconTemplateMobile', to: 'ui.iconTemplateMobile' },
        { from: 'inline', to: 'ui.inline' },
      ],
    },
    {
      group: 'labels',
      rows: [
        { from: 'amLabel', to: 'labels.am' },
        { from: 'pmLabel', to: 'labels.pm' },
        { from: 'okLabel', to: 'labels.ok' },
        { from: 'cancelLabel', to: 'labels.cancel' },
        { from: 'timeLabel', to: 'labels.time' },
        { from: 'mobileTimeLabel', to: 'labels.mobileTime' },
        { from: 'hourMobileLabel', to: 'labels.mobileHour' },
        { from: 'minuteMobileLabel', to: 'labels.mobileMinute' },
      ],
    },
    {
      group: 'behavior',
      rows: [
        { from: 'focusInputAfterCloseModal', to: 'behavior.focusInputAfterClose' },
        { from: 'focusTrap', to: 'behavior.focusTrap' },
        { from: 'delayHandler', to: 'behavior.delayHandler' },
        { from: 'id', to: 'behavior.id' },
      ],
    },
    {
      group: 'callbacks',
      rows: [
        { from: 'onOpen', to: 'callbacks.onOpen' },
        { from: 'onCancel', to: 'callbacks.onCancel' },
        { from: 'onConfirm', to: 'callbacks.onConfirm' },
        { from: 'onUpdate', to: 'callbacks.onUpdate' },
        { from: 'onSelectHour', to: 'callbacks.onSelectHour' },
        { from: 'onSelectMinute', to: 'callbacks.onSelectMinute' },
        { from: 'onSelectAM', to: 'callbacks.onSelectAM' },
        { from: 'onSelectPM', to: 'callbacks.onSelectPM' },
        { from: 'onError', to: 'callbacks.onError' },
      ],
    },
  ],
  notes: [
    'Reading options also changed: options.clockType -> options.clock.type, options.amLabel -> options.labels.am.',
    'update() takes grouped options too: update({ options: { clock: { type: "24h" } } }).',
    'CSS class names were renamed in v4 (tp-ui- prefix). Re-check any custom CSS selectors.',
  ],
};

export const MIGRATION_V43_TO_V44: string[] = [
  'Non-breaking. Adds the blueprint and blueprint-dark themes.',
  'Adds 16 localizable accessibility labels under labels.* (e.g. hourLabel, minuteLabel, announceHour).',
  'Adds Home/End/PageUp/PageDown keyboard navigation. No migration needed.',
];

export interface Troubleshoot {
  symptom: string;
  cause: string;
  fix: string;
}

export const TROUBLESHOOTING: Troubleshoot[] = [
  {
    symptom: 'Picker opens but is completely unstyled.',
    cause: "The core stylesheet was not imported.",
    fix: "Always import 'timepicker-ui/main.css'. For a non-basic theme also import 'timepicker-ui/theme-<name>.css'.",
  },
  {
    symptom: "An 'error' event fires / a feature option is ignored.",
    cause: 'A plugin (range, timezone, wheel) was used without being registered.',
    fix: "Import the plugin and call PluginRegistry.register(Plugin) once at startup before creating the picker.",
  },
  {
    symptom: 'Wheel / compact-wheel mode renders as a normal clock.',
    cause: 'The wheel plugin is required for those modes.',
    fix: "Register WheelPlugin from 'timepicker-ui/plugins/wheel' and set ui.mode to 'wheel' or 'compact-wheel'.",
  },
  {
    symptom: 'Modal appears in the wrong place or behind other UI.',
    cause: 'It is appended to <body> by default.',
    fix: "Set ui.appendModalSelector to a container selector, or check stacking context / z-index of ancestors.",
  },
  {
    symptom: 'Setting ui.theme to a custom name does nothing.',
    cause: 'The theme CSS was not loaded, or the data-theme name does not match.',
    fix: "Author [data-theme='name'] { --tp-*: ... }, import it after main.css, and pass ui.theme = 'name'.",
  },
  {
    symptom: 'Listeners or modal linger after the input is removed (e.g. SPA route change).',
    cause: 'The instance was not destroyed.',
    fix: 'Call picker.destroy() in your framework cleanup hook (useEffect cleanup, onBeforeUnmount, ngOnDestroy).',
  },
  {
    symptom: 'TypeScript complains about a custom theme name.',
    cause: 'ui.theme is a union of built-in theme names.',
    fix: "Cast the custom name: ui: { theme: 'ocean' as any }.",
  },
];

export const IO_CONTRACT = {
  getValue:
    'getValue() returns { hour: string; minutes: string; type?: string; time: string; degreesHours: number | null; degreesMinutes: number | null }.',
  setValue:
    'setValue(time, updateInput?) accepts "HH:MM" (24h) or "h:MM AM/PM" (12h), e.g. "14:30" or "2:30 PM". updateInput defaults to writing the input value.',
};
