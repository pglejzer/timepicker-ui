import { TimepickerUI, highlightCodeBlocks } from './setup';

type Options = Record<string, any>;

interface SecondsExample {
  id: string;
  title: string;
  hint: string;
  value?: string;
  options: Options;
  inlineContainer?: boolean;
}

interface ThemeVariant {
  key: string;
  label: string;
  value: string;
  options: Options;
}

const VALUE_12H = '02:30:15 PM';
const VALUE_24H = '14:30:45';

const THEMES = [
  'basic',
  'crane',
  'crane-straight',
  'm2',
  'm3-green',
  'dark',
  'glassmorphic',
  'pastel',
  'ai',
  'cyberpunk',
  'blueprint',
  'blueprint-dark',
];

const OUTPUT_EVENTS = ['open', 'confirm', 'cancel', 'clear', 'error', 'range:confirm', 'timezone:change'];

const LOG_EVENTS = [
  'open',
  'select:hour',
  'select:minute',
  'select:second',
  'select:period',
  'switch:face',
  'update',
  'confirm',
  'cancel',
  'clear',
  'error',
];

const EXAMPLES: SecondsExample[] = [
  {
    id: 'clock-12h',
    title: 'Clock 12h',
    hint: 'Hours → minutes → seconds face, then AM/PM. Value 02:30:15 PM.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true } },
  },
  {
    id: 'clock-24h',
    title: 'Clock 24h',
    hint: 'Inner ring for 13–00, then minutes, then seconds.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true } },
  },
  {
    id: 'empty',
    title: 'Empty input',
    hint: 'No value: the picker starts from its default time with :00 seconds.',
    options: { clock: { type: '24h', showSeconds: true } },
  },
  {
    id: 'hhmm-value',
    title: 'HH:MM value, seconds on',
    hint: 'A value without seconds is accepted and means :00.',
    value: '09:15',
    options: { clock: { type: '24h', showSeconds: true } },
  },
  {
    id: 'hhmmss-seconds-off',
    title: 'HH:MM:SS value, seconds off',
    hint: 'Seconds in the value are accepted and dropped, without an error.',
    value: '09:15:42',
    options: { clock: { type: '24h' } },
  },
  {
    id: 'step-5',
    title: 'incrementSeconds: 5',
    hint: 'Seconds face snaps to 00, 05, 10…',
    value: '08:00:05',
    options: { clock: { type: '24h', showSeconds: true, incrementSeconds: 5 } },
  },
  {
    id: 'step-15-12h',
    title: 'incrementSeconds: 15 (12h)',
    hint: 'Only 00, 15, 30, 45. Arrow keys on the seconds field step by 15.',
    value: '11:45:30 AM',
    options: { clock: { type: '12h', showSeconds: true, incrementSeconds: 15 } },
  },
  {
    id: 'step-minutes-5-seconds-30',
    title: 'Minutes step 5, seconds step 30',
    hint: 'Both steps at once; PageUp/PageDown move 5 steps.',
    value: '10:25:30',
    options: { clock: { type: '24h', showSeconds: true, incrementMinutes: 5, incrementSeconds: 30 } },
  },
  {
    id: 'no-autoswitch-seconds',
    title: 'autoSwitchToSeconds: false',
    hint: 'After picking minutes the face stays on minutes; click the SS field to go on.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true, autoSwitchToSeconds: false } },
  },
  {
    id: 'manual-units',
    title: 'No auto switching at all',
    hint: 'autoSwitchToMinutes and autoSwitchToSeconds off: choose every unit by its field.',
    value: VALUE_12H,
    options: {
      clock: { type: '12h', showSeconds: true, autoSwitchToMinutes: false, autoSwitchToSeconds: false },
    },
  },
  {
    id: 'smooth-hour',
    title: 'discreteHourJump',
    hint: 'Hour hand glides while dragging; seconds face behaves like minutes.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true, discreteHourJump: false } },
  },
  {
    id: 'switch-icon',
    title: 'Switch icon (keyboard ↔ clock)',
    hint: 'Toggle to the keyboard view and type all three fields.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { viewSwitch: true } },
  },
  {
    id: 'editable',
    title: 'Editable header',
    hint: 'Type 75 into the seconds field and leave it: it clamps to 59, never NaN.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { editable: true } },
  },
  {
    id: 'mobile-12h',
    title: 'Mobile 12h',
    hint: 'Three fields with captions Hour / Minute / Second.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, ui: { initialView: 'keyboard' } },
  },
  {
    id: 'mobile-24h-switch',
    title: 'Mobile 24h + switch icon',
    hint: 'Keyboard view first, switch to the clock face for seconds.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { initialView: 'keyboard', viewSwitch: true } },
  },
  {
    id: 'wheel-12h',
    title: 'Wheel 12h',
    hint: 'Header with three fields and a seconds column (64px columns).',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, ui: { mode: 'wheel' } },
  },
  {
    id: 'wheel-24h',
    title: 'Wheel 24h',
    hint: 'Tab moves hour → minute → second column; arrows scroll one item.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { mode: 'wheel' } },
  },
  {
    id: 'wheel-steps',
    title: 'Wheel with steps',
    hint: 'Minutes every 5, seconds every 10.',
    value: '07:35:20',
    options: {
      clock: { type: '24h', showSeconds: true, incrementMinutes: 5, incrementSeconds: 10 },
      ui: { mode: 'wheel' },
    },
  },
  {
    id: 'compact-24h',
    title: 'Compact-wheel 24h',
    hint: 'Columns HH : MM : SS in a modal.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { mode: 'compact-wheel' } },
  },
  {
    id: 'compact-12h',
    title: 'Compact-wheel 12h',
    hint: 'Columns HH : MM : SS AM/PM.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, ui: { mode: 'compact-wheel' } },
  },
  {
    id: 'popover-12h',
    title: 'Popover 12h (placement auto)',
    hint: 'Four columns must fit the 328px popover.',
    value: VALUE_12H,
    options: {
      clock: { type: '12h', showSeconds: true },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'auto' },
    },
  },
  {
    id: 'popover-top',
    title: 'Popover 24h (placement top)',
    hint: 'Opens above the input.',
    value: VALUE_24H,
    options: {
      clock: { type: '24h', showSeconds: true },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'top' },
    },
  },
  {
    id: 'popover-commit',
    title: 'Popover commitOnScroll + hideFooter',
    hint: 'Every scroll stop writes HH:MM:SS to the input, no buttons.',
    value: VALUE_24H,
    options: {
      clock: { type: '24h', showSeconds: true },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'bottom', commitOnScroll: true, hideFooter: true },
    },
  },
  {
    id: 'hide-disabled',
    title: 'hideDisabled seconds',
    hint: 'Seconds 00, 15, 30, 45 are removed from the wheel column.',
    value: '12:10:20',
    options: {
      clock: { type: '24h', showSeconds: true, disabledTime: { seconds: [0, 15, 30, 45] } },
      ui: { mode: 'compact-wheel' },
      wheel: { hideDisabled: true },
    },
  },
  {
    id: 'disabled-12h',
    title: 'Disabled interval with seconds (12h)',
    hint: '10:00:30 AM – 10:05 AM is disabled. The end has no seconds, so it covers the whole minute (to 10:05:59).',
    value: '10:06:15 AM',
    options: {
      clock: {
        type: '12h',
        showSeconds: true,
        disabledTime: { ranges: '10:00:30 AM - 10:05 AM' },
      },
    },
  },
  {
    id: 'disabled-24h',
    title: 'Disabled lists (24h)',
    hint: 'Hour 03, minute 59 and seconds :00 / :30 are disabled.',
    value: '12:00:45',
    options: {
      clock: {
        type: '24h',
        showSeconds: true,
        disabledTime: { hours: [3], minutes: [59], seconds: [0, 30] },
      },
    },
  },
  {
    id: 'disabled-24h-intervals',
    title: 'Two intervals (24h)',
    hint: '12:00:00–12:00:30 and 18:30:00–18:45:15 are disabled. With intervals set, the hours/minutes/seconds lists are ignored.',
    value: '12:00:45',
    options: {
      clock: {
        type: '24h',
        showSeconds: true,
        disabledTime: { ranges: ['12:00:00 - 12:00:30', '18:30 - 18:45:15'] },
      },
    },
  },
  {
    id: 'disabled-noon',
    title: 'Interval crossing noon (12h)',
    hint: '11:59:30 AM – 12:00:30 PM: seconds disabled in both periods.',
    value: '11:59:15 AM',
    options: {
      clock: { type: '12h', showSeconds: true, disabledTime: { ranges: '11:59:30 AM - 12:00:30 PM' } },
    },
  },
  {
    id: 'wheel-disabled',
    title: 'Wheel with disabled seconds',
    hint: 'Disabled seconds are dimmed and skipped by the keyboard.',
    value: '09:20:10',
    options: {
      clock: { type: '24h', showSeconds: true, disabledTime: { seconds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } },
      ui: { mode: 'wheel' },
    },
  },
  {
    id: 'range-24h',
    title: 'Range 24h',
    hint: 'From commits after the seconds face, then To. Shows duration and durationSeconds.',
    options: { clock: { type: '24h', showSeconds: true }, range: { enabled: true } },
  },
  {
    id: 'range-12h',
    title: 'Range 12h, minDuration 1',
    hint: 'Same minute as From: seconds before From are disabled on To.',
    options: {
      clock: { type: '12h', showSeconds: true },
      range: { enabled: true, minDuration: 1 },
      labels: { rangeFrom: 'Start', rangeTo: 'End' },
    },
  },
  {
    id: 'inline',
    title: 'Inline + autoUpdate',
    hint: 'Every change is written to the input with seconds.',
    value: VALUE_24H,
    inlineContainer: true,
    options: {
      clock: { type: '24h', showSeconds: true },
      ui: {
        inline: {
          enabled: true,
          container: '#seconds-inline-container',
          showButtons: false,
          autoUpdate: true,
        },
      },
    },
  },
  {
    id: 'inline-wheel',
    title: 'Inline wheel with buttons',
    hint: 'Height follows the content (no 500px floor).',
    value: VALUE_12H,
    inlineContainer: true,
    options: {
      clock: { type: '12h', showSeconds: true },
      ui: {
        mode: 'wheel',
        inline: { enabled: true, container: '#seconds-inline-wheel-container', showButtons: true },
      },
    },
  },
  {
    id: 'inline-wheel-no-buttons',
    title: 'Inline wheel without buttons',
    hint: 'No footer. autoUpdate writes every scroll to the input, with seconds.',
    value: VALUE_24H,
    inlineContainer: true,
    options: {
      clock: { type: '24h', showSeconds: true },
      ui: {
        mode: 'wheel',
        inline: {
          enabled: true,
          container: '#seconds-inline-wheel-no-buttons-container',
          showButtons: false,
          autoUpdate: true,
        },
      },
    },
  },
  {
    id: 'inline-wheel-no-buttons-seconds-off',
    title: 'Inline wheel without buttons, seconds off',
    hint: 'The same picker without seconds, for comparison.',
    value: '14:30',
    inlineContainer: true,
    options: {
      clock: { type: '24h' },
      ui: {
        mode: 'wheel',
        inline: {
          enabled: true,
          container: '#seconds-inline-wheel-no-buttons-off-container',
          showButtons: false,
          autoUpdate: true,
        },
      },
    },
  },
  {
    id: 'inline-wheel-seconds-off',
    title: 'Inline wheel with buttons, seconds off',
    hint: 'The 12h wheel with buttons, without seconds.',
    value: '02:30 PM',
    inlineContainer: true,
    options: {
      clock: { type: '12h' },
      ui: {
        mode: 'wheel',
        inline: { enabled: true, container: '#seconds-inline-wheel-off-container', showButtons: true },
      },
    },
  },
  {
    id: 'timezone',
    title: 'Timezone plugin',
    hint: 'Timezone dropdown under the header; seconds unaffected.',
    value: VALUE_24H,
    options: {
      clock: { type: '24h', showSeconds: true },
      timezone: { enabled: true, default: 'Europe/Warsaw' },
    },
  },
  {
    id: 'clear',
    title: 'Clear button',
    hint: 'Clear empties all three fields and announces labels.announceCleared.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, ui: { clearButton: true } },
  },
  {
    id: 'current-time',
    title: 'defaultTime',
    hint: 'Starts on the current time including seconds and writes it to the input.',
    options: { clock: { type: '24h', showSeconds: true, defaultTime: 'now' } },
  },
  {
    id: 'polish',
    title: 'Polish labels',
    hint: 'Value keeps AM/PM tokens; only the visible text is translated.',
    value: VALUE_12H,
    options: {
      clock: { type: '12h', showSeconds: true },
      ui: { viewSwitch: true },
      labels: {
        am: 'rano',
        pm: 'po poł.',
        ok: 'Zatwierdź',
        cancel: 'Anuluj',
        clockTitle: 'Wybierz godzinę',
        hour: 'Godzina',
        minute: 'Minuta',
        second: 'Sekunda',
        switchToClock: 'Pokaż zegar',
        switchToKeyboard: 'Pokaż klawiaturę',
      },
    },
  },
  {
    id: 'no-backdrop',
    title: 'No backdrop, no animation',
    hint: 'Modal without overlay and transitions.',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { backdrop: false, animation: false } },
  },
  {
    id: 'focus-trap-off',
    title: 'focusTrap off',
    hint: 'Tab can leave the modal; Esc still cancels once.',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, behavior: { focusTrap: false } },
  },
];

const THEME_VARIANTS: ThemeVariant[] = [
  {
    key: 'clock-12h',
    label: 'Clock 12h',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true } },
  },
  {
    key: 'clock-24h',
    label: 'Clock 24h',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true } },
  },
  {
    key: 'wheel-12h',
    label: 'Wheel 12h',
    value: VALUE_12H,
    options: { clock: { type: '12h', showSeconds: true }, ui: { mode: 'wheel' } },
  },
  {
    key: 'compact-24h',
    label: 'Compact 24h',
    value: VALUE_24H,
    options: { clock: { type: '24h', showSeconds: true }, ui: { mode: 'compact-wheel' } },
  },
  {
    key: 'popover-12h',
    label: 'Popover 12h',
    value: VALUE_12H,
    options: {
      clock: { type: '12h', showSeconds: true },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'auto' },
    },
  },
];

const INPUT_CLASS =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const OUTPUT_CLASS =
  'min-h-[2.5rem] p-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all';

const indent = (depth: number): string => '  '.repeat(depth);

const toJs = (value: unknown, depth = 0): string => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => toJs(item, depth)).join(', ')}]`;
  }
  if (value && typeof value === 'object') {
    const lines = Object.entries(value).map(
      ([key, item]) => `${indent(depth + 1)}${key}: ${toJs(item, depth + 1)},`,
    );
    return `{\n${lines.join('\n')}\n${indent(depth)}}`;
  }
  return typeof value === 'string' ? `'${value}'` : String(value);
};

const snippetFor = (inputId: string, value: string | undefined, options: Options): string => {
  const valueAttr = value ? ` value="${value}"` : '';
  return [
    `// <input id="${inputId}"${valueAttr} />`,
    `const picker = new TimepickerUI('#${inputId}', ${toJs(options)});`,
    'picker.create();',
  ].join('\n');
};

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const createInput = (id: string, value?: string): HTMLInputElement => {
  const input = el('input', INPUT_CLASS);
  input.id = id;
  input.type = 'text';
  input.value = value ?? '';
  input.placeholder = 'HH:MM:SS';
  return input;
};

const createCode = (code: string): HTMLDetailsElement => {
  const details = el('details', 'text-sm');
  details.appendChild(el('summary', 'cursor-pointer text-gray-600 dark:text-gray-400', 'Code'));
  const pre = el('pre', 'mt-2');
  pre.appendChild(el('code', 'language-javascript', code));
  details.appendChild(pre);
  return details;
};

const formatEvent = (event: string, data: unknown, picker: TimepickerUI): string => {
  const payload = JSON.stringify(data ?? {}, null, 1).replace(/\n\s*/g, ' ');
  if (event !== 'confirm') return `${event}: ${payload}`;
  return `${event}: ${payload}\ngetValue(): ${JSON.stringify(picker.getValue()).replace(/,/g, ', ')}`;
};

const watch = (picker: TimepickerUI, output: HTMLElement, events: string[]): void => {
  const bus = picker as any;
  events.forEach((event) => {
    bus.on(event, (data: unknown) => {
      output.textContent = formatEvent(event, data, picker);
    });
  });
};

const createPicker = (input: HTMLInputElement, options: Options): TimepickerUI | null => {
  try {
    const picker = new TimepickerUI(input, options as any);
    picker.create();
    return picker;
  } catch (error) {
    console.error(`[seconds demo] #${input.id}`, error);
    return null;
  }
};

const renderExample = (example: SecondsExample): HTMLElement => {
  const inputId = `seconds-${example.id}`;
  const card = el(
    'div',
    'p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 space-y-3 min-w-0',
  );
  const header = el('div', 'flex items-baseline justify-between gap-2');
  header.appendChild(el('h4', 'font-semibold text-gray-900 dark:text-white', example.title));
  header.appendChild(el('code', 'text-xs text-gray-500 dark:text-gray-400', `#${inputId}`));
  card.appendChild(header);
  card.appendChild(el('p', 'text-sm text-gray-600 dark:text-gray-300', example.hint));
  const input = createInput(inputId, example.value);
  card.appendChild(input);
  if (example.inlineContainer) {
    const container = el('div', 'rounded-lg');
    container.id = example.options.ui.inline.container.slice(1);
    card.appendChild(container);
  }
  const output = el('pre', OUTPUT_CLASS, '—');
  card.appendChild(output);
  card.appendChild(createCode(snippetFor(inputId, example.value, example.options)));
  queueMicrotask(() => {
    const picker = createPicker(input, example.options);
    if (picker) watch(picker, output, OUTPUT_EVENTS);
  });
  return card;
};

const renderThemeMatrix = (root: HTMLElement): void => {
  THEMES.forEach((theme) => {
    const glass =
      theme === 'glassmorphic' ? ' bg-gradient-to-br from-fuchsia-500 via-sky-500 to-emerald-400' : '';
    const card = el(
      'div',
      `p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 min-w-0${glass}`,
    );
    card.appendChild(el('h4', 'font-semibold text-gray-900 dark:text-white', theme));
    THEME_VARIANTS.forEach((variant) => {
      const inputId = `seconds-theme-${theme}-${variant.key}`;
      const label = el('label', 'block text-xs text-gray-600 dark:text-gray-300', variant.label);
      label.htmlFor = inputId;
      const input = createInput(inputId, variant.value);
      card.appendChild(label);
      card.appendChild(input);
      queueMicrotask(() => {
        createPicker(input, { ...variant.options, ui: { ...(variant.options.ui ?? {}), theme } });
      });
    });
    root.appendChild(card);
  });
};

const renderApiPlayground = (root: HTMLElement): void => {
  const input = createInput('seconds-api', VALUE_24H);
  const output = el('pre', OUTPUT_CLASS, '—');
  const buttons = el('div', 'flex flex-wrap gap-2');
  root.appendChild(input);
  root.appendChild(buttons);
  root.appendChild(output);

  const picker = createPicker(input, { clock: { type: '24h', showSeconds: true } });
  if (!picker) return;
  watch(picker, output, ['confirm', 'error', 'update']);

  let seconds = true;
  let clockType: '12h' | '24h' = '24h';
  const show = (label: string, data: unknown): void => {
    output.textContent = `${label}\n${JSON.stringify(data, null, 2)}`;
  };
  const actions: Array<[string, () => void]> = [
    ['getValue()', () => show('getValue()', picker.getValue())],
    ["setValue('14:30:15')", () => picker.setValue('14:30:15')],
    ["setValue('09:05')", () => picker.setValue('09:05')],
    ["setValue('2:30:15 PM')", () => picker.setValue('2:30:15 PM')],
    ["setValue('03:45:59 AM')", () => picker.setValue('03:45:59 AM')],
    ["setValue('25:00:00') → error", () => picker.setValue('25:00:00')],
    ['open()', () => picker.open()],
    [
      'toggle showSeconds',
      () => {
        seconds = !seconds;
        picker.setOptions({ clock: { showSeconds: seconds } });
        show('showSeconds', seconds);
      },
    ],
    [
      'toggle 12h / 24h',
      () => {
        clockType = clockType === '24h' ? '12h' : '24h';
        picker.setOptions({ clock: { type: clockType } });
        show('clock.type', clockType);
      },
    ],
    [
      'incrementSeconds 15',
      () => {
        picker.setOptions({ clock: { incrementSeconds: 15 } });
        show('incrementSeconds', 15);
      },
    ],
    ['input.value', () => show('input.value', input.value)],
  ];
  actions.forEach(([label, run]) => {
    const button = el(
      'button',
      'px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors',
      label,
    );
    button.type = 'button';
    button.addEventListener('click', run);
    buttons.appendChild(button);
  });
};

const renderEventLog = (root: HTMLElement): void => {
  const input = createInput('seconds-events', VALUE_12H);
  const clear = el(
    'button',
    'px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-700 text-white',
    'Clear log',
  );
  clear.type = 'button';
  const log = el(
    'ol',
    'mt-2 max-h-72 overflow-auto text-xs font-mono space-y-1 text-gray-700 dark:text-gray-300',
  );
  root.appendChild(input);
  root.appendChild(clear);
  root.appendChild(log);

  const write = (source: string, data: unknown): void => {
    const time = new Date().toLocaleTimeString();
    log.prepend(el('li', '', `${time}  ${source}  ${JSON.stringify(data ?? {})}`));
    while (log.children.length > 60) log.lastElementChild?.remove();
  };
  clear.addEventListener('click', () => log.replaceChildren());

  const picker = createPicker(input, {
    clock: { type: '12h', showSeconds: true },
    ui: { clearButton: true },
    callbacks: { onSelectSecond: (data: unknown) => write('callbacks.onSelectSecond', data) },
  });
  if (!picker) return;
  const bus = picker as any;
  LOG_EVENTS.forEach((event) => bus.on(event, (data: unknown) => write(event, data)));
};

const examplesRoot = document.getElementById('seconds-examples');
const themesRoot = document.getElementById('seconds-themes');
const apiRoot = document.getElementById('seconds-api-playground');
const eventsRoot = document.getElementById('seconds-event-log');

if (examplesRoot && themesRoot && apiRoot && eventsRoot) {
  EXAMPLES.forEach((example) => examplesRoot.appendChild(renderExample(example)));
  renderThemeMatrix(themesRoot);
  renderApiPlayground(apiRoot);
  renderEventLog(eventsRoot);
  highlightCodeBlocks(examplesRoot);
}
