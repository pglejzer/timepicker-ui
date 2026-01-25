/**
 * Default options for Timepicker UI v4.0.0
 *
 * Uses grouped structure for better organization and clarity.
 */

import type { TimepickerOptions } from '../../types/options';

/**
 * Default options with grouped structure
 */
export const DEFAULT_OPTIONS: Required<TimepickerOptions> = {
  clock: {
    type: '12h',
    incrementHours: 1,
    incrementMinutes: 1,
    autoSwitchToMinutes: false,
    disabledTime: undefined,
    currentTime: undefined,
  },

  ui: {
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
};

/**
 * Merge user options with defaults (deep merge for grouped structure)
 */
export function mergeOptions(userOptions: TimepickerOptions = {}): Required<TimepickerOptions> {
  return {
    clock: {
      ...DEFAULT_OPTIONS.clock,
      ...(userOptions.clock || {}),
    },
    ui: {
      ...DEFAULT_OPTIONS.ui,
      ...(userOptions.ui || {}),
    },
    labels: {
      ...DEFAULT_OPTIONS.labels,
      ...(userOptions.labels || {}),
    },
    behavior: {
      ...DEFAULT_OPTIONS.behavior,
      ...(userOptions.behavior || {}),
    },
    callbacks: {
      ...DEFAULT_OPTIONS.callbacks,
      ...(userOptions.callbacks || {}),
    },
    timezone: {
      ...DEFAULT_OPTIONS.timezone,
      ...(userOptions.timezone || {}),
    },
    range: {
      ...DEFAULT_OPTIONS.range,
      ...(userOptions.range || {}),
    },
  };
}
