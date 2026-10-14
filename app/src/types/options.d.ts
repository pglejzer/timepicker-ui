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
  SelectSecondEventData,
  SelectAMEventData,
  SelectPMEventData,
  ErrorEventData,
  TimezoneChangeEventData,
  RangeConfirmEventData,
  RangeSwitchEventData,
  RangeValidationEventData,
  ClearEventData,
  ShowEventData,
  SwitchViewEventData,
  SelectPeriodEventData,
  SwitchFaceEventData,
  WheelScrollStartEventData,
  WheelScrollEndEventData,
} from './types';

/**
 * Clock behavior configuration
 */
export interface ClockOptions {
  /**
   * @description Clock format. `auto` picks 12h or 24h from the browser locale when the picker is created or its options are set.
   * @default "12h"
   */
  type?: '12h' | '24h' | 'auto';

  /**
   * @description Step between selectable hours on the clock, the wheel and the hour field's arrow keys. Use a divisor of 12: 1, 2, 3, 4 or 6.
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
   * @default true
   */
  autoSwitchToMinutes?: boolean;

  /**
   * @description Show a seconds field, wheel column and clock face (HH:MM:SS)
   * @default false
   */
  showSeconds?: boolean;

  /**
   * @description Set increment for seconds: 1, 5, 10, 15, 20 or 30
   * @default 1
   */
  incrementSeconds?: 1 | 5 | 10 | 15 | 20 | 30;

  /**
   * @description Automatically switch from minutes to seconds after a minute is picked on the clock.
   * Only used with `showSeconds`.
   * @default true
   */
  autoSwitchToSeconds?: boolean;

  /**
   * @description Enable smooth hour snapping with animation
   * @default true
   * @deprecated Use `discreteHourJump`. Removed in 5.0.
   */
  smoothHourSnap?: boolean;

  /**
   * @description Move the hour hand from hour to hour while dragging instead of following the pointer.
   * @default false
   */
  discreteHourJump?: boolean;

  /**
   * @description Disable specific hours/minutes/seconds or time ranges
   * @remarks Arrow, Page Up/Down, Home and End keys skip disabled values, and a typed value moves to
   * the nearest enabled one when the field loses focus. Outside range mode, OK stays disabled while
   * the selected time is disabled.
   * @example
   * disabledTime: {
   *   minutes: [1, 2, 4, 5, 55, 23, "22", "38"],
   *   hours: [1, "3", "5", 8],
   *   seconds: [0, 30]
   * }
   * // or time ranges instead: the hours, minutes and seconds lists are ignored when ranges is set
   * disabledTime: {
   *   ranges: ["10:00 AM - 12:00 PM", "5:00:30 PM - 8:00 PM"]
   * }
   */
  disabledTime?: {
    minutes?: Array<string | number>;
    hours?: Array<string | number>;
    /**
     * @description Seconds (0-59) disabled in every minute. Used with `showSeconds`.
     */
    seconds?: Array<string | number>;
    /**
     * @description Inclusive ranges. Edges: 'HH:MM' or 'HH:MM:SS' (24h), 'H:MM[:SS] AM|PM' (12h).
     * An edge without seconds covers its whole minute.
     * When set, the `hours`, `minutes` and `seconds` lists are ignored.
     */
    ranges?: string | string[];
    /**
     * @description Inclusive ranges. Edges: 'HH:MM' or 'HH:MM:SS' (24h), 'H:MM[:SS] AM|PM' (12h).
     * An edge without seconds covers its whole minute.
     * When set, the `hours`, `minutes` and `seconds` lists are ignored.
     * @deprecated Use `ranges`. Removed in 5.0.
     */
    interval?: string | string[];
  };

  /**
   * @description Time the picker shows while the input is empty. `'now'` shows the current time and also writes it to the input when the picker is created, replacing a value that is already there.
   * Use the object form to choose: `time` is a `Date` or `'now'`, and `updateInput: true` writes it to the input the same way.
   * @example defaultTime: 'now'
   * @example defaultTime: { time: new Date(2026, 0, 1, 9, 30), updateInput: false }
   */
  defaultTime?: 'now' | { time?: Date | 'now'; updateInput?: boolean };

  /**
   * @description Set current time to the input and timepicker
   * @example
   * currentTime: {
   *   time: new Date(),
   *   updateInput: true,
   *   preventClockType: false
   * }
   * @example currentTime: true
   * @deprecated Use `defaultTime`. Removed in 5.0.
   */
  currentTime?:
    | {
        time?: Date;
        updateInput?: boolean;
        /**
         * @deprecated Has no effect since 4.5.0; the value is formatted by the library. Removed in 5.0.
         */
        locales?: string | string[];
        /**
         * @deprecated Use `clock.type: 'auto'`. Removed in 5.0.
         */
        preventClockType?: boolean;
      }
    | boolean;
}

/**
 * UI appearance and behavior configuration
 */
export interface UIOptions {
  /**
   * @description Picker mode: analog clock face, scroll wheel spinner, or compact wheel (no header)
   * @default "clock"
   */
  mode?: 'clock' | 'wheel' | 'compact-wheel';

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
    | 'cyberpunk'
    | 'blueprint'
    | 'blueprint-dark';

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
   * @description View shown when the picker opens: the clock face or the keyboard fields.
   * @default "clock"
   */
  initialView?: 'clock' | 'keyboard';

  /**
   * @description Force mobile mode
   * @default false
   * @deprecated Use `initialView: 'keyboard'`. Removed in 5.0.
   */
  mobile?: boolean;

  /**
   * @description Show the button that switches between the clock face and the keyboard fields.
   * @default false
   */
  viewSwitch?: boolean;

  /**
   * @description Enable switch icon (mobile ↔ desktop)
   * @default false
   * @deprecated Use `viewSwitch`. Removed in 5.0.
   */
  enableSwitchIcon?: boolean;

  /**
   * @description Allow editing hour/minutes directly
   * @default false
   */
  editable?: boolean;

  /**
   * @description Let the page scroll while the picker is open. When false, page scroll is locked on `<html>`
   * (and on `<body>` when it is the scroll container), and `<html>` gets `--tp-scrollbar-gap` set to the removed
   * scrollbar width for your own fixed or sticky elements, e.g. `header { padding-right: var(--tp-scrollbar-gap, 0px) }`.
   * @default false
   */
  allowPageScroll?: boolean;

  /**
   * @description Enable scrollbar when timepicker is open.
   * When false, page scroll is locked on `<html>` (and on `<body>` when it is the scroll container),
   * and `<html>` gets `--tp-scrollbar-gap` set to the removed scrollbar width for your own fixed or
   * sticky elements, e.g. `header { padding-right: var(--tp-scrollbar-gap, 0px) }`.
   * @default false
   * @deprecated Use `allowPageScroll`. Removed in 5.0.
   */
  enableScrollbar?: boolean;

  /**
   * @description Additional CSS class for the wrapper
   * @example cssClass: "my-custom-timepicker"
   */
  cssClass?: string;

  /**
   * @description Show the Clear button. The object form also sets what Clear does: `clearInput: false` keeps the input value.
   * @default false
   * @example clearButton: { clearInput: false }
   */
  clearButton?: boolean | { clearInput?: boolean };

  /**
   * @description Element, or selector of the element, the modal is appended to.
   * @default document.body
   */
  appendTo?: string | HTMLElement;

  /**
   * @description Selector where to append modal (default: body)
   * @default ""
   * @deprecated Use `appendTo`. Removed in 5.0.
   */
  appendModalSelector?: string;

  /**
   * @description HTML of the keyboard icon, shown on the clock face view.
   * @default Material Icons template
   */
  keyboardIcon?: string;

  /**
   * @description Custom keyboard icon template (desktop → mobile)
   * @default Material Icons template
   * @deprecated Use `keyboardIcon`. Removed in 5.0.
   */
  iconTemplate?: string;

  /**
   * @description HTML of the clock icon, shown on the keyboard view.
   * @default Material Icons template
   */
  clockIcon?: string;

  /**
   * @description Custom schedule icon template (mobile → desktop)
   * @default Material Icons template
   * @deprecated Use `clockIcon`. Removed in 5.0.
   */
  iconTemplateMobile?: string;

  /**
   * @description Inline mode configuration
   * @example
   * inline: {
   *   enabled: true,
   *   container: '#timepicker-container',
   *   showButtons: false,
   *   autoUpdate: true
   * }
   */
  inline?: {
    enabled: boolean;
    /**
     * @description Element, or selector of the element, the inline picker renders into. Required when `enabled` is true.
     * @example container: '#timepicker-container'
     */
    container?: string | HTMLElement;
    /**
     * @deprecated Use `container`. Removed in 5.0.
     */
    containerId?: string;
    /**
     * @description Show the OK and Cancel buttons. OK writes the time to the input and Cancel brings back the time from the input; the picker stays visible either way.
     * @default false
     */
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
   * @description Heading of the clock face view
   * @default "Select time"
   */
  clockTitle?: string;

  /**
   * @description Time label on desktop
   * @default "Select time"
   * @deprecated Use `clockTitle`. Removed in 5.0.
   */
  time?: string;

  /**
   * @description Heading of the keyboard view
   * @default "Enter Time"
   */
  keyboardTitle?: string;

  /**
   * @description Time label on mobile
   * @default "Enter Time"
   * @deprecated Use `keyboardTitle`. Removed in 5.0.
   */
  mobileTime?: string;

  /**
   * @description Hour field caption, its accessible name, the dial name on the hours face, and the prefix of the hour announcement
   * @default "Hour"
   */
  hour?: string;

  /**
   * @description Minute field caption, its accessible name, the dial name on the minutes face, and the prefix of the minute announcement.
   * Until 5.0 the minute announcement keeps its own default, `Minutes`, when neither `minute` nor `announceMinute` is set.
   * @default "Minute"
   */
  minute?: string;

  /**
   * @description Second field caption, its accessible name, the dial name on the seconds face, and the prefix of the second announcement (requires `clock.showSeconds`)
   * @default "Second"
   */
  second?: string;

  /**
   * @description Hour label on mobile
   * @default "Hour"
   * @deprecated Use `hour`. Removed in 5.0.
   */
  mobileHour?: string;

  /**
   * @description Minute label on mobile
   * @default "Minute"
   * @deprecated Use `minute`. Removed in 5.0.
   */
  mobileMinute?: string;

  /**
   * @description "Clear" button text
   * @default "Clear"
   */
  clear?: string;

  /**
   * @description Accessible label for the hour spinbutton and the clock dial while it shows hours
   * @default "Hour"
   * @deprecated Use `hour`. Removed in 5.0.
   */
  hourLabel?: string;

  /**
   * @description Accessible label for the minute spinbutton and the clock dial while it shows minutes
   * @default "Minute"
   * @deprecated Use `minute`. Removed in 5.0.
   */
  minuteLabel?: string;

  /**
   * @description Accessible name of the group around the clock dial
   * @default "Clock"
   */
  clock?: string;

  /**
   * @description Accessible label for the group that wraps the analog clock dial
   * @default "Clock"
   * @deprecated Use `clock`. Removed in 5.0.
   */
  clockLabel?: string;

  /**
   * @description Accessible name of the AM/PM group
   * @default "Period"
   */
  period?: string;

  /**
   * @description Accessible label for the AM/PM period group
   * @default "Period"
   * @deprecated Use `period`. Removed in 5.0.
   */
  periodLabel?: string;

  /**
   * @description Accessible name of the group around the time fields
   * @default "Time"
   */
  timeFields?: string;

  /**
   * @description Accessible label for the time wrapper group / tips
   * @default "Time"
   * @deprecated Use `timeFields`. Removed in 5.0.
   */
  timeLabel?: string;

  /**
   * @description Accessible label for the 24-hour tips group
   * @default "24-hour"
   * @deprecated Has no effect. Removed in 5.0.
   */
  format24Label?: string;

  /**
   * @description Accessible name of the range From/To tabs
   * @default "Range selection"
   */
  range?: string;

  /**
   * @description Accessible label for the range selection tablist
   * @default "Range selection"
   * @deprecated Use `range`. Removed in 5.0.
   */
  rangeSelectionLabel?: string;

  /**
   * @description Text of the range From tab
   * @default "From"
   */
  rangeFrom?: string;

  /**
   * @description Text of the range To tab
   * @default "To"
   */
  rangeTo?: string;

  /**
   * @description Label of the timezone selector
   * @default "Timezone"
   */
  timezone?: string;

  /**
   * @description Accessible name of the view switch on the clock face view
   * @default "Switch to keyboard input"
   */
  switchToKeyboard?: string;

  /**
   * @description Accessible label for the keyboard-input switch icon
   * @default "Switch to keyboard input"
   * @deprecated Use `switchToKeyboard`. Removed in 5.0.
   */
  switchToKeyboardLabel?: string;

  /**
   * @description Accessible name of the view switch on the keyboard view
   * @default "Switch to clock"
   */
  switchToClock?: string;

  /**
   * @description Accessible label for the clock-view switch icon
   * @default "Switch to clock"
   * @deprecated Use `switchToClock`. Removed in 5.0.
   */
  switchToClockLabel?: string;

  /**
   * @description Accessible label for the generic view toggle button
   * @default "Toggle"
   * @deprecated Has no effect; the view switch button is labelled by `switchToKeyboard` / `switchToClock`. Removed in 5.0.
   */
  toggleLabel?: string;

  /**
   * @description Accessible label for the timezone selector
   * @default "Timezone"
   * @deprecated Has no effect; use `labels.timezone`. Removed in 5.0.
   */
  timezoneSelectorLabel?: string;

  /**
   * @description Screen-reader announcement prefix for the selected hour
   * @default "Hour"
   * @deprecated Use `hour`. Removed in 5.0.
   */
  announceHour?: string;

  /**
   * @description Screen-reader announcement prefix for the selected minutes
   * @default "Minutes"
   * @deprecated Use `minute`. Removed in 5.0.
   */
  announceMinute?: string;

  /**
   * @description Screen-reader announcement when AM is selected
   * @default "AM selected"
   */
  announceAmSelected?: string;

  /**
   * @description Screen-reader announcement when PM is selected
   * @default "PM selected"
   */
  announcePmSelected?: string;

  /**
   * @description Error/announcement text for an invalid time format
   * @default "Invalid time format"
   */
  invalidTimeFormat?: string;

  /**
   * @description Screen-reader announcement after Clear
   * @default "Time cleared"
   */
  announceCleared?: string;
}

/**
 * Behavior configuration
 */
export interface BehaviorOptions {
  /**
   * @description Return focus to the input when the picker closes (WAI-ARIA dialog pattern). Setting it to `true` is recommended; 5.0 makes `true` the default.
   * @default false
   */
  returnFocus?: boolean;

  /**
   * @description Focus input after closing modal. Old name of `returnFocus`.
   * @default false
   * @deprecated Use `returnFocus`. Removed in 5.0.
   */
  focusInputAfterClose?: boolean;

  /**
   * @description Enable focus trap in modal
   * @default true
   */
  focusTrap?: boolean;

  /**
   * @description Extra delay (ms) before the picker starts to close after OK, Cancel, Escape, a backdrop click or `close()`
   * @default 0
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
   * @description Timezone IDs shown in the selector, instead of the built-in list.
   * If not provided, uses a curated list of common timezones.
   * @example list: ['UTC', 'America/New_York', 'Europe/London']
   */
  list?: readonly string[];

  /**
   * @description Whitelist of allowed timezone IDs.
   * If not provided, uses a curated list of common timezones.
   * @example whitelist: ['UTC', 'America/New_York', 'Europe/London']
   * @deprecated Use `list`. Removed in 5.0.
   */
  whitelist?: readonly string[];

  /**
   * @description Label for timezone selector
   * @default "Timezone"
   * @deprecated Use `labels.timezone`. Removed in 5.0.
   */
  label?: string;
}

/**
 * Wheel / compact-wheel mode configuration
 * @example
 * wheel: {
 *   placement: 'auto',
 *   hideFooter: true,
 *   commitOnScroll: true
 * }
 */
export interface WheelOptions {
  /**
   * @description Popover placement relative to input in compact-wheel mode.
   * When unset, compact-wheel opens as a modal.
   * Set 'auto' | 'top' | 'bottom' to show compact-wheel as a popover:
   * 'auto' opens below if space allows, otherwise above. 'top' / 'bottom' open on that side
   * while it has room for at least three wheel rows, otherwise on the other side.
   * In every placement the popover stays inside the viewport and scrolls when it is too tall.
   * @default undefined (modal)
   */
  placement?: 'auto' | 'top' | 'bottom';

  /**
   * @description When true, the footer (OK/Cancel/Clear buttons + switch icon)
   * is not rendered in the DOM at all. Only works in compact-wheel mode.
   * Useful when commitOnScroll is enabled and buttons are unnecessary.
   * @default false
   */
  hideFooter?: boolean;

  /**
   * @description When enabled, the timepicker automatically commits the selected time
   * at the end of wheel scrolling, updating the input value and emitting a change event
   * without requiring the user to press OK. Only applies to wheel and compact-wheel modes.
   * @default false
   */
  commitOnScroll?: boolean;

  /**
   * @description When true, disabled hours/minutes/seconds are completely removed from the wheel list
   * instead of being dimmed. Only applies to wheel and compact-wheel modes.
   * Useful when many values are disabled (e.g., business hours only).
   * @default false
   */
  hideDisabled?: boolean;

  /**
   * @description When true, clicking outside the picker area does not close it.
   * Only applies to wheel and compact-wheel modes (popover and modal).
   * The user must explicitly press OK or Cancel to close the picker.
   * @default false
   */
  ignoreOutsideClick?: boolean;
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
   * @deprecated Use `labels.rangeFrom`. Removed in 5.0.
   */
  fromLabel?: string;

  /**
   * @description Label for "to" segment
   * @default "To"
   * @deprecated Use `labels.rangeTo`. Removed in 5.0.
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
   * @description Triggered when the user activates the input or a `data-open` element (click, Enter or Space) to open the picker, before it renders. `open()` does not trigger it.
   */
  onShow?: TimepickerEventCallback<ShowEventData>;

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
   * @description Triggered when second mode is selected (requires `clock.showSeconds`)
   */
  onSelectSecond?: TimepickerEventCallback<SelectSecondEventData>;

  /**
   * @description Triggered when AM or PM is selected, with `{ type }`
   */
  onSelectPeriod?: TimepickerEventCallback<SelectPeriodEventData>;

  /**
   * @description Triggered when AM is selected
   * @deprecated Use `onSelectPeriod`. Removed in 5.0.
   */
  onSelectAM?: TimepickerEventCallback<SelectAMEventData>;

  /**
   * @description Triggered when PM is selected
   * @deprecated Use `onSelectPeriod`. Removed in 5.0.
   */
  onSelectPM?: TimepickerEventCallback<SelectPMEventData>;

  /**
   * @description Triggered when the switch icon toggles between the clock face and keyboard input (requires `ui.viewSwitch`)
   */
  onSwitchView?: TimepickerEventCallback<SwitchViewEventData>;

  /**
   * @description Triggered when the clock face switches between hours, minutes and seconds, with `{ face }`
   */
  onSwitchFace?: TimepickerEventCallback<SwitchFaceEventData>;

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

  /**
   * @description Triggered when a wheel column starts scrolling (wheel and compact-wheel modes)
   */
  onWheelScrollStart?: TimepickerEventCallback<WheelScrollStartEventData>;

  /**
   * @description Triggered when a wheel column stops scrolling and snaps to a value (wheel and compact-wheel modes)
   */
  onWheelScrollEnd?: TimepickerEventCallback<WheelScrollEndEventData>;

  /**
   * @description Triggered when clear button is clicked
   */
  onClear?: TimepickerEventCallback<ClearEventData>;
}

/**
 * Clear button behavior configuration
 */
export interface ClearBehaviorOptions {
  /**
   * @description Whether clicking clear also empties the input field value
   * @default true
   * @deprecated Use `ui.clearButton: { clearInput }`. Removed in 5.0.
   */
  clearInput?: boolean;
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
  wheel?: WheelOptions;
  clearBehavior?: ClearBehaviorOptions;
}
