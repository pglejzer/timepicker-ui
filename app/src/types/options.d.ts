/**
 * Grouped options structure for Timepicker UI v4.0.0
 *
 * BREAKING CHANGE from v3.x:
 * Options are now organized into logical groups for better clarity and maintainability.
 */

import type {
  TimepickerEventCallback,
  OpenEventData,
  CancelEventData,
  ConfirmEventData,
  UpdateEventData,
  SelectHourEventData,
  SelectMinuteEventData,
  SelectAMEventData,
  SelectPMEventData,
  ErrorEventData,
  TimezoneChangeEventData,
  RangeConfirmEventData,
  RangeSwitchEventData,
  RangeValidationEventData,
} from './types';

/**
 * Clock behavior configuration
 */
export interface ClockOptions {
  /**
   * @description Set type of clock: `12h` or `24h`
   * @default "12h"
   */
  type?: '12h' | '24h';

  /**
   * @description Set increment for hours (1, 2, 3, etc.)
   * @default 1
   */
  incrementHours?: number;

  /**
   * @description Set increment for minutes (1, 5, 10, 15, etc.)
   * @default 1
   */
  incrementMinutes?: number;

  /**
   * @description Automatically switch to minutes after selecting hour
   * @default false
   */
  autoSwitchToMinutes?: boolean;

  /**
   * @description Disable specific hours/minutes or time intervals
   * @example
   * disabledTime: {
   *   minutes: [1, 2, 4, 5, 55, 23, "22", "38"],
   *   hours: [1, "3", "5", 8],
   *   interval: "10:00 AM - 12:00 PM" | ["10:00 AM - 12:00 PM", "5:00 PM - 8:00 PM"]
   * }
   */
  disabledTime?: {
    minutes?: Array<string | number>;
    hours?: Array<string | number>;
    interval?: string | string[];
  };

  /**
   * @description Set current time to the input and timepicker
   * @example
   * currentTime: {
   *   time: new Date(),
   *   updateInput: true,
   *   locales: "en-US",
   *   preventClockType: false
   * }
   * @example currentTime: true
   */
  currentTime?:
    | {
        time?: Date;
        updateInput?: boolean;
        locales?: string | string[];
        preventClockType?: boolean;
      }
    | boolean;
}

/**
 * UI appearance and behavior configuration
 */
export interface UIOptions {
  /**
   * @description Theme for the timepicker
   * @default "basic"
   */
  theme?:
    | 'basic'
    | 'crane'
    | 'crane-straight'
    | 'm2'
    | 'm3-green'
    | 'dark'
    | 'glassmorphic'
    | 'pastel'
    | 'ai'
    | 'cyberpunk';

  /**
   * @description Enable/disable animations
   * @default true
   */
  animation?: boolean;

  /**
   * @description Show backdrop when timepicker is open
   * @default true
   */
  backdrop?: boolean;

  /**
   * @description Force mobile mode
   * @default false
   */
  mobile?: boolean;

  /**
   * @description Enable switch icon (mobile ↔ desktop)
   * @default false
   */
  enableSwitchIcon?: boolean;

  /**
   * @description Allow editing hour/minutes directly
   * @default false
   */
  editable?: boolean;

  /**
   * @description Enable scrollbar when timepicker is open
   * @default false
   */
  enableScrollbar?: boolean;

  /**
   * @description Additional CSS class for the wrapper
   * @example cssClass: "my-custom-timepicker"
   */
  cssClass?: string;

  /**
   * @description Selector where to append modal (default: body)
   * @default ""
   */
  appendModalSelector?: string;

  /**
   * @description Custom keyboard icon template (desktop → mobile)
   * @default Material Icons template
   */
  iconTemplate?: string;

  /**
   * @description Custom schedule icon template (mobile → desktop)
   * @default Material Icons template
   */
  iconTemplateMobile?: string;

  /**
   * @description Inline mode configuration
   * @example
   * inline: {
   *   enabled: true,
   *   containerId: "timepicker-container",
   *   showButtons: false,
   *   autoUpdate: true
   * }
   */
  inline?: {
    enabled: boolean;
    containerId: string;
    showButtons?: boolean;
    autoUpdate?: boolean;
  };
}

/**
 * Text labels configuration
 */
export interface LabelsOptions {
  /**
   * @description "AM" label text
   * @default "AM"
   */
  am?: string;

  /**
   * @description "PM" label text
   * @default "PM"
   */
  pm?: string;

  /**
   * @description "OK" button text
   * @default "OK"
   */
  ok?: string;

  /**
   * @description "Cancel" button text
   * @default "Cancel"
   */
  cancel?: string;

  /**
   * @description Time label on desktop
   * @default "Select time"
   */
  time?: string;

  /**
   * @description Time label on mobile
   * @default "Enter Time"
   */
  mobileTime?: string;

  /**
   * @description Hour label on mobile
   * @default "Hour"
   */
  mobileHour?: string;

  /**
   * @description Minute label on mobile
   * @default "Minute"
   */
  mobileMinute?: string;
}

/**
 * Behavior configuration
 */
export interface BehaviorOptions {
  /**
   * @description Focus input after closing modal
   * @default false
   */
  focusInputAfterClose?: boolean;

  /**
   * @description Enable focus trap in modal
   * @default true
   */
  focusTrap?: boolean;

  /**
   * @description Delay for clickable elements (ms)
   * @default 300
   */
  delayHandler?: number;

  /**
   * @description Custom ID for the timepicker instance
   * @example id: "my-timepicker-1"
   */
  id?: string;
}

/**
 * Timezone configuration (opt-in, UI-only)
 * @description Optional timezone selector for B2B/global use cases.
 * This is a presentation layer only - no automatic time conversions.
 */
export interface TimezoneOptions {
  /**
   * @description Enable timezone selector UI
   * @default false
   */
  enabled?: boolean;

  /**
   * @description Default timezone ID (e.g., 'America/New_York')
   * Uses browser's local timezone if not specified.
   */
  default?: string;

  /**
   * @description Whitelist of allowed timezone IDs.
   * If not provided, uses a curated list of common timezones.
   * @example whitelist: ['UTC', 'America/New_York', 'Europe/London']
   */
  whitelist?: readonly string[];

  /**
   * @description Label for timezone selector
   * @default "Timezone"
   */
  label?: string;
}

/**
 * Range mode configuration (opt-in)
 */
export interface RangeOptions {
  /**
   * @description Enable range mode (from-to selection)
   * @default false
   */
  enabled?: boolean;

  /**
   * @description Minimum duration in minutes
   */
  minDuration?: number;

  /**
   * @description Maximum duration in minutes
   */
  maxDuration?: number;

  /**
   * @description Label for "from" segment
   * @default "From"
   */
  fromLabel?: string;

  /**
   * @description Label for "to" segment
   * @default "To"
   */
  toLabel?: string;
}

/**
 * Event callbacks configuration
 */
export interface CallbacksOptions {
  /**
   * @description Triggered when timepicker opens
   */
  onOpen?: TimepickerEventCallback<OpenEventData>;

  /**
   * @description Triggered when user cancels
   */
  onCancel?: TimepickerEventCallback<CancelEventData>;

  /**
   * @description Triggered when user confirms time
   */
  onConfirm?: TimepickerEventCallback<ConfirmEventData>;

  /**
   * @description Triggered during interaction (real-time)
   */
  onUpdate?: TimepickerEventCallback<UpdateEventData>;

  /**
   * @description Triggered when hour mode is selected
   */
  onSelectHour?: TimepickerEventCallback<SelectHourEventData>;

  /**
   * @description Triggered when minute mode is selected
   */
  onSelectMinute?: TimepickerEventCallback<SelectMinuteEventData>;

  /**
   * @description Triggered when AM is selected
   */
  onSelectAM?: TimepickerEventCallback<SelectAMEventData>;

  /**
   * @description Triggered when PM is selected
   */
  onSelectPM?: TimepickerEventCallback<SelectPMEventData>;

  /**
   * @description Triggered on invalid time format
   */
  onError?: TimepickerEventCallback<ErrorEventData>;

  /**
   * @description Triggered when timezone is changed (opt-in feature)
   */
  onTimezoneChange?: TimepickerEventCallback<TimezoneChangeEventData>;

  /**
   * @description Triggered when range is confirmed (range mode only)
   */
  onRangeConfirm?: TimepickerEventCallback<RangeConfirmEventData>;

  /**
   * @description Triggered when switching between from/to (range mode only)
   */
  onRangeSwitch?: TimepickerEventCallback<RangeSwitchEventData>;

  /**
   * @description Triggered on range validation (range mode only)
   */
  onRangeValidation?: TimepickerEventCallback<RangeValidationEventData>;
}

/**
 * Main options type with grouped structure (v4.0.0)
 */
export interface TimepickerOptions {
  clock?: ClockOptions;
  ui?: UIOptions;
  labels?: LabelsOptions;
  behavior?: BehaviorOptions;
  callbacks?: CallbacksOptions;
  timezone?: TimezoneOptions;
  range?: RangeOptions;
}
