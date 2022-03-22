declare module 'timepicker-ui' {
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
     * @description Set default selector to append timepicker inside it. Timepicker default append to body
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
     * @default "CANCEL"
     */
    cancelLabel?: string;
    /**
     * @description Edit hour/minutes on the web mode. You have set option preventDefault to false.
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
     * @description Set increment hour by 1, 2, 3 hour
     * @default 1
     */
    incrementHours?: number;
    /**
     * @description Set increment minutes by 1, 5, 10, 15 minutes
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
     * @default "Select Time"
     */
    timeLabel?: string;
    /**
     * @description Turn on/off switch to minutes by select hour
     * @default true
     */
    switchToMinutesAfterSelectHour?: boolean;
    /**
     * @description Set theme to timepicker. Available options: basic, crane-straight, crane-radius
     * @default "basic"
     */
    theme?: 'basic' | 'crane-straight' | 'crane-radius';
    /**
     * @description Set type of clock, it contains 2 versions: 12h and 24h.
     * @default false
     */
    clockType?: '12h' | '24h';
    /**
     * @description The hours and minutes are arrays which accept strings and numbers to block select hours/minutes. The interval key allow only string with interval values i.e., if you have 24h clockType the string can be 03:00 - 15:00, 01:20 - 05:15, 02:03 - 06:55 etc.. On the other hand if you have 12h clockType the string can be i.e 01:30 PM - 6:30 PM, 02:00 AM - 10:00 AM, 02:30 AM - 10:30 PM. It is important to remember that first hour in the interval option should be less that the second value if you want to block values from AM to PM and if you are using interval with 24h clockType.
     * If the interval key is set, the hours/minutes keys are ignored.
     * @example
      disabledTime: {
        minutes: [1,2,4,5,55,23,"22","38"];
        hours: [1,"3","5", 8];
        interval: "10:00 AM - 12:00 PM";
      }
     * @default  undefined
     */
    disabledTime?: {
      minutes?: Array<string | number>;
      hours?: Array<string | number>;
      interval?: string;
    };
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
    constructor(element: HTMLDivElement, options?: OptionTypes);
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
