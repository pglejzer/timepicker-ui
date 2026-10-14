import type { TimepickerOptions } from '../../types/options';
import { resolveAliases } from './aliases';

export const DEFAULT_OPTIONS: Required<TimepickerOptions> = {
  clock: {
    type: '12h',
    incrementHours: 1,
    incrementMinutes: 1,
    autoSwitchToMinutes: true,
    showSeconds: false,
    incrementSeconds: 1,
    autoSwitchToSeconds: true,
    disabledTime: undefined,
    currentTime: undefined,
  },

  ui: {
    mode: 'clock',
    theme: 'basic',
    animation: true,
    backdrop: true,
    mobile: false,
    enableSwitchIcon: false,
    editable: false,
    enableScrollbar: false,
    cssClass: undefined,
    appendTo: '',
    iconTemplate: '',
    iconTemplateMobile: '',
    inline: undefined,
    clearButton: false,
  },

  labels: {
    am: 'AM',
    pm: 'PM',
    ok: 'OK',
    cancel: 'Cancel',
    time: 'Select time',
    mobileTime: 'Enter Time',
    mobileHour: 'Hour',
    mobileMinute: 'Minute',
    second: 'Second',
    clear: 'Clear',
    hourLabel: 'Hour',
    minuteLabel: 'Minute',
    clockLabel: 'Clock',
    periodLabel: 'Period',
    timeLabel: 'Time',
    format24Label: '24-hour',
    rangeSelectionLabel: 'Range selection',
    switchToKeyboardLabel: 'Switch to keyboard input',
    switchToClockLabel: 'Switch to clock',
    toggleLabel: 'Toggle',
    timezoneSelectorLabel: 'Timezone',
    announceHour: 'Hour',
    announceMinute: 'Minutes',
    announceAmSelected: 'AM selected',
    announcePmSelected: 'PM selected',
    invalidTimeFormat: 'Invalid time format',
    announceCleared: 'Time cleared',
  },

  behavior: {
    focusInputAfterClose: false,
    focusTrap: true,
    delayHandler: 0,
    id: undefined,
  },

  callbacks: {
    onOpen: undefined,
    onShow: undefined,
    onCancel: undefined,
    onConfirm: undefined,
    onUpdate: undefined,
    onSelectHour: undefined,
    onSelectMinute: undefined,
    onSelectSecond: undefined,
    onSelectAM: undefined,
    onSelectPM: undefined,
    onSelectPeriod: undefined,
    onSwitchView: undefined,
    onSwitchFace: undefined,
    onError: undefined,
    onTimezoneChange: undefined,
    onRangeConfirm: undefined,
    onRangeSwitch: undefined,
    onRangeValidation: undefined,
    onWheelScrollStart: undefined,
    onWheelScrollEnd: undefined,
    onClear: undefined,
  },

  timezone: {
    enabled: false,
    default: undefined,
    whitelist: undefined,
    label: 'Timezone',
  },

  range: {
    enabled: false,
    minDuration: undefined,
    maxDuration: undefined,
    fromLabel: 'From',
    toLabel: 'To',
  },

  wheel: {
    placement: undefined,
    hideFooter: undefined,
    commitOnScroll: undefined,
    hideDisabled: undefined,
    ignoreOutsideClick: undefined,
  },

  clearBehavior: {
    clearInput: true,
  },
};

export function mergeOptionGroups(
  base: Required<TimepickerOptions>,
  updates: TimepickerOptions = {},
): Required<TimepickerOptions> {
  const next = resolveAliases(updates);
  return {
    ...base,
    clock: { ...base.clock, ...next.clock },
    ui: { ...base.ui, ...next.ui },
    labels: { ...base.labels, ...next.labels },
    behavior: { ...base.behavior, ...next.behavior },
    callbacks: { ...base.callbacks, ...next.callbacks },
    timezone: { ...base.timezone, ...next.timezone },
    range: { ...base.range, ...next.range },
    wheel: { ...base.wheel, ...next.wheel },
    clearBehavior: { ...base.clearBehavior, ...next.clearBehavior },
  };
}

export function mergeOptions(userOptions: TimepickerOptions = {}): Required<TimepickerOptions> {
  return mergeOptionGroups(DEFAULT_OPTIONS, userOptions);
}
