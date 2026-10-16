export const FRAMEWORK_NAMES = ['vanilla', 'react', 'react-wrapper', 'next', 'vue', 'angular', 'svelte'] as const;
export type Framework = (typeof FRAMEWORK_NAMES)[number];

export interface FrameworkRecipe {
  title: string;
  notes: string[];
  code: string;
  docs: string;
}

const WRAPPER_NOTE =
  'Render the input inside <div class="tp-ui">. Given a bare input, the picker wraps it in a new div.tp-ui, and destroy() leaves that div in place, which can break the framework when it removes the input.';

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
      "const picker = new TimepickerUI(input, { clock: { type: '24h' } });",
      'picker.create();',
    ].join('\n'),
    docs: '/docs/quick-start',
  },
  react: {
    title: 'React',
    notes: [
      'Construct in an effect after mount and destroy in the cleanup. Never construct during render.',
      'Empty dependency array so it initializes once. Read values with picker.getValue() or the events.',
      WRAPPER_NOTE,
      'The picker sets input.value directly and does not dispatch input or change events, so React onChange never runs. Update state in callbacks.onConfirm or picker.on("confirm", ...).',
      'The official wrapper `timepicker-ui-react` does this for you: see the react-wrapper recipe.',
    ],
    code: [
      "import { useEffect, useRef } from 'react';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'export function TimeField() {',
      '  const inputRef = useRef<HTMLInputElement>(null);',
      '',
      '  useEffect(() => {',
      '    if (!inputRef.current) return;',
      "    const picker = new TimepickerUI(inputRef.current, { clock: { type: '24h' } });",
      '    picker.create();',
      "    picker.on('confirm', (d) => console.log(d.hour, d.minutes));",
      '    return () => picker.destroy();',
      '  }, []);',
      '',
      '  return (',
      '    <div className="tp-ui">',
      '      <input ref={inputRef} type="text" placeholder="Select time" />',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
    docs: '/docs/guides/server-rendering',
  },
  'react-wrapper': {
    title: 'React with timepicker-ui-react',
    notes: [
      'Install with `npm install timepicker-ui-react`. It depends on timepicker-ui, so the CSS imports below resolve.',
      'Props: value / defaultValue, onConfirm, onUpdate, options (the grouped timepicker-ui options) and the usual input attributes such as name, required and placeholder.',
      'Keep a controlled value in state and update it in onConfirm (on OK) or onUpdate (on every change).',
    ],
    code: [
      "import { useState } from 'react';",
      "import { Timepicker } from 'timepicker-ui-react';",
      "import 'timepicker-ui/main.css';",
      '',
      'export function TimeField() {',
      "  const [time, setTime] = useState('10:00 AM');",
      '',
      '  return (',
      '    <Timepicker',
      '      value={time}',
      "      options={{ clock: { type: '12h' } }}",
      '      onConfirm={({ hour, minutes, type }) => setTime(`${hour}:${minutes} ${type}`)}',
      '    />',
      '  );',
      '}',
    ].join('\n'),
    docs: '/react/quick-start',
  },
  next: {
    title: 'Next.js (App Router)',
    notes: [
      "Pages and layouts are Server Components by default. Put the picker in a file that starts with 'use client'.",
      'Importing timepicker-ui on the server is safe: loading the package does not touch window or document. new TimepickerUI() on the server throws "TimepickerUI requires browser environment", so create it in useEffect, which runs only in the browser.',
      WRAPPER_NOTE,
    ],
    code: [
      "'use client';",
      '',
      "import { useEffect, useRef } from 'react';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'export function TimeField() {',
      '  const inputRef = useRef<HTMLInputElement>(null);',
      '',
      '  useEffect(() => {',
      '    if (!inputRef.current) return;',
      '    const picker = new TimepickerUI(inputRef.current);',
      '    picker.create();',
      '    return () => picker.destroy();',
      '  }, []);',
      '',
      '  return (',
      '    <div className="tp-ui">',
      '      <input ref={inputRef} type="text" placeholder="Select time" />',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
    docs: '/docs/guides/server-rendering',
  },
  vue: {
    title: 'Vue 3',
    notes: [
      'Create in onMounted and destroy in onBeforeUnmount. Keep the instance outside reactive state.',
      'Use a template ref to the input element.',
      WRAPPER_NOTE,
    ],
    code: [
      '<script setup lang="ts">',
      "import { ref, onMounted, onBeforeUnmount } from 'vue';",
      "import { TimepickerUI } from 'timepicker-ui';",
      "import 'timepicker-ui/main.css';",
      '',
      'const el = ref<HTMLInputElement | null>(null);',
      'let picker: TimepickerUI | null = null;',
      '',
      'onMounted(() => {',
      '  if (!el.value) return;',
      "  picker = new TimepickerUI(el.value, { clock: { type: '24h' } });",
      '  picker.create();',
      '});',
      '',
      'onBeforeUnmount(() => picker?.destroy());',
      '</script>',
      '',
      '<template>',
      '  <div class="tp-ui">',
      '    <input ref="el" type="text" />',
      '  </div>',
      '</template>',
    ].join('\n'),
    docs: '/docs/quick-start',
  },
  angular: {
    title: 'Angular',
    notes: [
      'Create in ngAfterViewInit (the input exists) and destroy in ngOnDestroy.',
      'Add timepicker-ui/main.css to the styles array in angular.json or import it in styles.css.',
      'Use ViewChild + ElementRef to reach the input.',
      WRAPPER_NOTE,
    ],
    code: [
      "import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';",
      "import { TimepickerUI } from 'timepicker-ui';",
      '',
      '@Component({',
      "  selector: 'app-time',",
      '  template: \'<div class="tp-ui"><input #time type="text" /></div>\',',
      '})',
      'export class TimeComponent implements AfterViewInit, OnDestroy {',
      "  @ViewChild('time') input!: ElementRef<HTMLInputElement>;",
      '  private picker?: TimepickerUI;',
      '',
      '  ngAfterViewInit() {',
      "    this.picker = new TimepickerUI(this.input.nativeElement, { clock: { type: '24h' } });",
      '    this.picker.create();',
      '  }',
      '',
      '  ngOnDestroy() {',
      '    this.picker?.destroy();',
      '  }',
      '}',
    ].join('\n'),
    docs: '/docs/quick-start',
  },
  svelte: {
    title: 'Svelte',
    notes: [
      'Bind the input, create in onMount and destroy in the returned cleanup.',
      'For SvelteKit the same code runs only in the browser, because onMount does not run on the server.',
      WRAPPER_NOTE,
    ],
    code: [
      '<script lang="ts">',
      "  import { onMount } from 'svelte';",
      "  import { TimepickerUI } from 'timepicker-ui';",
      "  import 'timepicker-ui/main.css';",
      '',
      '  let input: HTMLInputElement;',
      '',
      '  onMount(() => {',
      "    const picker = new TimepickerUI(input, { clock: { type: '24h' } });",
      '    picker.create();',
      '    return () => picker.destroy();',
      '  });',
      '</script>',
      '',
      '<div class="tp-ui">',
      '  <input bind:this={input} type="text" />',
      '</div>',
    ].join('\n'),
    docs: '/docs/guides/server-rendering',
  },
};

export interface MigrationMapping {
  group: string;
  rows: { from: string; to: string }[];
}

export const MIGRATION_V3_TO_V4: { summary: string[]; mappings: MigrationMapping[]; notes: string[] } = {
  summary: [
    'v4 replaced the flat options object (40+ fields) with grouped options. There is no backward-compatibility layer, so all v3 code must be updated.',
    'Event handling also moved to the EventEmitter API (picker.on(event, handler)) and the grouped callbacks.* options.',
    'The "to" column uses the 4.5.0 names. 4.0-4.4 used older names for some of them; the v4.4->v4.5 path lists every rename.',
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
        { from: 'currentTime', to: 'clock.defaultTime' },
      ],
    },
    {
      group: 'ui',
      rows: [
        { from: 'theme', to: 'ui.theme' },
        { from: 'animation', to: 'ui.animation' },
        { from: 'backdrop', to: 'ui.backdrop' },
        { from: 'mobile', to: 'ui.initialView' },
        { from: 'enableSwitchIcon', to: 'ui.viewSwitch' },
        { from: 'editable', to: 'ui.editable' },
        { from: 'enableScrollbar', to: 'ui.allowPageScroll' },
        { from: 'cssClass', to: 'ui.cssClass' },
        { from: 'appendModalSelector', to: 'ui.appendTo' },
        { from: 'iconTemplate', to: 'ui.keyboardIcon' },
        { from: 'iconTemplateMobile', to: 'ui.clockIcon' },
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
        { from: 'timeLabel', to: 'labels.clockTitle' },
        { from: 'mobileTimeLabel', to: 'labels.keyboardTitle' },
        { from: 'hourMobileLabel', to: 'labels.hour' },
        { from: 'minuteMobileLabel', to: 'labels.minute' },
      ],
    },
    {
      group: 'behavior',
      rows: [
        { from: 'focusInputAfterCloseModal', to: 'behavior.returnFocus' },
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
        { from: 'onSelectAM / onSelectPM', to: 'callbacks.onSelectPeriod' },
        { from: 'onError', to: 'callbacks.onError' },
      ],
    },
  ],
  notes: [
    'Reading options also changed: options.clockType -> options.clock.type, options.amLabel -> options.labels.am.',
    'setOptions() takes grouped options too: setOptions({ clock: { type: "24h" } }).',
    'Some values changed shape: mobile: true becomes ui.initialView: "keyboard", currentTime: true becomes clock.defaultTime: "now".',
    'CSS class names were renamed in v4 (tp-ui- prefix). Re-check any custom CSS selectors.',
  ],
};

export const MIGRATION_V43_TO_V44: string[] = [
  'Non-breaking. Adds the blueprint and blueprint-dark themes.',
  'Adds 16 localizable accessibility labels under labels.* (e.g. hourLabel, minuteLabel, announceHour).',
  'Adds Home/End/PageUp/PageDown keyboard navigation. No migration needed.',
];

export const MIGRATION_V44_TO_V45: string[] = [
  'Non-breaking. With clock.showSeconds off (the default) values, getValue() and event payloads are the same as in 4.4.',
  'Optional seconds: clock.showSeconds, clock.incrementSeconds (1, 5, 10, 15, 20 or 30), clock.autoSwitchToSeconds and clock.disabledTime.seconds. Values become HH:MM:SS or HH:MM:SS AM/PM.',
  'New label labels.second; new event select:second and callbacks.onSelectSecond; seconds on open, confirm and update; durationSeconds on range:confirm and range:validation.',
  'Range edges in clock.disabledTime.ranges may carry seconds. An edge without seconds covers its whole minute, so 4.4 ranges disable the same minutes.',
  'setOptions() (and update()) with an invalid disabledTime reports it through the error event and keeps the previous options instead of throwing.',
  'behavior.returnFocus (formerly focusInputAfterClose) still defaults to false; 5.0 makes true the default, so set it to true now.',
  'Many options were renamed. The old names still work and are removed in 5.0; when both are set, the new name wins. `renamed` below lists every pair.',
  'New: setOptions(), select:period with onSelectPeriod, switch:face with onSwitchFace, clock.type: "auto" (12h or 24h from the browser locale); ui.appendTo and ui.inline.container also accept an element.',
  'The focus ring is a single 3px ring in --tp-focus-ring; --tp-focus-ring-halo was removed.',
  'Deprecated (removed in 5.0): OptionTypes (use TimepickerOptions), labels.timezoneSelectorLabel, labels.format24Label, labels.toggleLabel, clock.currentTime.locales, getValue().degreesHours / degreesMinutes, the hide event, update() (use setOptions()), select:am / select:pm with onSelectAM / onSelectPM (use select:period / onSelectPeriod) and the renamed option names.',
];

export const MIGRATION_V45_TO_V5 = {
  status:
    '5.0 is not released and the guide is a draft: it lists what is decided so far. Every step under stepsNow works on 4.5.0 today.',
  stepsNow: [
    'Upgrade to 4.5.0. Editors show deprecated APIs with a strikethrough; replace each one using `removed`.',
    'Move to the option names in `renamed`, and replace update() with setOptions().',
    'If you use callbacks.onSelectHour or select:hour to notice that the clock face changed, use switch:face or callbacks.onSwitchFace.',
    'Set behavior.returnFocus: true, so the 5.0 default does not change how your page behaves.',
    'Move code you pass as a callback to open() or destroy() to the line after the call. 5.0 removes these callback arguments.',
    'Keep custom CSS that targets tp-ui-* classes in one place, so the 5.0 class rename touches few files.',
  ],
  changedDefaults: [
    'behavior.returnFocus defaults to true in 5.0: on close, focus goes back to the input or to the data-open element that opened the picker. In 4.5.0 the default is false.',
    "New ui.colorScheme defaults to 'auto', so the picker matches a light or dark page and basic shows its dark version on a dark page. Set ui.colorScheme: 'light' to keep the light picker everywhere.",
  ],
  otherChanges: [
    'select:hour, select:minute and select:second fire once when a value of their unit is picked, in every mode. In 4.5.0 clock mode they fire when a field is activated; listen to switch:face for face changes.',
    'ui.footer replaces ui.inline.showButtons and wheel.hideFooter.',
    'behavior.commitOnChange replaces ui.inline.autoUpdate and wheel.commitOnScroll: each picked value is written to the input and confirm fires with autoCommit: true.',
    'behavior.ignoreOutsideClick replaces wheel.ignoreOutsideClick and works in every mode.',
    'ui.cssClass is applied to one element instead of two. Check CSS that uses your class.',
    'TimepickerEventMap loses the internal events range:minute:commit and animation:*, and its catch-all index signature, so on("typo") becomes a type error.',
    'Removed without a 4.5.0 deprecation warning: behavior.delayHandler, TimepickerUI.isAvailable() (use document.querySelector(...) !== null), the instance getters hour / minutes / okButton / cancelButton / clockHand, the callback arguments of open() and destroy(), and the RangeManager / TimezoneManager / WheelManager exports.',
    'Plugins get a new registration API (not designed yet). Import paths timepicker-ui/plugins/range, /timezone and /wheel stay; the ./plugins/* wildcard export and the plugin UMD builds are removed.',
    'CSS classes keep the tp-ui- prefix but are renamed after Material Design component names. About 50 custom properties that no rule reads are removed.',
    "The dark theme is removed: use ui.colorScheme: 'dark'. crane-straight becomes a variant of crane. ui.keyboardIcon and ui.clockIcon take an element or a factory function instead of an HTML string.",
  ],
};

export const IO_CONTRACT = {
  getValue:
    'getValue() returns { hour: string; minutes: string; seconds?: string; type?: string; time: string; degreesHours: number | null; degreesMinutes: number | null }. seconds is present only with clock.showSeconds; type is the period (AM/PM) on a 12h clock. degreesHours / degreesMinutes are deprecated (removed in 5.0). While the picker is open the value is the shown selection, otherwise the input value.',
  setValue:
    'setValue(time, updateInput = true) accepts "HH:MM" (24h) or "h:MM AM/PM" (12h); with clock.showSeconds also "HH:MM:SS" / "h:MM:SS AM/PM" (no seconds means :00). A valid time in the other clock format is converted ("2:30 PM" sets 14:30 on a 24h picker). An invalid string changes nothing and emits error; an empty string is ignored.',
};
