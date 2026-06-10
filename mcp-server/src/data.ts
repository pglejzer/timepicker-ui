export const PACKAGE_VERSION = '4.4';

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
    description: 'Scrollable wheel picker for hours/minutes.',
    requiresPlugin: 'wheel',
  },
  {
    name: 'compact-wheel',
    description: 'Condensed inline wheel variant.',
    requiresPlugin: 'wheel',
  },
];

export const MODE_NAMES = MODES.map((m) => m.name);

export interface PluginInfo {
  name: string;
  export: string;
  importPath: string;
  description: string;
  enableOption: string;
}

export const PLUGINS: PluginInfo[] = [
  {
    name: 'range',
    export: 'RangePlugin',
    importPath: 'timepicker-ui/plugins/range',
    description: 'Start/end time selection with a tab UI.',
    enableOption: 'range: { enabled: true }',
  },
  {
    name: 'timezone',
    export: 'TimezonePlugin',
    importPath: 'timepicker-ui/plugins/timezone',
    description: 'Timezone dropdown with keyboard navigation.',
    enableOption: "timezone: { enabled: true, default: 'Europe/Warsaw' }",
  },
  {
    name: 'wheel',
    export: 'WheelPlugin',
    importPath: 'timepicker-ui/plugins/wheel',
    description: 'Enables the wheel / compact-wheel UI modes, drag and momentum.',
    enableOption: "ui: { mode: 'wheel' }",
  },
];

export const PLUGIN_NAMES = PLUGINS.map((p) => p.name);

export interface ApiMethod {
  signature: string;
  description: string;
  static?: boolean;
}

export const API_METHODS: ApiMethod[] = [
  { signature: 'new TimepickerUI(selectorOrElement, options?)', description: 'Construct an instance.' },
  { signature: 'create()', description: 'Initialize and render the picker.' },
  { signature: 'open(callback?)', description: 'Open the modal.' },
  { signature: 'close(update?, callback?)', description: 'Close the modal.' },
  {
    signature: 'destroy(options?)',
    description: 'Clean up DOM and listeners. options: { keepInputValue?, callback? }.',
  },
  {
    signature: 'getValue()',
    description: 'Returns { hour, minutes, type?, time, degreesHours, degreesMinutes }.',
  },
  { signature: 'setValue(time, updateInput?)', description: 'Set time, e.g. "14:30" or "2:30 PM".' },
  { signature: 'update({ options, create? }, callback?)', description: 'Update options at runtime.' },
  { signature: 'on(event, handler)', description: 'Subscribe to an event.' },
  { signature: 'once(event, handler)', description: 'Subscribe once.' },
  { signature: 'off(event, handler?)', description: 'Unsubscribe.' },
  { signature: 'TimepickerUI.getById(id)', description: 'Get an instance by custom behavior.id.', static: true },
  { signature: 'TimepickerUI.getAllInstances()', description: 'All live instances.', static: true },
  { signature: 'TimepickerUI.isAvailable(selector)', description: 'Check the element exists.', static: true },
  { signature: 'TimepickerUI.destroyAll()', description: 'Destroy every instance.', static: true },
];
