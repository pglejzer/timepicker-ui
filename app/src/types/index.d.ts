declare module 'timepicker-ui' {
  export type OpenEventData = {
    hour: string;
    minutes: string;
    type?: string;
    degreesHours: number | null;
    degreesMinutes: number | null;
  };

  export type CancelEventData = Record<string, never>;

  export type ConfirmEventData = {
    hour?: string;
    minutes?: string;
    type?: string;
  };

  export type ShowEventData = Record<string, never>;

  export type HideEventData = Record<string, never>;

  export type UpdateEventData = {
    hour: string;
    minutes: string;
    type?: string;
  };

  export type SelectHourEventData = {
    hour: string;
  };

  export type SelectMinuteEventData = {
    minutes: string;
  };

  export type SelectAMEventData = Record<string, never>;

  export type SelectPMEventData = Record<string, never>;

  export type SwitchViewEventData = Record<string, never>;

  export type ErrorEventData = {
    error: string;
    rejectedHour?: string;
    rejectedMinute?: string;
    inputHour?: string | number;
    inputMinute?: string | number;
    inputType?: string;
    inputLength?: string | number;
  };

  type TimepickerEventCallback<T = unknown> = (eventData: T) => void;

  export interface TimepickerEventMap {
    open: OpenEventData;
    cancel: CancelEventData;
    confirm: ConfirmEventData;
    show: ShowEventData;
    hide: HideEventData;
    update: UpdateEventData;
    'select:hour': SelectHourEventData;
    'select:minute': SelectMinuteEventData;
    'select:am': SelectAMEventData;
    'select:pm': SelectPMEventData;
    'switch:view': SwitchViewEventData;
    error: ErrorEventData;
  }

  export interface ClockOptions {
    /** @default "12h" */
    type?: '12h' | '24h';
    /** @default 1 */
    incrementHours?: number;
    /** @default 1 */
    incrementMinutes?: number;
    /** @default true */
    autoSwitchToMinutes?: boolean;
    /**
     * @description Disable specific hours, minutes, or time intervals
     * @example
     * disabledTime: {
     *   minutes: [1, 2, 4, 5, 55, 23, "22", "38"],
     *   hours: [1, "3", "5", 8],
     *   interval: "10:00 AM - 12:00 PM"
     * }
     */
    disabledTime?: {
      minutes?: Array<string | number>;
      hours?: Array<string | number>;
      interval?: string | string[];
    };
    /**
     * @description Set current time to the timepicker
     * @example currentTime: true
     * @example
     * currentTime: {
     *   time: new Date(),
     *   updateInput: true,
     *   locales: "en-US",
     *   preventClockType: false
     * }
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

  export interface UIOptions {
    /** @default "basic" */
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
    /** @default true */
    animation?: boolean;
    /** @default true */
    backdrop?: boolean;
    /** @default false */
    mobile?: boolean;
    /** @default false */
    enableSwitchIcon?: boolean;
    /** @default false */
    editable?: boolean;
    /** @default false */
    enableScrollbar?: boolean;
    cssClass?: string;
    appendModalSelector?: string;
    iconTemplate?: string;
    iconTemplateMobile?: string;
    /**
     * @description Enable inline mode for always-visible timepicker
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

  export interface LabelsOptions {
    /** @default "AM" */
    am?: string;
    /** @default "PM" */
    pm?: string;
    /** @default "OK" */
    ok?: string;
    /** @default "Cancel" */
    cancel?: string;
    /** @default "Select time" */
    time?: string;
    /** @default "Enter Time" */
    mobileTime?: string;
    /** @default "Hour" */
    mobileHour?: string;
    /** @default "Minute" */
    mobileMinute?: string;
  }

  export interface BehaviorOptions {
    /** @default false */
    focusInputAfterClose?: boolean;
    /** @default true */
    focusTrap?: boolean;
    /** @default 300 */
    delayHandler?: number;
    id?: string;
  }

  export interface CallbacksOptions {
    onOpen?: TimepickerEventCallback<OpenEventData>;
    onCancel?: TimepickerEventCallback<CancelEventData>;
    onConfirm?: TimepickerEventCallback<ConfirmEventData>;
    onUpdate?: TimepickerEventCallback<UpdateEventData>;
    onSelectHour?: TimepickerEventCallback<SelectHourEventData>;
    onSelectMinute?: TimepickerEventCallback<SelectMinuteEventData>;
    onSelectAM?: TimepickerEventCallback<SelectAMEventData>;
    onSelectPM?: TimepickerEventCallback<SelectPMEventData>;
    onError?: TimepickerEventCallback<ErrorEventData>;
  }

  export interface TimepickerOptions {
    clock?: ClockOptions;
    ui?: UIOptions;
    labels?: LabelsOptions;
    behavior?: BehaviorOptions;
    callbacks?: CallbacksOptions;
  }

  export type OptionTypes = TimepickerOptions;

  type TypeFunction = () => void;

  export class TimepickerUI {
    constructor(element: string | HTMLElement, options?: TimepickerOptions);

    create(): void;
    open(callback?: () => void): void;
    close(callback?: () => void): void;
    destroy(options?: { keepInputValue?: boolean; callback?: () => void } | (() => void)): void;
    update(
      value: {
        options: TimepickerOptions;
        create?: boolean;
      },
      callback?: () => void,
    ): void;
    getElement(): HTMLElement;
    getValue(): {
      hour: string;
      minutes: string;
      type?: string;
      time: string;
      degreesHours: number | null;
      degreesMinutes: number | null;
    };
    setValue(time: string, updateInput?: boolean): void;

    on<K extends keyof TimepickerEventMap>(event: K, handler: (data: TimepickerEventMap[K]) => void): void;
    once<K extends keyof TimepickerEventMap>(event: K, handler: (data: TimepickerEventMap[K]) => void): void;
    off<K extends keyof TimepickerEventMap>(event: K, handler?: (data: TimepickerEventMap[K]) => void): void;
  }
}
