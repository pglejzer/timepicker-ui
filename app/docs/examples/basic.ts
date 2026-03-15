import { TimepickerUI } from './setup';

const basicTimePicker = new TimepickerUI('#basic-picker', {
  clock: {
    autoSwitchToMinutes: true,
  },
});
basicTimePicker.create();

const format24hPicker = new TimepickerUI('#format-24h-picker', {
  clock: { type: '24h' },
  ui: { enableSwitchIcon: true },
});
format24hPicker.create();

const mobilePicker = new TimepickerUI('#mobile-picker', {
  clock: { type: '24h' },
  ui: { mobile: true, enableSwitchIcon: true },
});
mobilePicker.create();

