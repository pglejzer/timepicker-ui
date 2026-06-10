import { TimepickerUI } from './setup';

const blueprintLightPicker = new TimepickerUI('#blueprint-light', {
  clock: { type: '12h', autoSwitchToMinutes: true },
  ui: { theme: 'blueprint', enableSwitchIcon: true },
});
blueprintLightPicker.create();

const blueprintDark24hPicker = new TimepickerUI('#blueprint-dark-24h', {
  clock: { type: '24h' },
  ui: { theme: 'blueprint-dark', enableSwitchIcon: true },
});
blueprintDark24hPicker.create();

const blueprintDisabledPicker = new TimepickerUI('#blueprint-disabled', {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2, 3, 4, 5, 6],
      interval: '12:00 - 13:00',
    },
  },
  ui: { theme: 'blueprint', enableSwitchIcon: true },
});
blueprintDisabledPicker.create();

const blueprintRangePicker = new TimepickerUI('#blueprint-range', {
  clock: { type: '24h' },
  ui: { theme: 'blueprint-dark', enableSwitchIcon: true },
  range: {
    enabled: true,
    minDuration: 60,
    maxDuration: 720,
    fromLabel: 'Start',
    toLabel: 'End',
  },
  callbacks: {
    onRangeConfirm: (data) => {
      const display = document.getElementById('blueprint-range-display');
      const duration = document.getElementById('blueprint-range-duration');
      if (display) display.textContent = `${data.from} – ${data.to}`;
      if (duration) duration.textContent = String(data.duration);
    },
  },
});
blueprintRangePicker.create();

const blueprintTimezonePicker = new TimepickerUI('#blueprint-timezone', {
  clock: { type: '12h' },
  ui: { theme: 'blueprint', enableSwitchIcon: true },
  timezone: { enabled: true, default: 'Europe/Warsaw' },
});
blueprintTimezonePicker.create();

const blueprintWheelPicker = new TimepickerUI('#blueprint-wheel', {
  clock: {
    type: '24h',
    incrementMinutes: 5,
    disabledTime: { hours: [0, 1, 2, 3, 22, 23] },
  },
  ui: { theme: 'blueprint-dark', mode: 'compact-wheel' },
  wheel: { placement: 'auto', hideDisabled: true },
});
blueprintWheelPicker.create();

const blueprintEverythingPicker = new TimepickerUI('#blueprint-everything', {
  clock: {
    type: '24h',
    incrementMinutes: 5,
    disabledTime: { interval: '22:00 - 06:00' },
  },
  ui: {
    theme: 'blueprint',
    enableSwitchIcon: true,
    editable: true,
    clearButton: true,
  },
  behavior: { focusTrap: true, focusInputAfterClose: true },
  labels: { clear: 'Clear' },
  callbacks: {
    onConfirm: (data) => {
      const output = document.getElementById('blueprint-everything-output');
      if (output) output.textContent = `${data.hour}:${data.minutes}`;
    },
    onClear: () => {
      const output = document.getElementById('blueprint-everything-output');
      if (output) output.textContent = '--:--';
    },
  },
});
blueprintEverythingPicker.create();
