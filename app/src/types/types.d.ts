/** Payload when timepicker opens */
export type OpenEventData = {
  hour: string;
  minutes: string;
  type?: string;
  degreesHours: number | null;
  degreesMinutes: number | null;
};

/** Payload when user cancels */
export type CancelEventData = Record<string, never>;

/** Payload when user confirms time */
export type ConfirmEventData = {
  hour?: string;
  minutes?: string;
  type?: string;
};

/** Payload when modal shows */
export type ShowEventData = Record<string, never>;

/** Payload when modal hides */
export type HideEventData = Record<string, never>;

/** Payload for real-time updates */
export type UpdateEventData = {
  hour?: string;
  minutes?: string;
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

/** Payload when AM selected */
export type SelectAMEventData = Record<string, never>;

/** Payload when PM selected */
export type SelectPMEventData = Record<string, never>;

/** Payload when switching view */
export type SwitchViewEventData = Record<string, never>;

/** Payload when validation error occurs */
export type ErrorEventData = {
  error: string;
  rejectedHour?: string;
  rejectedMinute?: string;
  inputHour?: string | number;
  inputMinute?: string | number;
  inputType?: string;
  inputLength?: string | number;
};

/** Callback function for timepicker events */
export type TimepickerEventCallback<T = unknown> = (eventData: T) => void;

export type OptionTypes = {
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
  /** Focus input after close @default false */
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
    | 'cyberpunk';
  /** Clock type: 12h or 24h @default "12h" */
  clockType?: '12h' | '24h';
  /** Disable specific times (hours/minutes/intervals) */
  disabledTime?: {
    minutes?: Array<string | number>;
    hours?: Array<string | number>;
    interval?: string | string[];
  };
  /** Current time config */
  /** Current time config */
  currentTime?:
    | {
        time?: Date;
        updateInput?: boolean;
        locales?: string | string[];
        preventClockType?: boolean;
      }
    | boolean;

  /** Focus trap on modal @default true */
  focusTrap?: boolean;
  /** Delay for clickable elements (ms) @default 300 */
  delayHandler?: number;
  /** Custom ID for instance */
  id?: string;
  /** Inline mode config */
  inline?: {
    enabled: boolean;
    containerId: string;
    /** @default false */
    showButtons?: boolean;
    /** @default true */
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
