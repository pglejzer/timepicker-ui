/** Payload when timepicker opens */
export type OpenEventData = {
  hour: string;
  minutes: string;
  /** Present only with `clock.showSeconds` */
  seconds?: string;
  type?: string;
  /**
   * @deprecated Internal clock-hand angle; use `hour` instead. Removed in 5.0.
   */
  degreesHours: number | null;
  /**
   * @deprecated Internal clock-hand angle; use `minutes` instead. Removed in 5.0.
   */
  degreesMinutes: number | null;
};

/** Payload when user cancels */
export type CancelEventData = Record<string, never>;

/** Payload when user confirms time */
export type ConfirmEventData = {
  hour?: string;
  minutes?: string;
  /** Present only with `clock.showSeconds` */
  seconds?: string;
  type?: string;
  /** When true, this confirm was triggered by commitOnScroll (auto-commit) */
  autoCommit?: boolean;
};

/** Payload when user clears time */
export type ClearEventData = {
  previousValue: string | null;
};

/** Payload when modal shows */
export type ShowEventData = Record<string, never>;

/**
 * Payload of the `hide` event
 * @deprecated The `hide` event is never emitted. Removed in 5.0.
 */
export type HideEventData = Record<string, never>;

/** Payload for real-time updates */
export type UpdateEventData = {
  hour?: string;
  minutes?: string;
  /** Present only with `clock.showSeconds` */
  seconds?: string;
  type?: string;
};

/** Payload when hour mode activated */
export type SelectHourEventData = {
  hour: string;
};

/** Payload when minute mode activated */
export type SelectMinuteEventData = {
  minutes: string;
};

/** Payload when second mode activated (requires `clock.showSeconds`) */
export type SelectSecondEventData = {
  seconds: string;
};

/**
 * Payload when AM selected
 * @deprecated Use `SelectPeriodEventData`. Removed in 5.0.
 */
export type SelectAMEventData = Record<string, never>;

/**
 * Payload when PM selected
 * @deprecated Use `SelectPeriodEventData`. Removed in 5.0.
 */
export type SelectPMEventData = Record<string, never>;

/** Payload when switching view */
export type SwitchViewEventData = Record<string, never>;

/** Payload when AM or PM is selected */
export type SelectPeriodEventData = {
  type: 'AM' | 'PM';
};

/** Payload when the clock face switches between hours, minutes and seconds */
export type SwitchFaceEventData = {
  face: 'hours' | 'minutes' | 'seconds';
};

/** Payload when timezone is changed */
export type TimezoneChangeEventData = {
  timezone: string;
};

export type RangeConfirmEventData = {
  from: string;
  to: string;
  duration: number;
  /** Exact duration in seconds; present only with `clock.showSeconds` */
  durationSeconds?: number;
};

export type RangeSwitchEventData = {
  active: 'from' | 'to';
  disabledTime?: {
    hours: string[];
    minutes: string[];
    seconds?: string[];
    fromType?: string;
    fromHour?: number;
    fromMinute?: number;
  } | null;
};

export type RangeValidationEventData = {
  valid: boolean;
  duration: number;
  /** Exact duration in seconds; present only with `clock.showSeconds` */
  durationSeconds?: number;
  minDuration?: number;
  maxDuration?: number;
};

export type RangeMinuteCommitEventData = {
  hour: string;
  minutes: string;
  seconds?: string;
  type?: string;
};

export type RangeGetDisabledTimeEventData = Record<string, never>;

export type RangeUpdateDisabledEventData = Record<string, never>;

/** Payload when wheel scroll starts on a column */
export type WheelScrollStartEventData = {
  column: 'hours' | 'minutes' | 'seconds' | 'ampm';
};

/** Payload when wheel scroll ends and snaps to a value */
export type WheelScrollEndEventData = {
  column: 'hours' | 'minutes' | 'seconds' | 'ampm';
  value: string;
  previousValue: string | null;
};

/** Payload when validation error occurs */
export type ErrorEventData = {
  error: string;
  /**
   * @deprecated Always undefined. Removed in 5.0.
   */
  rejectedHour?: string;
  /**
   * @deprecated Always undefined. Removed in 5.0.
   */
  rejectedMinute?: string;
  inputHour?: string | number;
  inputMinute?: string | number;
  /** Present only with `clock.showSeconds` */
  inputSecond?: string | number;
  inputType?: string;
  inputLength?: string | number;
};

/** Callback function for timepicker events */
export type TimepickerEventCallback<T = unknown> = (eventData: T) => void;

/**
 * @deprecated Use `TimepickerOptions` instead. Removed in 5.0.
 */
export type OptionTypes = {
  /** Picker mode: clock, wheel, or compact-wheel @default "clock" */
  mode?: 'clock' | 'wheel' | 'compact-wheel';
  /** AM label text @default "AM" */
  amLabel?: string;
  /** Enable animations @default true */
  animation?: boolean;
  /**
   * @description Set default selector to append timepicker inside it. Timepicker default append to `body`
   * @default ""
   */
  appendModalSelector?: string;
  /** Enable backdrop @default true */
  backdrop?: boolean;
  /** Cancel button text @default "Cancel" */
  cancelLabel?: string;
  /** Edit hour/minutes in web mode @default false */
  editable?: boolean;
  /** Enable scroll when open @default false */
  enableScrollbar?: boolean;
  /** Icon to switch desktop/mobile @default false */
  enableSwitchIcon?: boolean;
  /** Mobile time label @default "Enter Time" */
  mobileTimeLabel?: string;
  /**
   * @deprecated Old v3 name, has no effect. Use `behavior.returnFocus` in 4.x. Removed in 5.0, where focus returns to the input by default.
   */
  focusInputAfterCloseModal?: boolean;
  /** Mobile hour label @default "Hour" */
  hourMobileLabel?: string;
  /** Desktop icon template */
  iconTemplate?: string;
  /** Mobile icon template */
  iconTemplateMobile?: string;
  /**
   * @description Set increment hour by `1`, `2`, `3` hour
   * @default 1
   */
  incrementHours?: number;
  /**
   * @description Set increment minutes by `1`, `5`, `10`, `15` minutes
   * @default 1
   */
  incrementMinutes?: number;
  /**
   * @description set custom text to minute label on mobile version
   * @default "Minute"
   */
  minuteMobileLabel?: string;
  /**
   * @description Turn on/off mobile version
   * @default false
   */
  mobile?: boolean;
  /**
   * @description Set custom text to ok label
   * @default "OK"
   */
  okLabel?: string;
  /** PM label @default "PM" */
  pmLabel?: string;
  /** Time label (desktop) @default "Select time" */
  timeLabel?: string;
  /** Auto-switch to minutes @default true */
  autoSwitchToMinutes?: boolean;
  /** Theme @default "basic" */
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
  /** Clock type: 12h or 24h @default "12h" */
  clockType?: '12h' | '24h';
  /** Disable specific times (hours/minutes/intervals) */
  disabledTime?: {
    minutes?: Array<string | number>;
    hours?: Array<string | number>;
    interval?: string | string[];
  };
  /** Current time config */
  currentTime?:
    | {
        time?: Date;
        updateInput?: boolean;
        /**
         * @deprecated Has no effect since 4.5.0; the value is formatted by the library. Removed in 5.0.
         */
        locales?: string | string[];
        preventClockType?: boolean;
      }
    | boolean;

  /** Focus trap on modal @default true */
  focusTrap?: boolean;
  /** Extra delay (ms) before the picker starts to close after OK, Cancel, Escape, a backdrop click or `close()` @default 0 */
  delayHandler?: number;
  /** Custom ID for instance */
  id?: string;
  /** Inline mode config */
  inline?: {
    enabled: boolean;
    containerId: string;
    /** @default false */
    showButtons?: boolean;
    /** @default false */
    autoUpdate?: boolean;
  };
  /** Additional CSS class */
  cssClass?: string;
  /** Callback when picker opens */
  onOpen?: TimepickerEventCallback<OpenEventData>;
  /** Callback when user cancels */
  onCancel?: TimepickerEventCallback<CancelEventData>;
  /** Callback when user confirms */
  onConfirm?: TimepickerEventCallback<ConfirmEventData>;
  /** Callback during interaction */
  onUpdate?: TimepickerEventCallback<UpdateEventData>;
  /** Callback when hour mode activated */
  onSelectHour?: TimepickerEventCallback<SelectHourEventData>;
  /** Callback when minute mode activated */
  onSelectMinute?: TimepickerEventCallback<SelectMinuteEventData>;
  /** Callback when AM selected */
  onSelectAM?: TimepickerEventCallback<SelectAMEventData>;
  /** Callback when PM selected */
  onSelectPM?: TimepickerEventCallback<SelectPMEventData>;
  /** Callback on validation error */
  onError?: TimepickerEventCallback<ErrorEventData>;
};
