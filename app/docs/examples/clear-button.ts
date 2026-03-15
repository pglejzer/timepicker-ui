import { TimepickerUI } from './setup';

const clearButtonPicker = new TimepickerUI('#clear-button-picker', {
  ui: {
    clearButton: true,
    theme: 'basic',
    enableSwitchIcon: true,
  },
  labels: {
    clear: 'Clear',
  },
  clock: {
    type: '12h',
  },
  callbacks: {
    onClear: (data) => {
      console.log('Time cleared! Previous value:', data.previousValue);
    },
  },
});
clearButtonPicker.create();

const clearNoClearInputPicker = new TimepickerUI('#clear-no-input-picker', {
  ui: {
    clearButton: true,
    theme: 'basic',
    enableSwitchIcon: true,
  },
  clearBehavior: {
    clearInput: false,
  },
  callbacks: {
    onClear: (data) => {
      console.log('Clear clicked (input kept)! Previous value:', data.previousValue);
    },
  },
});
clearNoClearInputPicker.create();

// Clear Button - All Themes
const clearThemeList = [
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

clearThemeList.forEach((theme) => {
  new TimepickerUI(`#clear-theme-${theme}`, {
    ui: { clearButton: true, theme, enableSwitchIcon: true },
    labels: { clear: 'Clear' },
    callbacks: {
      onClear: (data) => {
        console.log(`Clear (${theme}): prev =`, data.previousValue);
      },
    },
  }).create();
});

// Range + Clear Button
const rangeClearPicker = new TimepickerUI('#range-clear-picker', {
  clock: { type: '12h' },
  ui: { clearButton: true, theme: 'm3-green', enableSwitchIcon: true },
  range: { enabled: true, fromLabel: 'From', toLabel: 'To' },
  labels: { clear: 'Clear' },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('Range + Clear confirmed:', data.from, '–', data.to);
      const display = document.getElementById('range-clear-display');
      if (display) {
        display.textContent = `${data.from} – ${data.to}`;
      }
    },
    onClear: (data) => {
      console.log('Range cleared! Previous value:', data.previousValue);
      const display = document.getElementById('range-clear-display');
      if (display) {
        display.textContent = '--:-- – --:--';
      }
    },
  },
});
rangeClearPicker.create();

