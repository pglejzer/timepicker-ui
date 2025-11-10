declare module 'timepicker-ui' {
  /**
   * @description Callback data type for timepicker events
   */
  export type CallbackData = {
    hour?: string | null;
    minutes?: string | null;
    type?: string | null;
    degreesHours?: number | null;
    degreesMinutes?: number | null;
    hourNotAccepted?: string | null;
    minutesNotAccepted?: string | null;
    eventType?: 'accept' | 'cancel' | 'click' | 'change' | null;
    error?: string;
    currentHour?: string | number;
    currentMin?: string | number;
    currentType?: string;
    currentLength?: string | number;
  };

  /**
   * @description Callback function type for timepicker events
   */
  type TimepickerEventCallback = (eventData: CallbackData) => void;

  export type OptionTypes = {
    /**
     * @description Set custom text to AM label
     * @default "AM"
     */
    amLabel?: string;
    /**
     * @description Turn on/off animations on picker on start/close
     * @default true
     */
    animation?: boolean;
    /**
     * @description Set default selector to append timepicker inside it. Timepicker default append to `body`
     * @default ""
     */
    appendModalSelector?: string;
    /**
     * @description Turn on/off backdrop
     * @default true
     */
    backdrop?: boolean;
    /**
     * @description Set custom text to cancel button
     * @default "Cancel"
     */
    cancelLabel?: string;
    /**
     * @description Edit hour/minutes on the web mode. You have set option `preventDefault` to false.
     * @default false
     */
    editable?: boolean;
    /**
     * @description Turn on/off scroll if timepicker is open
     * @default false
     */
    enableScrollbar?: boolean;
    /**
     * @description Turn on/off icon to switch desktop/mobile
     * @default false
     */
    enableSwitchIcon?: boolean;
    /**
     * @description Set custom text to time label on mobile version
     * @default "Enter Time"
     */
    mobileTimeLabel?: string;
    /**
     * @description Turn on/off focus to input after close modal
     * @default false
     */
    focusInputAfterCloseModal?: boolean;
    /**
     * @description Set custom text to hour label on mobile version
     * @default "Hour"
     */
    hourMobileLabel?: string;
    /**
     * @description Set default template to switch desktop.This options is using by default material design icon
     * @default "<i class='material-icons timepicker-ui-keyboard-icon'> keyboard </i>"
     */
    iconTemplate?: string;
    /**
     * @description Set default template to switch mobile. This options is using by default material design icon
     * @default "<i class='material-icons timepicker-ui-keyboard-icon'> schedule </i>"
     */
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
    /**
     * @description Set custom text to pm label
     * @default "PM"
     */
    pmLabel?: string;
    /**
     * @description Set on/off defaults events to clock face events
     * @default true
     */
    preventDefault?: boolean;
    /**
     * @description Set custom text to time label on desktop version
     * @default "Select time"
     */
    timeLabel?: string;
    /**
     * @description Turn on/off switch to minutes by select hour
     * @default true
     */
    autoSwitchToMinutes?: boolean;
    /**
     * @description Set theme to timepicker. Available options: `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`, `custom`
     *
     * The `custom` theme allows you to create your own styling by overriding CSS variables.
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
      | 'custom';
    /**
     * @description Set type of clock, it contains 2 versions: `12h` and `24h`.
     * @default false
     */
    clockType?: '12h' | '24h';
    /**
     * @description - The `hours` and `minutes` are arrays which accept strings and numbers to block select hours/minutes.
     * - The `interval` key can accept string or string[] to block select time intervals.
     * - If the interval key is set, the hours/minutes keys are `ignored`.
     * @example
      disabledTime: {
        minutes: [1,2,4,5,55,23,"22","38"],
        hours: [1,"3","5", 8],
        interval: "10:00 AM - 12:00 PM",
      }
     * @default  undefined
     */
    disabledTime?: {
      minutes?: Array<string | number>;
      hours?: Array<string | number>;
      interval?: string | string[];
    };
    /**
     * @description Set current time to the input and timepicker.\
     * If this options is set to `true` it's gonna update picker with toLocaleTimeString() and input with value based on your location.
     * This option also allows to put object with properties.
     * @example
        currentTime: {
          time: new Date(),
          updateInput: true,
          locales: "en-US",
          preventClockType: false
        };
     * @example currentTime: true
     * @default  undefined
     */
    currentTime?:
      | {
          /**
           * The `time` key allows to put any valid date to update picker.
           * @requires
           * If the `updateInput` is set to `false/undefined` and the default value from the input not exist, the `time` key value will be displayed in the picker.
           *
           * If the `updateInput` is set to `false/undefined` but the default value from the input exist, the `time` key will be ignored.
           */
          time?: Date;
          /**
           * The `updateInput` key is set to `true` it's going update input value with set time key.
           */
          updateInput?: boolean;
          /**
           * The `locales` key can change language from `toLocaleTimeString()`.
           */
          locales?: string | string[];
          /**
           * The `preventClockType` key if is set to `true` it's `force` the clockType option to set value "12h" or "24h" based on your location
           * with current time and `locales` key value is ignored.
           */
          preventClockType?: boolean;
        }
      | boolean;
    /**
     * @description Set focus trap to the modal element to all elements with tabindex in the picker
     * @default true
     */
    focusTrap?: boolean;
    /**
     * @description Set delay to clickable elements like button "OK", "Cancel" etc. The value has to be set in milliseconds.
     * @default 300
     */
    delayHandler?: number;
    /**
     * @description Callback triggered when the timepicker opens
     * @example onOpen: (data) => console.log('Picker opened!', data)
     */
    onOpen?: TimepickerEventCallback;
    /**
     * @description Callback triggered when user cancels the timepicker
     * @example onCancel: (data) => console.log('Cancelled', data)
     */
    onCancel?: TimepickerEventCallback;
    /**
     * @description Callback triggered when user confirms the time selection (clicks OK)
     * @example onConfirm: (data) => console.log('Time confirmed', data)
     */
    onConfirm?: TimepickerEventCallback;
    /**
     * @description Callback triggered during interaction with the clock (real-time updates)
     * @example onUpdate: (data) => console.log('Time updated', data)
     */
    onUpdate?: TimepickerEventCallback;
    /**
     * @description Callback triggered when hour selection mode is activated
     * @example onSelectHour: (data) => console.log('Hour mode selected', data)
     */
    onSelectHour?: TimepickerEventCallback;
    /**
     * @description Callback triggered when minute selection mode is activated
     * @example onSelectMinute: (data) => console.log('Minute mode selected', data)
     */
    onSelectMinute?: TimepickerEventCallback;
    /**
     * @description Callback triggered when AM is selected
     * @example onSelectAM: (data) => console.log('AM selected', data)
     */
    onSelectAM?: TimepickerEventCallback;
    /**
     * @description Callback triggered when PM is selected
     * @example onSelectPM: (data) => console.log('PM selected', data)
     */
    onSelectPM?: TimepickerEventCallback;
    /**
     * @description Callback triggered when invalid time format is detected in input
     * @example onError: (data) => console.log('Invalid format:', data.error)
     */
    onError?: TimepickerEventCallback;
    /**
     * @description Enable inline mode for always-visible timepicker
     * If enabled is true, containerId must be provided and the timepicker will be rendered inside the specified container instead of as a modal.
     * The timepicker will not open on input click and will be always visible.
     * @example
     * inline: {
     *   enabled: true,
     *   containerId: "timepicker-container",
     *   showButtons: false,
     *   autoUpdate: true
     * }
     * @default undefined
     */
    inline?: {
      /**
       * @description Enable or disable inline mode
       */
      enabled: boolean;
      /**
       * @description ID of the container element where the timepicker should be rendered (required when enabled is true)
       */
      containerId: string;
      /**
       * @description Show or hide OK/Cancel buttons in inline mode
       * @default false
       */
      showButtons?: boolean;
      /**
       * @description Automatically update input value when time changes (real-time updates)
       * @default true
       */
      autoUpdate?: boolean;
    };
    /**
     * @description Add additional custom CSS class to the timepicker wrapper element. The default 'timepicker-ui' class is always added.
     * This allows multiple timepickers on the same page to have additional custom classes for styling or targeting.
     * @example cssClass: "my-custom-timepicker"
     * @default undefined
     */
    cssClass?: string;
  };

  type TypeFunction = () => void;
  export class TimepickerUI {
    private _degreesHours;
    private _degreesMinutes;
    private _options;
    private _eventsClickMobile;
    private _eventsClickMobileHandler;
    private _mutliEventsMove;
    private _mutliEventsMoveHandler;
    private _clickTouchEvents;
    private _element;
    private _isMobileView;
    private _isTouchMouseMove;
    private _disabledTime;
    private _cloned;
    constructor(element: string, options?: OptionTypes);
    private get modalTemplate();
    private get modalElement();
    private get clockFace();
    private get input();
    private get clockHand();
    private get circle();
    private get tipsWrapper();
    private get tipsWrapperFor24h();
    private get minutes();
    private get hour();
    private get AM();
    private get PM();
    private get minutesTips();
    private get hourTips();
    private get allValueTips();
    private get openElementData();
    private get openElement();
    private get cancelButton();
    private get okButton();
    private get activeTypeMode();
    private get keyboardClockIcon();
    private get footer();
    create: () => void;
    open: (callback?: (() => void) | undefined) => void;
    close: (...args: Array<boolean | TypeFunction>) => void;
    destroy: (callback?: TypeFunction | undefined) => void;
    update: (
      value: {
        options: OptionTypes;
        create?: boolean;
      },
      callback?: TypeFunction | undefined,
    ) => void;
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
    setTheme(themeConfig: {
      primaryColor?: string;
      backgroundColor?: string;
      surfaceColor?: string;
      surfaceHoverColor?: string;
      textColor?: string;
      secondaryTextColor?: string;
      disabledTextColor?: string;
      onPrimaryColor?: string;
      borderColor?: string;
      shadow?: string;
      borderRadius?: string;
      fontFamily?: string;
    }): void;
    on(event: string, handler: (data: CallbackData) => void): void;
    once(event: string, handler: (data: CallbackData) => void): void;
    off(event: string, handler?: (data: CallbackData) => void): void;
    private _checkDisabledValuesOnStart;
    private _checkMobileOption;
    private _getDisableTime;
    private _removeCircleClockClasses24h;
    private _setCircleClockClasses24h;
    private _setErrorHandler;
    private _removeErrorHandler;
    private _setOnStartCSSClassesIfClockType24h;
    private _setTheme;
    private _setInputClassToInputElement;
    private _setDataOpenToInputIfDosentExistInWrapper;
    private _setClassTopOpenElement;
    private _removeBackdrop;
    private _setNormalizeClass;
    private _setFlexEndToFooterIfNoKeyboardIcon;
    private _eventsBundle;
    private _handleOpenOnClick;
    private _getInputValueOnOpenAndSet;
    private _handleCancelButton;
    private _handleOkButton;
    private _handleBackdropClick;
    private _setBgColorToCirleWithHourTips;
    private _setBgColorToCircleWithMinutesTips;
    private _removeBgColorToCirleWithMinutesTips;
    private _setTimepickerClassToElement;
    private _setClassActiveToHourOnOpen;
    private _setMinutesToClock;
    private _setHoursToClock;
    private _setTransformToCircleWithSwitchesHour;
    private _setTransformToCircleWithSwitchesMinutes;
    private _handleAmClick;
    private _handlePmClick;
    private _handleAnimationClock;
    private _handleAnimationSwitchTipsMode;
    private _handleHourClick;
    private _handleMinutesClick;
    private _handleEventToMoveHand;
    private _toggleClassActiveToValueTips;
    private _handleMoveHand;
    private _setModalTemplate;
    private _setScrollbarOrNot;
    private _setAnimationToOpen;
    private _removeAnimationToClose;
    private _handlerViewChange;
    private _handleIconChangeView;
    private _handlerClickHourMinutes;
    private _handleClickOnHourMobile;
    private _handleKeyPress;
    private _handleEscClick;
  }
}
