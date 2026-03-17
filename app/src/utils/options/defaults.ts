import type { TimepickerOptions } from '../../types/options';

export const DEFAULT_OPTIONS: Required<TimepickerOptions> = {
  clock: {
    type: '12h',
    incrementHours: 1,
    incrementMinutes: 1,
    autoSwitchToMinutes: true,
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
    appendModalSelector: '',
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
    clear: 'Clear',
  },

  behavior: {
    focusInputAfterClose: false,
    focusTrap: true,
    delayHandler: 300,
    id: undefined,
  },

  callbacks: {
    onOpen: undefined,
    onCancel: undefined,
    onConfirm: undefined,
    onUpdate: undefined,
    onSelectHour: undefined,
    onSelectMinute: undefined,
    onSelectAM: undefined,
    onSelectPM: undefined,
    onError: undefined,
    onTimezoneChange: undefined,
    onRangeConfirm: undefined,
    onRangeSwitch: undefined,
    onRangeValidation: undefined,
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
  },

  clearBehavior: {
    clearInput: true,
  },
};

export function mergeOptions(userOptions: TimepickerOptions = {}): Required<TimepickerOptions> {
  const merged: Required<TimepickerOptions> = {
    clock: {
      ...DEFAULT_OPTIONS.clock,
      ...userOptions.clock,
    },
    ui: {
      ...DEFAULT_OPTIONS.ui,
      ...userOptions.ui,
    },
    labels: {
      ...DEFAULT_OPTIONS.labels,
      ...userOptions.labels,
    },
    behavior: {
      ...DEFAULT_OPTIONS.behavior,
      ...userOptions.behavior,
    },
    callbacks: {
      ...DEFAULT_OPTIONS.callbacks,
      ...userOptions.callbacks,
    },
    timezone: {
      ...DEFAULT_OPTIONS.timezone,
      ...userOptions.timezone,
    },
    range: {
      ...DEFAULT_OPTIONS.range,
      ...userOptions.range,
    },
    wheel: {
      ...DEFAULT_OPTIONS.wheel,
      ...userOptions.wheel,
    },
    clearBehavior: {
      ...DEFAULT_OPTIONS.clearBehavior,
      ...userOptions.clearBehavior,
    },
  };

  const mergedMode = merged.ui.mode;
  if (mergedMode === 'wheel' || mergedMode === 'compact-wheel') {
    merged.wheel = {
      placement: mergedMode === 'compact-wheel' ? 'auto' : undefined,
      hideFooter: undefined,
      commitOnScroll: undefined,
      ...merged.wheel,
    };
  }

  return merged;
}
