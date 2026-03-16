import { TimepickerUI } from './setup';

const disabledHoursPicker = new TimepickerUI('#disabled-hours', {
  clock: { type: '24h', disabledTime: { hours: [1, 2, 3, 22, 23] } },
});
disabledHoursPicker.create();

const disabledMinutesPicker = new TimepickerUI('#disabled-minutes', {
  clock: { type: '12h', disabledTime: { minutes: [15, 30, 45] } },
});
disabledMinutesPicker.create();

const disabledIntervalPicker = new TimepickerUI('#disabled-interval', {
  clock: { type: '24h', disabledTime: { interval: '12:00 - 18:00' } },
});
disabledIntervalPicker.create();

const editablePicker = new TimepickerUI('#editable-picker', {
  ui: { editable: true, enableSwitchIcon: true },
  behavior: { focusInputAfterClose: true },
});
editablePicker.create();

const smoothHourPicker = new TimepickerUI('#smooth-hour-snap-picker', {
  clock: { smoothHourSnap: true },
});
smoothHourPicker.create();

const multipleIntervalsPicker = new TimepickerUI('#disabled-intervals-12h', {
  clock: {
    type: '12h',
    disabledTime: {
      interval: ['12:00 AM - 4:00 AM', '5:30 PM - 8:00 PM'],
    },
  },
});
multipleIntervalsPicker.create();

const multipleIntervalsPicker24h = new TimepickerUI('#disabled-intervals-24h', {
  clock: {
    type: '24h',
    disabledTime: {
      interval: ['04:33 - 12:12', '16:34 - 20:22', '21:37 - 23:23'],
    },
  },
});
multipleIntervalsPicker24h.create();

const dynamicUpdatePicker = new TimepickerUI('#dynamic-update-picker', {
  clock: {
    type: '12h',
    disabledTime: { hours: [9, 10, 11, 12] },
  },
});
dynamicUpdatePicker.create();

document.getElementById('update-morning-shift')?.addEventListener('click', () => {
  dynamicUpdatePicker.update({
    options: {
      clock: {
        type: '12h',
        disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
      },
    },
    create: true,
  });
});

document.getElementById('update-evening-shift')?.addEventListener('click', () => {
  dynamicUpdatePicker.update({
    options: {
      ui: { theme: 'm3-green' },
      clock: {
        type: '24h',
        disabledTime: { hours: [18, 19, 20, 21, 22, 23] },
      },
    },
    create: true,
  });
});

document.getElementById('clear-restrictions')?.addEventListener('click', () => {
  dynamicUpdatePicker.update({
    options: {
      clock: {
        disabledTime: { hours: [] },
      },
    },
    create: true,
  });
});

const dynamicIntervalPicker = new TimepickerUI('#dynamic-interval-picker', {
  clock: {
    type: '24h',
    disabledTime: { interval: '09:00 - 12:00' },
  },
});
dynamicIntervalPicker.create();

document.getElementById('update-single-interval')?.addEventListener('click', () => {
  dynamicIntervalPicker.update({
    options: {
      clock: {
        disabledTime: { interval: '12:00 - 13:00' },
      },
    },
    create: true,
  });
});

document.getElementById('update-multiple-intervals')?.addEventListener('click', () => {
  dynamicIntervalPicker.update({
    options: {
      clock: {
        disabledTime: {
          interval: ['00:00 - 08:00', '12:00 - 13:00', '18:00 - 23:59'],
        },
      },
    },
    create: true,
  });
});

document.getElementById('clear-intervals')?.addEventListener('click', () => {
  dynamicIntervalPicker.update({
    options: {
      clock: {
        disabledTime: {},
      },
    },
    create: true,
  });
});

// hideDisabledOptions — Wheel mode
const hideDisabledWheelPicker = new TimepickerUI('#hide-disabled-wheel', {
  clock: {
    type: '12h',
    disabledTime: { hours: [1, 2, 3, 4, 5, 6], minutes: [0, 15, 30, 45] },
  },
  ui: { mode: 'wheel' },
  wheel: { hideDisabled: true },
});
hideDisabledWheelPicker.create();

// hideDisabledOptions — Compact Wheel + Popover
const hideDisabledPopoverPicker = new TimepickerUI('#hide-disabled-popover', {
  clock: {
    type: '24h',
    incrementMinutes: 5,
    disabledTime: { hours: [0, 1, 2, 3, 4, 5, 22, 23] },
  },
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto', hideDisabled: true },
});
hideDisabledPopoverPicker.create();
