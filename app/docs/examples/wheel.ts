import { TimepickerUI } from './setup';

// Wheel - Basic examples
const wheelBasicPicker = new TimepickerUI('#wheel-basic', {
  ui: { mode: 'wheel' },
});
wheelBasicPicker.create();

const wheel24hPicker = new TimepickerUI('#wheel-24h', {
  clock: { type: '24h' },
  ui: { mode: 'wheel' },
});
wheel24hPicker.create();

const wheelDarkPicker = new TimepickerUI('#wheel-dark', {
  ui: { mode: 'wheel', theme: 'dark' },
});
wheelDarkPicker.create();

const wheelM3Picker = new TimepickerUI('#wheel-m3', {
  ui: { mode: 'wheel', theme: 'm3-green' },
});
wheelM3Picker.create();

const wheelCyberpunkPicker = new TimepickerUI('#wheel-cyberpunk', {
  ui: { mode: 'wheel', theme: 'cyberpunk' },
});
wheelCyberpunkPicker.create();

const wheelStepPicker = new TimepickerUI('#wheel-step', {
  clock: { incrementMinutes: 5 },
  ui: { mode: 'wheel' },
});
wheelStepPicker.create();

// Wheel - All Themes
const wheelThemeList = [
  'basic',
  'crane',
  'crane-straight',
  'm3-green',
  'dark',
  'm2',
  'glassmorphic',
  'pastel',
  'ai',
  'cyberpunk',
] as const;

wheelThemeList.forEach((theme) => {
  new TimepickerUI(`#wheel-theme-${theme}`, {
    ui: { mode: 'wheel', theme, enableSwitchIcon: true },
  }).create();
});

// Compact Wheel - Basic examples
new TimepickerUI('#compact-wheel-12h', {
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-wheel-24h', {
  clock: { type: '24h', disabledTime: { hours: [12] } },
  ui: { mode: 'compact-wheel' },
  wheel: { hideDisabled: true },
}).create();

new TimepickerUI('#compact-wheel-step', {
  clock: { incrementMinutes: 5 },
  ui: { mode: 'compact-wheel' },
}).create();

// Compact Wheel - All Themes
const compactThemeList = [
  'basic',
  'crane',
  'crane-straight',
  'm3-green',
  'dark',
  'm2',
  'glassmorphic',
  'pastel',
  'ai',
  'cyberpunk',
] as const;

compactThemeList.forEach((theme) => {
  new TimepickerUI(`#compact-theme-${theme}`, {
    ui: { mode: 'compact-wheel', theme, enableSwitchIcon: true },
  }).create();
});

// Compact Wheel + Popover — placement auto (default)
new TimepickerUI('#popover-auto', {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto' },
}).create();

// Compact Wheel + Popover — placement top
new TimepickerUI('#popover-top', {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'top' },
}).create();

// Compact Wheel + Popover — placement bottom
new TimepickerUI('#popover-bottom', {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'bottom' },
}).create();

// Compact Wheel + Popover — 24h + placement auto
new TimepickerUI('#popover-24h', {
  clock: { type: '24h' },
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto' },
}).create();

// Compact Wheel + Popover — dark theme + placement auto
new TimepickerUI('#popover-dark', {
  ui: { mode: 'compact-wheel', theme: 'dark' },
  wheel: { placement: 'auto' },
}).create();

// Compact Wheel + Popover — m3-green theme + placement top
new TimepickerUI('#popover-m3', {
  ui: { mode: 'compact-wheel', theme: 'm3-green' },
  wheel: { placement: 'top' },
}).create();

// commitOnScroll — Wheel (auto-commit without OK)
new TimepickerUI('#commit-on-scroll-wheel', {
  ui: { mode: 'wheel' },
  wheel: { commitOnScroll: true },
}).create();

// commitOnScroll — Compact Wheel + Popover
new TimepickerUI('#commit-on-scroll-popover', {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto', commitOnScroll: true },
}).create();

// commitOnScroll — 24h + Popover
new TimepickerUI('#commit-on-scroll-24h', {
  clock: { type: '24h' },
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto', commitOnScroll: true },
}).create();

// Multiple Popover pickers (independent instances)
new TimepickerUI('#multi-popover-1', {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto' },
}).create();

new TimepickerUI('#multi-popover-2', {
  clock: { type: '24h' },
  ui: { mode: 'compact-wheel', theme: 'm3-green' },
  wheel: { placement: 'auto' },
}).create();

new TimepickerUI('#multi-popover-3', {
  ui: { mode: 'compact-wheel', theme: 'dark' },
  wheel: { placement: 'auto' },
}).create();

// Popover — All Themes
const popoverThemeList = [
  'basic',
  'crane',
  'crane-straight',
  'm3-green',
  'dark',
  'm2',
  'glassmorphic',
  'pastel',
  'ai',
  'cyberpunk',
] as const;

popoverThemeList.forEach((theme) => {
  new TimepickerUI(`#popover-theme-${theme}`, {
    ui: { mode: 'compact-wheel', theme },
    wheel: { placement: 'auto' },
  }).create();
});

// Wheel + Disabled Time — all options
new TimepickerUI('#wheel-disabled-hours-12h', {
  clock: {
    type: '12h',
    disabledTime: { hours: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-hours-24h', {
  clock: {
    type: '24h',
    disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23] },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-minutes', {
  clock: {
    disabledTime: { minutes: [15, 30, 45] },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-interval-12h', {
  clock: {
    type: '12h',
    disabledTime: { interval: '10:00 AM - 2:00 PM' },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-interval-24h', {
  clock: {
    type: '24h',
    disabledTime: { interval: '12:00 - 18:00' },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-intervals-12h', {
  clock: {
    type: '12h',
    disabledTime: { interval: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'] },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-disabled-intervals-24h', {
  clock: {
    type: '24h',
    disabledTime: { interval: ['00:00 - 06:00', '12:00 - 13:00', '18:00 - 23:59'] },
  },
  ui: { mode: 'wheel' },
}).create();

new TimepickerUI('#wheel-hide-disabled-hours', {
  clock: {
    type: '12h',
    disabledTime: { hours: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  ui: { mode: 'wheel' },
  wheel: { hideDisabled: true },
}).create();

new TimepickerUI('#wheel-hide-disabled-interval', {
  clock: {
    type: '24h',
    disabledTime: { interval: ['00:00 - 08:00', '18:00 - 23:59'] },
  },
  ui: { mode: 'wheel' },
  wheel: { hideDisabled: true },
}).create();

// Compact Wheel + Disabled Time — all options
new TimepickerUI('#compact-disabled-hours-12h', {
  clock: {
    type: '12h',
    disabledTime: { hours: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-hours-24h', {
  clock: {
    type: '24h',
    disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23] },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-minutes', {
  clock: {
    disabledTime: { minutes: [15, 30, 45] },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-interval-12h', {
  clock: {
    type: '12h',
    disabledTime: { interval: '10:00 AM - 2:00 PM' },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-interval-24h', {
  clock: {
    type: '24h',
    disabledTime: { interval: '12:00 - 18:00' },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-intervals-12h', {
  clock: {
    type: '12h',
    disabledTime: { interval: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'] },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-disabled-intervals-24h', {
  clock: {
    type: '24h',
    disabledTime: { interval: ['00:00 - 06:00', '12:00 - 13:00', '18:00 - 23:59'] },
  },
  ui: { mode: 'compact-wheel' },
}).create();

new TimepickerUI('#compact-hide-disabled-hours', {
  clock: {
    type: '12h',
    disabledTime: { hours: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  ui: { mode: 'compact-wheel' },
  wheel: { hideDisabled: true },
}).create();

new TimepickerUI('#compact-hide-disabled-interval', {
  clock: {
    type: '24h',
    disabledTime: { interval: ['00:00 - 08:00', '18:00 - 23:59'] },
  },
  ui: { mode: 'compact-wheel' },
  wheel: { hideDisabled: true },
}).create();
