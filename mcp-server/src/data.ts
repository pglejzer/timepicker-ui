import { META } from './generated.js';

export const LIBRARY_VERSION = META.library;
export const SITE_URL = META.siteUrl;

export function docsUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function optionGroupDocs(group: string): string {
  if (group === 'clearBehavior') return docsUrl('/docs/features/clear-button');
  return docsUrl(`/docs/api/options#${group.toLowerCase()}-options`);
}

export const DOCS = {
  methods: docsUrl('/docs/api/methods'),
  events: docsUrl('/docs/api/events#available-events'),
  cssVariables: docsUrl('/docs/api/css-variables'),
  cssClasses: docsUrl('/docs/api/css-classes'),
  styling: docsUrl('/docs/advanced/styling'),
  themes: docsUrl('/docs/features/themes'),
  plugins: docsUrl('/docs/features/plugins'),
  migrationV4: docsUrl('/docs/migration-guide'),
  migrationV5: docsUrl('/docs/migration-guide-v5'),
  renamed: docsUrl('/docs/api/options#renamed'),
  troubleshooting: docsUrl('/docs/guides/troubleshooting'),
  changelog: docsUrl('/docs/changelog'),
  llms: docsUrl('/llms.txt'),
};

export interface ThemeInfo {
  name: string;
  cssImport: string;
  note?: string;
}

export const THEMES: ThemeInfo[] = [
  { name: 'basic', cssImport: 'timepicker-ui/main.css', note: 'default theme, bundled in main.css' },
  { name: 'ai', cssImport: 'timepicker-ui/theme-ai.css' },
  { name: 'blueprint', cssImport: 'timepicker-ui/theme-blueprint.css', note: 'added in v4.4' },
  { name: 'blueprint-dark', cssImport: 'timepicker-ui/theme-blueprint-dark.css', note: 'added in v4.4' },
  { name: 'crane', cssImport: 'timepicker-ui/theme-crane.css' },
  { name: 'crane-straight', cssImport: 'timepicker-ui/theme-crane-straight.css' },
  { name: 'cyberpunk', cssImport: 'timepicker-ui/theme-cyberpunk.css' },
  { name: 'dark', cssImport: 'timepicker-ui/theme-dark.css' },
  { name: 'glassmorphic', cssImport: 'timepicker-ui/theme-glassmorphic.css' },
  { name: 'm2', cssImport: 'timepicker-ui/theme-m2.css' },
  { name: 'm3-green', cssImport: 'timepicker-ui/theme-m3-green.css' },
  { name: 'pastel', cssImport: 'timepicker-ui/theme-pastel.css' },
];

export const THEME_NAMES = THEMES.map((t) => t.name);

export interface ModeInfo {
  name: string;
  description: string;
  requiresPlugin?: string;
}

export const MODES: ModeInfo[] = [
  { name: 'clock', description: 'Analog clock face with draggable hands (default).' },
  {
    name: 'wheel',
    description: 'Scroll wheel spinner.',
    requiresPlugin: 'wheel',
  },
  {
    name: 'compact-wheel',
    description: 'Wheel without the header. Opens as a modal, or as a popover next to the input with wheel.placement.',
    requiresPlugin: 'wheel',
  },
];

export const MODE_NAMES = MODES.map((m) => m.name);

export interface PluginInfo {
  name: string;
  export: string;
  importPath: string;
  umdFile: string;
  umdGlobal: string;
  description: string;
  enableOption: string;
}

export const PLUGINS: PluginInfo[] = [
  {
    name: 'range',
    export: 'RangePlugin',
    importPath: 'timepicker-ui/plugins/range',
    umdFile: 'dist/plugins/range.umd.js',
    umdGlobal: 'TimepickerUIRange',
    description: 'Start/end time selection with a tab UI, in clock, wheel and compact-wheel mode (wheel modes since 4.7.0).',
    enableOption: 'range: { enabled: true }',
  },
  {
    name: 'timezone',
    export: 'TimezonePlugin',
    importPath: 'timepicker-ui/plugins/timezone',
    umdFile: 'dist/plugins/timezone.umd.js',
    umdGlobal: 'TimepickerUITimezone',
    description: 'Timezone dropdown with keyboard navigation.',
    enableOption: "timezone: { enabled: true, default: 'Europe/Warsaw' }",
  },
  {
    name: 'wheel',
    export: 'WheelPlugin',
    importPath: 'timepicker-ui/plugins/wheel',
    umdFile: 'dist/plugins/wheel.umd.js',
    umdGlobal: 'TimepickerUIWheel',
    description: 'Enables the wheel / compact-wheel UI modes, drag and momentum.',
    enableOption: "ui: { mode: 'wheel' }",
  },
];

export const PLUGIN_NAMES = PLUGINS.map((p) => p.name);

export interface ApiMethod {
  signature: string;
  description: string;
  static?: boolean;
  deprecated?: string;
}

export const API_METHODS: ApiMethod[] = [
  { signature: 'new TimepickerUI(selectorOrElement, options?)', description: 'Construct an instance.' },
  { signature: 'create()', description: 'Initialize and render the picker. An inline picker mounts right away.' },
  {
    signature: 'open(callback?)',
    description: 'Open the picker.',
    deprecated: 'The callback argument is removed in 5.0. Run that code after the call or use picker.once("open", ...).',
  },
  {
    signature: 'close(update?, callback?)',
    description:
      'Close the picker. update: true commits the selection like OK (updates the input and emits confirm); otherwise the selection is discarded.',
  },
  {
    signature: 'destroy(options?)',
    description: 'Remove listeners and DOM. options: { keepInputValue?, callback? } or a callback.',
    deprecated: 'The callback forms destroy(cb) and destroy({ callback }) are removed in 5.0.',
  },
  {
    signature: 'getValue()',
    description:
      'Returns { hour, minutes, seconds?, type?, time, degreesHours, degreesMinutes }. seconds is present only with clock.showSeconds. While open it is the shown selection, otherwise the input value.',
  },
  {
    signature: 'setValue(time, updateInput = true)',
    description:
      'Set the time, e.g. "14:30", "2:30 PM" or "14:30:15". Invalid strings emit error and change nothing. In range mode it sets the active end and writes "from - to" (since 4.7.0).',
  },
  {
    signature: 'setOptions(options)',
    description:
      'Change options at runtime; groups you leave out keep their values. On an open picker a change of ui.initialView switches to that view and emits switch:view once. An open range picker keeps both ends and the active end, and commits a typed time first (since 4.7.0).',
  },
  {
    signature: 'setRange({ from?, to? }, updateInput = true)',
    description:
      'Range plugin: set one or both ends, e.g. { from: "09:00", to: "17:00" } or { to: "18:00" }, without moving focus. A missing end keeps its value, null or "" clears it (since 4.7.0). Emits range:validation, not range:change. On a closed picker the value is used on the next open. Since 4.6.0.',
  },
  {
    signature: 'getRange()',
    description:
      'Range plugin: { from, to }, each { hour, minutes, seconds?, type? } or null when that end is not set. Returns null without the range plugin. Since 4.6.0.',
  },
  {
    signature: 'setActivePart(part)',
    description:
      'Range plugin: switch to "from" or "to" without moving focus. Returns false when the part cannot be selected. On an open picker a time typed into the current end is committed first and emits range:change (since 4.7.0). On a closed picker it applies on the next open. Since 4.6.0.',
  },
  {
    signature: 'getActivePart()',
    description:
      'Range plugin: "from" or "to", or null without the range plugin (emits error) and after destroy(). Since 4.7.0.',
  },
  {
    signature: 'setRangeCaptions({ from?, to? })',
    description:
      'Range plugin: show a second line under a range tab label, e.g. the date of that end. Plain text, part of the tab name. A missing key keeps its caption, null or "" removes it. Emits no event. Since 4.7.0.',
  },
  {
    signature: 'setView(view)',
    description:
      'Show "clock" or "keyboard", works without ui.viewSwitch. Open: switches at once and emits switch:view { view }. Closed: the next open starts in that view. Returns false in wheel and compact-wheel mode and after destroy(). Since 4.7.0.',
  },
  {
    signature: 'getView()',
    description: 'The view shown now, or the one the next open starts in. null in wheel modes and after destroy(). Since 4.7.0.',
  },
  {
    signature: 'clear()',
    description:
      'Clear like the Clear button, open or closed, without ui.clearButton: empties the input, returns to the neutral time and empties both range ends. Emits clear and update, not range:change, and does not move focus. Since 4.7.0.',
  },
  {
    signature: 'refreshDisabledTime()',
    description:
      'Re-run clock.isTimeDisabled after the state it reads has changed, and redraw the disabled tips or wheel items. Since 4.6.0.',
  },
  {
    signature: 'update({ options, create? }, callback?)',
    description: 'Change options at runtime.',
    deprecated: 'Use setOptions(options). Removed in 5.0.',
  },
  { signature: 'getElement()', description: 'The root .tp-ui element of the instance.' },
  { signature: 'instanceId', description: 'Getter: the unique instance id.' },
  { signature: 'options', description: 'Getter: the merged options. Returns the old option names until 5.0.' },
  { signature: 'isInitialized / isDestroyed', description: 'Getters for the lifecycle state.' },
  {
    signature: 'hour / minutes / okButton / cancelButton / clockHand',
    description: 'Undocumented getters that return internal DOM elements.',
    deprecated: 'Removed in 5.0. Read the time with getValue().',
  },
  {
    signature: 'on(event, handler)',
    description: 'Subscribe to an event. Returns a function that removes this handler (since 4.6.0).',
  },
  {
    signature: 'once(event, handler)',
    description: 'Subscribe once. Returns a function that removes this handler (since 4.6.0).',
  },
  { signature: 'off(event, handler?)', description: 'Unsubscribe.' },
  { signature: 'TimepickerUI.getById(id)', description: 'Get an instance by its behavior.id.', static: true },
  { signature: 'TimepickerUI.getAllInstances()', description: 'All live instances.', static: true },
  {
    signature: 'TimepickerUI.isAvailable(selectorOrElement)',
    description: 'Check the element exists.',
    static: true,
    deprecated: 'Removed in 5.0. Use document.querySelector(...) !== null.',
  },
  { signature: 'TimepickerUI.destroyAll()', description: 'Destroy every instance.', static: true },
  {
    signature: 'parseTime(text, { clockType?, showSeconds? }?)',
    description:
      'Named export, no picker or DOM needed (SSR-safe). Parses like setValue(): returns { hour, minutes, seconds?, type? } in clockType, or null. Since 4.7.0.',
  },
  {
    signature: 'formatTime(value, { clockType?, showSeconds? }?)',
    description: 'Named export. Formats a time the way the picker writes the input, e.g. "02:30 PM". Since 4.7.0.',
  },
  {
    signature: 'createDisabledTimeCheck({ type?, showSeconds?, disabledTime?, isTimeDisabled? })',
    description:
      'Named export. Returns (time: string | { hour, minutes, seconds }) => boolean with the same disabled-time rules as a mounted picker. Throws on an invalid disabledTime. Since 4.7.0.',
  },
];
