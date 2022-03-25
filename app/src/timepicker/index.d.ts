import './styles/main.scss';
import './styles/theme.scss';
import type { OptionTypes } from './utils/types';
declare type TypeFunction = () => void;
export default class TimepickerUI {
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
    constructor(element: HTMLElement, options?: OptionTypes);
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
    /**
     * @description The create method that init timepicker
     */
    create: () => void;
    /**
     * @description The open method opens immediately timepicker after init
     * @param callback - The callback function triggered when timepicker is open by this method
     */
    open: (callback?: (() => void) | undefined) => void;
    /**
     * @description Closure method closes the timepicker
     * @param args - These parameters in this method are optional and order is any. You can set callback function first or boolean,
     * or just boolean or just callback. If the boolean is set to true the input will be updating with the current value on picker.
     * The callback function start immediately after close, if is invoke. The max parameters length is set to 2
     */
    close: (...args: Array<boolean | TypeFunction>) => void;
    /**
     * @description The destroy method destroy actual instance of picker by cloning element.
     * @param callback - The callback function is started after destroyed method. This parameter is optional.
     */
    destroy: (callback?: TypeFunction | undefined) => void;
    /**
     * @description The update method which update timepicker with new options and can create a new instance.
     * @param value - The first parameter is a object with key options which is timepicker options and it will be updated to current
     * instance and is `required`. The `create` key is a boolean which if is set to true it starting the create() method after invoke update
     * function and is optional. The `create` option is useful if you are using destroy and update methods together.
     * @param callback - The `callback` function is started after update method. This parameter is optional.
     */
    update: (value: {
        options: OptionTypes;
        create?: boolean;
    }, callback?: TypeFunction | undefined) => void;
    private _preventClockTypeByCurrentTime;
    private _updateInputValueWithCurrentTimeOnStart;
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
    private _getDestructuringObj;
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
export {};
