/* eslint-disable no-useless-return */
import {
  createNewEvent,
  createObjectFromData,
  getBrowser,
  getClickTouchPosition,
  getConfig,
  getIncrementTimes,
  getScrollbarWidth,
  hasClass,
  initCallback,
} from './utils';
import { getInputValue, handleValueAndCheck } from './utils/input';
import {
  createDisabledTime,
  checkDisabledHoursAndMinutes,
  checkedDisabledValuesInterval,
} from './utils/disable';
import './styles/main.scss';
import './styles/theme.scss';
import variables from './styles/variables.scss';
import { options as optionsDefault } from './utils/options';
import type { OptionTypes } from './utils/types';
import { name, allEvents, selectorActive } from './utils/variables';
import {
  getMobileModalTemplate,
  getModalTemplate,
  getNumberOfHours12,
  getNumberOfMinutes,
  getNumberOfHours24,
} from './utils/templates';
import ClockFace from './components/ClockFace';

const debounce = <T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

type TypeFunction = () => void;

export default class TimepickerUI {
  private _degreesHours: number | null;

  private _degreesMinutes: number | null;

  private _options: OptionTypes;

  private _eventsClickMobile: (event: Event) => Promise<void>;

  private _eventsClickMobileHandler: EventListenerOrEventListenerObject;

  private _mutliEventsMove: (event: Event) => void;

  private _mutliEventsMoveHandler: EventListenerOrEventListenerObject;

  private _clickTouchEvents: string[];

  private _element: HTMLElement;

  private _isMobileView: boolean | null;

  private _isTouchMouseMove: boolean | null;

  private _disabledTime: any;

  private _cloned: Node | null;

  private _inputEvents: string[];

  private _isModalRemove?: boolean;

  constructor(element: HTMLElement, options?: OptionTypes) {
    this._element = element;
    this._cloned = null;
    this._options = getConfig(
      { ...options, ...createObjectFromData(this._element?.dataset) },
      optionsDefault,
    );

    this._isTouchMouseMove = false;
    this._degreesHours =
      Number(
        getInputValue(this._element?.querySelector('input') as HTMLInputElement, this._options.clockType)
          .hour,
      ) * 30;
    this._degreesMinutes =
      Number(
        getInputValue(this._element?.querySelector('input') as HTMLInputElement, this._options.clockType)
          .minutes,
      ) * 6;

    this._isMobileView = false;

    this._mutliEventsMove = (event) => this._handleEventToMoveHand(event as TouchEvent);
    this._mutliEventsMoveHandler = this._mutliEventsMove.bind(this);

    this._eventsClickMobile = (event) => this._handlerClickHourMinutes(event);
    this._eventsClickMobileHandler = this._eventsClickMobile.bind(this);

    this._checkMobileOption();

    this._clickTouchEvents = ['click', 'mousedown', 'touchstart'];
    this._inputEvents = ['change', ...this._clickTouchEvents];

    this._disabledTime = null;

    this._preventClockTypeByCurrentTime();

    this._isModalRemove = true;
  }

  private get modalTemplate() {
    if (!this._options.mobile || !this._isMobileView) {
      return getModalTemplate(this._options);
    }
    return getMobileModalTemplate(this._options);
  }

  private get modalElement() {
    return document.querySelector('.timepicker-ui-modal') as HTMLDivElement;
  }

  private get clockFace() {
    return document.querySelector('.timepicker-ui-clock-face') as HTMLDivElement;
  }

  private get input() {
    return this._element?.querySelector('input') as HTMLInputElement;
  }

  private get clockHand() {
    return document.querySelector('.timepicker-ui-clock-hand') as HTMLDivElement;
  }

  private get circle() {
    return document.querySelector('.timepicker-ui-circle-hand') as HTMLDivElement;
  }

  private get tipsWrapper() {
    return document.querySelector('.timepicker-ui-tips-wrapper') as HTMLDivElement;
  }

  private get tipsWrapperFor24h() {
    return document.querySelector('.timepicker-ui-tips-wrapper-24h') as HTMLDivElement;
  }

  private get minutes() {
    return document.querySelector('.timepicker-ui-minutes') as HTMLInputElement;
  }

  private get hour() {
    return document.querySelector('.timepicker-ui-hour') as HTMLInputElement;
  }

  private get AM() {
    return document.querySelector('.timepicker-ui-am') as HTMLDivElement;
  }

  private get PM() {
    return document.querySelector('.timepicker-ui-pm') as HTMLDivElement;
  }

  private get minutesTips() {
    return document.querySelector('.timepicker-ui-minutes-time') as HTMLDivElement;
  }

  private get hourTips() {
    return document.querySelector('.timepicker-ui-hour-time-12') as HTMLDivElement;
  }

  private get allValueTips() {
    return [
      ...document.querySelectorAll('.timepicker-ui-value-tips'),
      ...document.querySelectorAll('.timepicker-ui-value-tips-24h'),
    ] as const as Array<HTMLDivElement>;
  }

  private get openElementData() {
    const data: NodeListOf<HTMLElement> = this._element?.querySelectorAll('[data-open]');

    if (data?.length > 0) {
      const arr: string[] = [];

      data.forEach(({ dataset }) => arr.push(dataset.open ?? ''));
      return [...new Set(arr)];
    }

    return null;
  }

  private get openElement() {
    if (this.openElementData === null) {
      this.input?.setAttribute('data-open', 'timepicker-ui-input');

      return [this.input];
    }

    return (
      this.openElementData.map((open) => this._element?.querySelectorAll(`[data-open='${open}']`))[0] ?? ''
    );
  }

  private get cancelButton() {
    return document.querySelector('.timepicker-ui-cancel-btn') as HTMLButtonElement;
  }

  private get okButton() {
    return document.querySelector('.timepicker-ui-ok-btn') as HTMLButtonElement;
  }

  private get activeTypeMode() {
    return document.querySelector('.timepicker-ui-type-mode.active') as HTMLButtonElement;
  }

  private get keyboardClockIcon() {
    return document.querySelector('.timepicker-ui-keyboard-icon-wrapper') as HTMLButtonElement;
  }

  private get footer() {
    return document.querySelector('.timepicker-ui-footer') as HTMLDivElement;
  }

  private get wrapper() {
    return document.querySelector('.timepicker-ui-wrapper') as HTMLDivElement;
  }

  /**
   * @description The create method that init timepicker
   */
  public create = (): void => {
    this._updateInputValueWithCurrentTimeOnStart();
    this._checkDisabledValuesOnStart();
    this._setTimepickerClassToElement();
    this._setInputClassToInputElement();
    this._setDataOpenToInputIfDosentExistInWrapper();
    this._setClassTopOpenElement();
    this._handleOpenOnEnterFocus();
    this._handleOpenOnClick();
    this._getDisableTime();
  };

  /**
   * @description The open method opens immediately timepicker after init
   * @param callback - The callback function triggered when timepicker is open by this method
   */
  public open = (callback?: () => void): void => {
    this.create();
    this._eventsBundle();

    initCallback(callback);
  };

  /**
   * @description Closure method closes the timepicker
   * @param args - These parameters in this method are optional and order is any. You can set callback function first or boolean,
   * or just boolean or just callback. If the boolean is set to true the input will be updating with the current value on picker.
   * The callback function start immediately after close, if is invoke. The max parameters length is set to 2
   */
  public close = debounce((...args: Array<boolean | TypeFunction>): void => {
    if (args.length > 2 || !this.modalElement) return;

    const [update] = args.filter((e) => typeof e === 'boolean');
    const [callback] = args.filter((e) => typeof e === 'function');

    if (update) {
      this._handleOkButton();
      this.okButton?.click();
    }

    this._isTouchMouseMove = false;

    allEvents
      .split(' ')
      .map((event) => document.removeEventListener(event, this._mutliEventsMoveHandler, false));

    document.removeEventListener('mousedown', this._eventsClickMobileHandler);
    document.removeEventListener('touchstart', this._eventsClickMobileHandler);
    document.removeEventListener('keypress', this._handleEscClick);
    this.wrapper.removeEventListener('keydown', this._focusTrapHandler);

    if (this._options.enableSwitchIcon) {
      this.keyboardClockIcon.removeEventListener('touchstart', this._handlerViewChange);
      this.keyboardClockIcon.removeEventListener('mousedown', this._handlerViewChange);
    }

    this._removeAnimationToClose();

    this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

    setTimeout(() => {
      document.body.style.overflowY = '';
      document.body.style.paddingRight = '';
    }, 400);

    this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

    setTimeout(() => {
      if (this._options.focusInputAfterCloseModal) this.input?.focus();

      if (this.modalElement === null) return;

      this.modalElement.remove();

      this._isModalRemove = true;
    }, 300);

    initCallback(callback as TypeFunction);
  }, 300);

  /**
   * @description The destroy method destroy actual instance of picker by cloning element.
   * @param callback - The callback function is started after destroyed method. This parameter is optional.
   */
  public destroy = (callback?: TypeFunction) => {
    allEvents
      .split(' ')
      .map((event) => document.removeEventListener(event, this._mutliEventsMoveHandler, false));

    document.removeEventListener('mousedown', this._eventsClickMobileHandler);
    document.removeEventListener('touchstart', this._eventsClickMobileHandler);

    if (this._options.enableSwitchIcon && this.keyboardClockIcon) {
      this.keyboardClockIcon.removeEventListener('touchstart', this._handlerViewChange);
      this.keyboardClockIcon.removeEventListener('mousedown', this._handlerViewChange);
    }

    this._cloned = this._element.cloneNode(true);
    this._element.after(this._cloned);
    this._element.remove();
    // @ts-ignore
    this._element = null;

    if (this._element === null) {
      initCallback(callback);
    }

    this._element = this._cloned as HTMLElement;
  };

  /**
   * @description The update method which update timepicker with new options and can create a new instance.
   * @param value - The first parameter is a object with key options which is timepicker options and it will be updated to current
   * instance and is `required`. The `create` key is a boolean which if is set to true it starting the create() method after invoke update
   * function and is optional. The `create` option is useful if you are using destroy and update methods together.
   * @param callback - The `callback` function is started after update method. This parameter is optional.
   */
  public update = (
    value: {
      options: OptionTypes;
      create?: boolean;
    },
    callback?: TypeFunction,
  ): void => {
    this._options = { ...this._options, ...value.options };

    this._checkMobileOption();

    if (value.create) {
      this.create();
    }

    initCallback(callback);
  };

  private _preventClockTypeByCurrentTime = () => {
    if (
      (typeof this._options?.currentTime !== 'boolean' && this._options?.currentTime?.preventClockType) ||
      (typeof this._options?.currentTime === 'boolean' && this._options?.currentTime)
    ) {
      const { currentTime, clockType } = this._options;
      const { type } = getInputValue(this.input as unknown as HTMLInputElement, clockType, currentTime, true);

      this._options.clockType = type ? '12h' : '24h';
    }
  };

  private _updateInputValueWithCurrentTimeOnStart = () => {
    if (
      (typeof this._options?.currentTime !== 'boolean' && this._options?.currentTime?.updateInput) ||
      (typeof this._options?.currentTime === 'boolean' && this._options?.currentTime)
    ) {
      const { hour, minutes, type } = getInputValue(
        this.input as unknown as HTMLInputElement,
        this._options.clockType,
        this._options.currentTime,
      );

      this.input.value = type ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
    }
  };

  private _checkDisabledValuesOnStart() {
    if (!this._options.disabledTime || this._options.disabledTime.interval) return;

    const {
      disabledTime: { hours, minutes },
      clockType,
    } = this._options;

    const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
    const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;

    if (!isValidHours || !isValidMinutes) {
      throw new Error('You set wrong hours or minutes in disabled option');
    }
  }

  private _checkMobileOption() {
    this._isMobileView = !!this._options.mobile;

    if (this._options.mobile) {
      this._options.editable = true;
    }
  }

  private _getDisableTime() {
    this._disabledTime = createDisabledTime(this._options);
  }

  private _removeCircleClockClasses24h() {
    this.circle?.classList.remove('timepicker-ui-circle-hand-24h');
    this.clockHand?.classList.remove('timepicker-ui-clock-hand-24h');
  }

  private _setCircleClockClasses24h() {
    if (this.circle) {
      this.circle?.classList.add('timepicker-ui-circle-hand-24h');
    }
    if (this.clockHand) {
      this.clockHand?.classList.add('timepicker-ui-clock-hand-24h');
    }
  }

  private _setErrorHandler() {
    const { error, currentHour, currentMin, currentType, currentLength } = getInputValue(
      this.input as unknown as HTMLInputElement,
      this._options.clockType,
    );

    if (error) {
      const newEl = document.createElement('div');
      this.input?.classList.add('timepicker-ui-invalid-format');
      newEl.classList.add('timepicker-ui-invalid-text');
      newEl.innerHTML = '<b>Invalid Time Format</b>';

      if (
        this.input?.parentElement &&
        this.input?.parentElement.querySelector('.timepicker-ui-invalid-text') === null
      ) {
        this.input?.after(newEl);
      }

      createNewEvent(this._element, 'geterror', {
        error,
        currentHour,
        currentMin,
        currentType,
        currentLength,
      });

      throw new Error(`Invalid Time Format: ${error}`);
    }

    // eslint-disable-next-line no-useless-return
    return;
  }

  private _removeErrorHandler() {
    this.input?.classList.remove('timepicker-ui-invalid-format');
    const divToRemove = this._element?.querySelector('.timepicker-ui-invalid-text') as HTMLDivElement;
    if (divToRemove) {
      divToRemove.remove();
    }
  }

  private _setOnStartCSSClassesIfClockType24h() {
    if (this._options.clockType === '24h') {
      let { hour } = getInputValue(
        this.input as unknown as HTMLInputElement,
        this._options.clockType,
        this._options.currentTime,
      );

      if (this.input.value.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        hour = this.input.value.split(':')[0];
      }

      if (Number(hour) > 12 || Number(hour) === 0) {
        this._setCircleClockClasses24h();
      }
    }
  }

  private _setTheme = (): void => {
    const allDiv = this.modalElement?.querySelectorAll('div');
    const { theme } = this._options;
    if (theme === 'crane-straight') {
      allDiv.forEach((div: HTMLDivElement) => div.classList.add('crane-straight'));
    } else if (theme === 'crane-radius') {
      allDiv.forEach((div: HTMLDivElement) => div.classList.add('crane-straight', 'radius'));
    }
  };

  private _setInputClassToInputElement = (): void => {
    if (!hasClass(this.input as unknown as HTMLInputElement, 'timepicker-ui-input')) {
      this.input?.classList.add('timepicker-ui-input');
    }
  };

  private _setDataOpenToInputIfDosentExistInWrapper = (): void => {
    if (this.openElementData === null) {
      this.input?.setAttribute('data-open', 'timepicker-ui-input');
    }
  };

  private _setClassTopOpenElement = (): void => {
    this.openElement.forEach((openEl) => openEl?.classList.add('timepicker-ui-open-element'));
  };

  private _removeBackdrop = (): void => {
    if (this._options.backdrop) return;

    this.modalElement?.classList.add('removed');
    this.openElement.forEach((openEl) => openEl?.classList.add('disabled'));
  };

  private _setNormalizeClass = (): void => {
    const allElement = this.modalElement?.querySelectorAll('div');

    this.modalElement?.classList.add('timepicker-ui-normalize');
    allElement?.forEach((div) => div.classList.add('timepicker-ui-normalize'));
  };

  private _setFlexEndToFooterIfNoKeyboardIcon = (): void => {
    if (!this._options.enableSwitchIcon && this.footer) {
      this.footer.style.justifyContent = 'flex-end';
    }
  };

  private _eventsBundle = (): void => {
    if (!this._isModalRemove) {
      return;
    }

    this._handleEscClick();
    this._setErrorHandler();
    this._removeErrorHandler();

    this.openElement.forEach((openEl) => openEl?.classList.add('disabled'));
    this.input?.blur();

    this._setScrollbarOrNot();
    this._setModalTemplate();
    this._setNormalizeClass();
    this._removeBackdrop();
    this._setBgColorToCirleWithHourTips();
    this._setOnStartCSSClassesIfClockType24h();
    this._setClassActiveToHourOnOpen();

    if (this.clockFace !== null) {
      const initClockFace = new ClockFace({
        array: getNumberOfHours12,
        classToAdd: 'timepicker-ui-hour-time-12',
        clockFace: this.clockFace,
        tipsWrapper: this.tipsWrapper,
        theme: this._options.theme,
        disabledTime: this._disabledTime?.value?.isInterval
          ? this._disabledTime?.value.rangeArrHour
          : this._disabledTime?.value?.hours,
        clockType: '12h',
        hour: this.hour.value,
      });

      initClockFace.create();

      if (this._options.clockType === '24h') {
        const initClockFace24h = new ClockFace({
          array: getNumberOfHours24,
          classToAdd: 'timepicker-ui-hour-time-24',
          clockFace: this.tipsWrapperFor24h,
          tipsWrapper: this.tipsWrapperFor24h,
          theme: this._options.theme,
          clockType: '24h',
          disabledTime: this._disabledTime?.value?.isInterval
            ? this._disabledTime?.value.rangeArrHour
            : this._disabledTime?.value?.hours,
          hour: this.hour.value,
        });

        initClockFace24h.create();
      } else {
        if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
          setTimeout(() => {
            if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
              initClockFace.updateDisable({
                hoursToUpdate: this._disabledTime?.value?.rangeArrHour,
                minutesToUpdate: {
                  endMinutes: this._disabledTime?.value.endMinutes,
                  removedEndHour: this._disabledTime?.value.removedEndHour,
                  removedStartedHour: this._disabledTime?.value.removedStartedHour,
                  actualHour: this.hour.value,
                  startMinutes: this._disabledTime?.value.startMinutes,
                },
              });
            }
          }, 300);
        } else {
          setTimeout(() => {
            initClockFace.updateDisable({
              minutesToUpdate: {
                actualHour: this.hour.value,
                pmHours: this._disabledTime?.value.pmHours,
                amHours: this._disabledTime?.value.amHours,
                activeMode: this.activeTypeMode?.textContent,
              },
            });
          }, 300);
        }

        initClockFace.updateDisable();
      }
    }

    this._setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this._setTheme();
    }, 0);

    this._setAnimationToOpen();
    this._getInputValueOnOpenAndSet();
    this._toggleClassActiveToValueTips(this.hour.value);

    if (!this._isMobileView) {
      this._setTransformToCircleWithSwitchesHour(this.hour.value);
      this._handleAnimationClock();
    }

    this._handleMinutesEvents();
    this._handleHourEvents();

    if (this._options.clockType !== '24h') {
      this._handleAmClick();
      this._handlePmClick();
    }

    if (this.clockFace) {
      this._handleMoveHand();
    }

    this._handleCancelButton();
    this._handleOkButton();

    if (this.modalElement) {
      this._setShowClassToBackdrop();
      this._handleBackdropClick();
    }

    this._handleIconChangeView();
    this._handleClickOnHourMobile();

    if (this._options.focusTrap) {
      this._focusTrapHandler();
    }
  };

  private _handleOpenOnClick = (): void => {
    this.openElement.forEach((openEl) =>
      this._clickTouchEvents.forEach((el: string) =>
        openEl?.addEventListener(el, () => this._eventsBundle()),
      ),
    );
  };

  private _getInputValueOnOpenAndSet = (): void => {
    const value = getInputValue(
      this.input as unknown as HTMLInputElement,
      this._options.clockType,
      this._options.currentTime,
    );

    if (value === undefined) {
      this.hour.value = '12';
      this.minutes.value = '00';

      createNewEvent(this._element, 'show', {
        hour: this.hour.value,
        minutes: this.minutes.value,
        type: this.activeTypeMode?.dataset.type,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      if (this._options.clockType !== '24h') {
        this.AM.classList.add(selectorActive);
      }

      return;
    }

    let [hour, minutes, type] = this.input.value.split(':').join(' ').split(' ');

    if (this.input.value.length === 0) {
      hour = value.hour as string;
      minutes = value.minutes as string;
      type = value.type as string;
    }

    this.hour.value = hour;
    this.minutes.value = minutes;

    const typeMode = document.querySelector(`[data-type='${type}']`) as HTMLElement;

    if (this._options.clockType !== '24h' && typeMode) {
      typeMode.classList.add(selectorActive);
    }

    createNewEvent(this._element, 'show', {
      ...value,
      type: this.activeTypeMode?.dataset.type,
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
    });
  };

  private _handleCancelButton = (): void => {
    this._clickTouchEvents.forEach((el: string) => {
      this.cancelButton.addEventListener(el, () => {
        const value = getInputValue(this.input as unknown as HTMLInputElement, this._options.clockType);

        createNewEvent(this._element, 'cancel', {
          ...value,
          hourNotAccepted: this.hour.value,
          minutesNotAccepted: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        this.close();
      });
    });
  };

  private _handleOkButton = (): void => {
    this._clickTouchEvents.forEach((el: string) => {
      this.okButton?.addEventListener(el, () => {
        const { clockType, disabledTime } = this._options;

        const validHours = handleValueAndCheck(this.hour.value, 'hour', clockType);
        const validMinutes = handleValueAndCheck(this.minutes.value, 'minutes', clockType);
        let checkDisable: undefined | boolean;
        const validHoursDisabled = checkDisabledHoursAndMinutes(
          this.hour.value as string,
          'hour',
          clockType,
          disabledTime?.hours,
        );

        const validMinutesDisabled = checkDisabledHoursAndMinutes(
          this.minutes.value as string,
          'minutes',
          clockType,
          disabledTime?.minutes,
        );

        if (disabledTime?.interval) {
          checkDisable = checkedDisabledValuesInterval(
            this.hour.value,
            this.minutes.value,
            this.activeTypeMode?.textContent,
            disabledTime.interval,
          );
        }

        if (
          checkDisable === false ||
          validHours === false ||
          validMinutes === false ||
          validHoursDisabled === false ||
          validMinutesDisabled === false
        ) {
          if (checkDisable === false || !validMinutes || !validMinutesDisabled) {
            this.minutes.classList.add('invalid-value');
          }

          if (checkDisable === false || !validHours || !validHoursDisabled) {
            this.hour.classList.add('invalid-value');
          }

          return;
        }

        this.input.value = `${this.hour.value}:${this.minutes.value} ${
          this._options.clockType === '24h' ? '' : this.activeTypeMode?.dataset.type
        }`.trimEnd();

        createNewEvent(this._element, 'accept', {
          hour: this.hour.value,
          minutes: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        this.close();
      });
    });
  };

  private _setShowClassToBackdrop = (): void => {
    if (this._options.backdrop) {
      setTimeout(() => {
        this.modalElement.classList.add('show');
      }, 300);
    }
  };

  private _handleBackdropClick = (): void => {
    this.modalElement?.addEventListener('click', (ev) => {
      const target = ev.target as Element as HTMLElement;

      if (!hasClass(target, 'timepicker-ui-modal')) return;

      const value = getInputValue(this.input as unknown as HTMLInputElement, this._options.clockType);

      createNewEvent(this._element, 'cancel', {
        ...value,
        hourNotAccepted: this.hour.value,
        minutesNotAccepted: this.minutes.value,
        type: this.activeTypeMode?.dataset.type,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      this.close();
    });
  };

  private _setBgColorToCirleWithHourTips = (): void => {
    if (!this._options) return;

    const { mobile, theme } = this._options;

    if (mobile || this.circle === null) return;

    if (theme === 'crane-straight' || theme === 'crane-radius') {
      this.circle.style.backgroundColor = variables.cranered400;
    } else {
      this.circle.style.backgroundColor = variables.purple;
    }
  };

  private _setBgColorToCircleWithMinutesTips = (): void => {
    const { theme } = this._options;

    if (this.minutes.value && getNumberOfMinutes.includes(this.minutes.value)) {
      if (theme === 'crane-straight' || theme === 'crane-radius') {
        this.circle.style.backgroundColor = variables.cranered400;
      } else {
        this.circle.style.backgroundColor = variables.purple;
      }
      this.circle.classList.remove('small-circle');
    }
  };

  private _removeBgColorToCirleWithMinutesTips = (): void => {
    if (this.minutes.value && getNumberOfMinutes.includes(this.minutes.value)) return;

    this.circle.style.backgroundColor = '';
    this.circle.classList.add('small-circle');
  };

  private _setTimepickerClassToElement = (): void => {
    this._element?.classList.add(name);
  };

  private _setClassActiveToHourOnOpen = (): void => {
    if (this._options.mobile || this._isMobileView) return;

    this.hour?.classList.add(selectorActive);
  };

  private _setMinutesToClock = (value: string | null): void => {
    if (this.clockFace !== null) this._setTransformToCircleWithSwitchesMinutes(value);
    this._removeBgColorToCirleWithMinutesTips();

    const getDisabledMinutes = this._disabledTime?.value?.minutes
      ? this._disabledTime?.value?.minutes
      : this._disabledTime?.value;

    const initClockFace = new ClockFace({
      array: getNumberOfMinutes,
      classToAdd: 'timepicker-ui-minutes-time',
      clockFace: this.clockFace,
      tipsWrapper: this.tipsWrapper,
      theme: this._options.theme,
      disabledTime: getDisabledMinutes,
      hour: this.hour.value,
      clockType: this._options.clockType,
    });

    initClockFace.create();

    if (this._options.clockType === '12h') {
      initClockFace.updateDisable();
    }

    this._toggleClassActiveToValueTips(value);

    if (this._options.clockType === '24h') {
      this.tipsWrapperFor24h.innerHTML = '';
    }
  };

  private _setHoursToClock = (value: string | null): void => {
    if (this.clockFace !== null) {
      this._setTransformToCircleWithSwitchesHour(value);
      this._setBgColorToCirleWithHourTips();

      const disabledTime = this._disabledTime?.value?.isInterval
        ? this._disabledTime?.value.rangeArrHour
        : this._disabledTime?.value?.hours;

      const init12h = new ClockFace({
        array: getNumberOfHours12,
        classToAdd: 'timepicker-ui-hour-time-12',
        clockFace: this.clockFace,
        tipsWrapper: this.tipsWrapper,
        theme: this._options.theme,
        disabledTime,
        clockType: '12h',
        hour: this.hour.value,
      });

      init12h.create();

      if (this._options.clockType === '24h') {
        new ClockFace({
          array: getNumberOfHours24,
          classToAdd: 'timepicker-ui-hour-time-24',
          clockFace: this.tipsWrapperFor24h,
          tipsWrapper: this.tipsWrapperFor24h,
          theme: this._options.theme,
          clockType: '24h',
          disabledTime,
          hour: this.hour.value,
        }).create();
      } else {
        init12h.updateDisable();
      }

      this._toggleClassActiveToValueTips(value);
    }
  };

  private _setTransformToCircleWithSwitchesHour = (val: string | null): void => {
    const value = Number(val);

    let degrees = value > 12 ? value * 30 - 360 : value * 30;

    if (degrees === 360) {
      degrees = 0;
    }

    if (degrees > 360) return;

    this.clockHand.style.transform = `rotateZ(${degrees}deg)`;
  };

  private _setTransformToCircleWithSwitchesMinutes = (val: string | null): void => {
    const degrees = Number(val) * 6;

    if (degrees > 360) return;

    this.clockHand.style.transform = `rotateZ(${degrees}deg)`;
  };

  private _getDestructuringObj(isAmPm?: boolean) {
    const {
      endMinutes,
      removedEndHour,
      removedStartedHour,
      startMinutes,
      pmHours,
      amHours,
      removedAmHour,
      removedPmHour,
    } = this._disabledTime.value;

    if (isAmPm) {
      return {
        minutesToUpdate: {
          actualHour: this.hour.value,
          pmHours,
          amHours,
          activeMode: this.activeTypeMode?.textContent,
          startMinutes,
          endMinutes,
          removedAmHour,
          removedPmHour,
        },
      };
    }

    return {
      minutesToUpdate: {
        endMinutes,
        removedEndHour,
        removedStartedHour,
        actualHour: this.hour.value,
        startMinutes,
      },
    };
  }

  private _handleAmClick = (): void => {
    this._clickTouchEvents.forEach((e: string) => {
      this.AM.addEventListener(e, (ev) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.PM.classList.remove(selectorActive);

        if (this._options.clockType === '12h' && this._options.disabledTime?.interval) {
          const initClockFace = new ClockFace({
            clockFace: this.clockFace,
            tipsWrapper: this.tipsWrapper,
            array: hasClass(this.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
            setTimeout(() => {
              if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
                initClockFace.updateDisable({
                  hoursToUpdate: this._disabledTime?.value?.rangeArrHour,
                  ...this._getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this._getDestructuringObj(true),
              });
            }, 300);
          }

          initClockFace.updateDisable();
        }

        createNewEvent(this._element, 'selectamtypemode', {
          hour: this.hour.value,
          minutes: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
      });
    });
  };

  private _handlePmClick = (): void => {
    this._clickTouchEvents.forEach((el: string) => {
      this.PM.addEventListener(el, (ev) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.AM.classList.remove(selectorActive);

        if (this._options.clockType === '12h' && this._options.disabledTime?.interval) {
          const initClockFace = new ClockFace({
            clockFace: this.clockFace,
            tipsWrapper: this.tipsWrapper,
            array: hasClass(this.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
            setTimeout(() => {
              if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
                initClockFace.updateDisable({
                  hoursToUpdate: this._disabledTime?.value?.rangeArrHour,
                  ...this._getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this._getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createNewEvent(this._element, 'selectpmtypemode', {
          hour: this.hour.value,
          minutes: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
      });
    });
  };

  private _handleAnimationClock = (): void => {
    if (this._options.animation) {
      setTimeout(() => {
        this.clockFace?.classList.add('timepicker-ui-clock-animation');

        setTimeout(() => {
          this.clockFace?.classList.remove('timepicker-ui-clock-animation');
        }, 600);
      }, 150);
    }
  };

  private _handleAnimationSwitchTipsMode = (): void => {
    this.clockHand.classList.add('timepicker-ui-tips-animation');
    setTimeout(() => {
      this.clockHand?.classList.remove('timepicker-ui-tips-animation');
    }, 401);
  };

  private _handleClasses24h = (ev: any, element?: HTMLInputElement) => {
    const target = ev.target as HTMLInputElement;

    if (this.hourTips) {
      if (this._options.clockType === '24h') {
        if (Number(target.textContent) > 12 || Number(target.textContent) === 0) {
          this._setCircleClockClasses24h();
        } else {
          this._removeCircleClockClasses24h();
        }

        if (!this._options.mobile) {
          this.tipsWrapperFor24h?.classList.remove('timepicker-ui-tips-wrapper-24h-disabled');
        }
      }
    }

    if (!target || !element) return;

    element.value = (target.value as string).replace(/\D+/g, '');
    element.click();
  };

  private _handleHourEvents = (): void => {
    this._inputEvents.forEach((el) => {
      this.hour?.addEventListener(el, (ev) => {
        const target = ev.target as HTMLInputElement;

        if (this.clockFace !== null) this._handleAnimationSwitchTipsMode();

        if (this._options.clockType === '24h') {
          if (Number(target.value) > 12 || Number(target.value) === 0) {
            this._setCircleClockClasses24h();
          } else {
            this._removeCircleClockClasses24h();
          }

          if (!this._options.mobile) {
            this.tipsWrapperFor24h?.classList.remove('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        this._setHoursToClock(target.value);
        target.classList.add(selectorActive);
        this.minutes.classList.remove(selectorActive);

        if (this._options.clockType === '12h' && this._options.disabledTime?.interval) {
          const initClockFace = new ClockFace({
            clockFace: this.clockFace,
            tipsWrapper: this.tipsWrapper,
            array: hasClass(this.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
            setTimeout(() => {
              if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
                initClockFace.updateDisable({
                  hoursToUpdate: this._disabledTime?.value?.rangeArrHour,
                  ...this._getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this._getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createNewEvent(this._element, 'selecthourmode', {
          hour: this.hour.value,
          minutes: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        if (this.clockFace !== null) this.circle.classList.remove('small-circle');
      });
    });

    this.hour?.addEventListener('blur', (e) => this._handleClasses24h(e, this.hour));
    this.hour?.addEventListener('focus', (e) => this._handleClasses24h(e, this.hour));
  };

  private _handleMinutesEvents = (): void => {
    this._inputEvents.forEach((el) => {
      this.minutes.addEventListener(el, (ev) => {
        const target = ev.target as HTMLInputElement;

        if (this.clockFace !== null) {
          this._handleAnimationSwitchTipsMode();
          this._setMinutesToClock(target.value);
        }

        if (this._options.clockType === '24h') {
          this._removeCircleClockClasses24h();

          if (!this._options.mobile) {
            this.tipsWrapperFor24h?.classList.add('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        target.classList.add(selectorActive);
        this.hour?.classList.remove(selectorActive);

        if (this._options.clockType === '12h' && this._options.disabledTime?.interval) {
          const initClockFace = new ClockFace({
            clockFace: this.clockFace,
            tipsWrapper: this.tipsWrapper,
            array: hasClass(this.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
            setTimeout(() => {
              if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
                initClockFace.updateDisable({
                  hoursToUpdate: this._disabledTime?.value.rangeArrHour,
                  ...this._getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this._getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createNewEvent(this._element, 'selectminutemode', {
          hour: this.hour.value,
          minutes: this.minutes.value,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
      });
    });

    this.minutes?.addEventListener('blur', (e) => this._handleClasses24h(e, this.minutes));
    this.minutes?.addEventListener('focus', (e) => this._handleClasses24h(e, this.minutes));
  };

  private _handleEventToMoveHand = (event: TouchEvent): void => {
    const { target: t, type, touches } = event;
    const target = t as Element;

    const { incrementMinutes, incrementHours, switchToMinutesAfterSelectHour } = this._options;

    if (!getClickTouchPosition(event, this.clockFace)) return;

    const obj = getClickTouchPosition(event, this.clockFace);

    const clockFaceRadius = this.clockFace.offsetWidth / 2;

    let rtangens = obj && Math.atan2(obj.y - clockFaceRadius, obj.x - clockFaceRadius);

    if (getBrowser()) {
      const touched = getClickTouchPosition(event, this.clockFace, true);
      if (!touched) return;

      rtangens = Math.atan2(touched.y - clockFaceRadius, touched.x - clockFaceRadius);
    }

    if (type === 'mouseup' || type === 'touchend') {
      this._isTouchMouseMove = false;

      if (
        switchToMinutesAfterSelectHour &&
        (hasClass(target, 'timepicker-ui-value-tips') ||
          hasClass(target, 'timepicker-ui-value-tips-24h') ||
          hasClass(target, 'timepicker-ui-tips-wrapper'))
      ) {
        this.minutes.click();
      }

      return;
    }

    if (type === 'mousedown' || type === 'mousemove' || type === 'touchmove' || type === 'touchstart') {
      if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
        if (
          (hasClass(target, 'timepicker-ui-clock-face') ||
            hasClass(target, 'timepicker-ui-circle-hand') ||
            hasClass(target, 'timepicker-ui-hour-time-12') ||
            hasClass(target, 'timepicker-ui-minutes-time') ||
            hasClass(target, 'timepicker-ui-clock-hand') ||
            hasClass(target, 'timepicker-ui-value-tips') ||
            hasClass(target, 'timepicker-ui-value-tips-24h') ||
            hasClass(target, 'timepicker-ui-tips-wrapper') ||
            hasClass(target, 'timepicker-ui-tips-wrapper-24h')) &&
          !hasClass(target, 'timepicker-ui-tips-disabled')
        ) {
          event.preventDefault();
          this._isTouchMouseMove = true;
        } else {
          this._isTouchMouseMove = false;
        }
      }
    }

    if (!this._isTouchMouseMove) return;

    if (this.minutesTips !== null) {
      this.minutes.classList.add(selectorActive);
      let deg =
        rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementMinutes, 6);

      if (deg === undefined) return;

      let minute: number;

      if (deg < 0) {
        minute = Math.round(360 + deg / 6) % 60;
        deg = 360 + Math.round(deg / 6) * 6;
      } else {
        minute = Math.round(deg / 6) % 60;
        deg = Math.round(deg / 6) * 6;
      }

      if (!this._disabledTime?.value.isInterval) {
        if (this._disabledTime?.value?.minutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`)) {
          return;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this._disabledTime?.value.endType === this._disabledTime?.value.startType) {
          if (
            this._disabledTime?.value?.endMinutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`) &&
            this.hour.value === this._disabledTime?.value?.removedEndHour &&
            this._disabledTime?.value.endType === this.activeTypeMode?.textContent
          ) {
            return;
          }

          if (
            this._disabledTime?.value?.startMinutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`) &&
            this.hour.value === this._disabledTime?.value?.removedStartedHour &&
            this._disabledTime?.value.startType === this.activeTypeMode?.textContent
          ) {
            return;
          }
        } else {
          if (this.activeTypeMode?.textContent === this._disabledTime?.value.endType) {
            if (
              (this._disabledTime?.value?.endMinutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`) &&
                this._disabledTime?.value.removedPmHour === this.hour.value) ||
              this._disabledTime?.value.pmHours.map(Number).includes(Number(this.hour.value))
            ) {
              return;
            }
          }
          if (this.activeTypeMode?.textContent === this._disabledTime?.value.startType) {
            if (
              (this._disabledTime?.value?.startMinutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`) &&
                this._disabledTime?.value.removedAmHour === this.hour.value) ||
              this._disabledTime?.value.amHours.map(Number).includes(Number(this.hour.value))
            ) {
              return;
            }
          }
        }
      }

      this.minutes.value = minute >= 10 ? `${minute}` : `0${minute}`;
      this.clockHand.style.transform = `rotateZ(${deg}deg)`;

      this._degreesMinutes = deg;

      this._toggleClassActiveToValueTips(this.minutes.value);
      this._removeBgColorToCirleWithMinutesTips();
      this._setBgColorToCircleWithMinutesTips();

      createNewEvent(this._element, 'update', {
        ...getInputValue(this.input as unknown as HTMLInputElement, this._options.clockType),
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
        eventType: type,
        type: this.activeTypeMode?.dataset.type,
      });
    }

    const myLocation = touches ? touches[0] : undefined;
    const realTarget =
      touches && myLocation
        ? (document.elementFromPoint(myLocation.clientX, myLocation.clientY) as HTMLDivElement)
        : null;

    if (this.hourTips !== null) {
      this.hour?.classList.add(selectorActive);
      if (
        !hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') &&
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled') &&
        (hasClass(realTarget || target, 'timepicker-ui-value-tips') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper'))
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this._degreesHours = deg as number;

        if (deg === undefined) return;

        let hour: number;

        if (deg < 0) {
          hour = Math.round(360 + deg / 30) % 12;
          deg = 360 + deg;
        } else {
          hour = Math.round(deg / 30) % 12;
          if (hour === 0 || hour > 12) hour = 12;
        }

        const isInterval = this._disabledTime?.value.isInterval ? 'rangeArrHour' : 'hours';

        if (this._disabledTime?.value.endType === this._disabledTime?.value?.startType) {
          if (typeof this._disabledTime?.value?.endType === 'string') {
            if (
              this._disabledTime?.value?.endType === this.activeTypeMode?.textContent &&
              this._disabledTime?.value?.startType === this.activeTypeMode?.textContent
            ) {
              if (this._disabledTime?.value[isInterval]?.includes(hour.toString())) {
                return;
              }
            }
          } else if (this._disabledTime?.value[isInterval]?.includes(hour.toString())) {
            return;
          }
        } else {
          if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
            if (this._disabledTime?.value.amHours.includes(hour.toString())) {
              return;
            }
          }

          if (this._disabledTime?.value.endType === this.activeTypeMode?.textContent) {
            if (this._disabledTime?.value.pmHours.includes(hour.toString())) {
              return;
            }
          }
        }

        this.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.hour.value = hour > 9 ? `${hour}` : `0${hour}`;

        this._removeCircleClockClasses24h();
        this._toggleClassActiveToValueTips(hour);
      }

      if (
        (hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper-24h')) &&
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled')
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this._degreesHours = deg as number;

        let hour: number | string;

        if (deg === undefined) return;

        if (deg < 0) {
          hour = Math.round(360 + deg / 30) % 24;
          deg = 360 + deg;
        } else {
          hour = Math.round(deg / 30) + 12;

          if (hour === 12) {
            hour = '00';
          }
        }

        const isInterval = this._disabledTime?.value.isInterval ? 'rangeArrHour' : 'hours';

        if (this._disabledTime?.value[isInterval]?.includes(hour.toString())) {
          return;
        }

        this._setCircleClockClasses24h();

        this.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.hour.value = `${hour}`;

        this._toggleClassActiveToValueTips(hour);
      }

      createNewEvent(this._element, 'update', {
        ...getInputValue(this.input as unknown as HTMLInputElement, this._options.clockType),
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
        eventType: type,
        type: this.activeTypeMode?.dataset.type,
      });
    }
  };

  private _toggleClassActiveToValueTips = (value: string | number | null): void => {
    const element = this.allValueTips.find((tip: HTMLElement) => Number(tip.innerText) === Number(value));

    this.allValueTips.map((el) => el.classList.remove(selectorActive));

    if (element === undefined) return;

    element.classList.add(selectorActive);
  };

  private _handleMoveHand = (): void => {
    if (this._options.mobile || this._isMobileView) return;

    allEvents.split(' ').forEach((event) => {
      if (event === 'touchstart' || event === 'touchmove' || event === 'touchend') {
        document.addEventListener(event, this._mutliEventsMoveHandler, {
          passive: false,
        });
      } else {
        document.addEventListener(event, this._mutliEventsMoveHandler, false);
      }
    });
  };

  private _setModalTemplate = (): void => {
    if (!this._options) return;

    const { appendModalSelector } = this._options;

    if (appendModalSelector === '' || !appendModalSelector) {
      document.body.insertAdjacentHTML('afterend', this.modalTemplate);
    } else {
      const element = document?.querySelector(appendModalSelector);
      element?.insertAdjacentHTML('beforeend', this.modalTemplate);
    }
  };

  private _setScrollbarOrNot = (): void => {
    if (!this._options.enableScrollbar) {
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      document.body.style.overflowY = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
      }, 400);
    }
  };

  private _setAnimationToOpen = (): void => {
    this.modalElement?.classList.add('opacity');

    if (this._options.animation) {
      setTimeout(() => {
        this.modalElement?.classList.add('show');
      }, 150);
    } else {
      this.modalElement?.classList.add('show');
    }
  };

  private _removeAnimationToClose = (): void => {
    if (this.modalElement) {
      if (this._options.animation) {
        setTimeout(() => {
          this.modalElement?.classList.remove('show');
        }, 150);
      } else {
        this.modalElement?.classList.remove('show');
      }
    }
  };

  private _handlerViewChange = debounce(() => {
    const { clockType } = this._options;

    if (!hasClass(this.modalElement, 'mobile')) {
      this.close();

      this._isMobileView = true;
      this._options.mobile = true;

      const beforeHourContent = this.hour.value;
      const beforeMinutesContent = this.minutes.value;
      const beforeTypeModeContent = this.activeTypeMode?.dataset.type;

      setTimeout(() => {
        this.destroy();
        this.update({
          options: { mobile: true },
        });
        setTimeout(() => {
          this.open();

          this.hour.value = beforeHourContent;
          this.minutes.value = beforeMinutesContent;

          if (beforeTypeModeContent) {
            const afterTypeModeContent = this.activeTypeMode?.dataset.type;

            // @ts-ignore
            this[beforeTypeModeContent as string].classList.add(selectorActive);
            // @ts-ignore
            this[afterTypeModeContent].classList.remove(selectorActive);
          }
        }, 300);
      }, 300);
    } else {
      const validHours = handleValueAndCheck(this.hour.value, 'hour', clockType);
      const validMinutes = handleValueAndCheck(this.minutes.value, 'minutes', clockType);

      if (validHours === false || validMinutes === false) {
        if (!validMinutes) {
          this.minutes.classList.add('invalid-value');
        }

        if (!validHours) {
          this.hour?.classList.add('invalid-value');
        }

        return;
      }

      if (validHours === true && validMinutes === true) {
        if (validMinutes) {
          this.minutes.classList.remove('invalid-value');
        }

        if (validHours) {
          this.hour?.classList.remove('invalid-value');
        }
      }

      this.close();

      this._isMobileView = false;
      this._options.mobile = false;

      const beforeHourContent = this.hour.value;
      const beforeMinutesContent = this.minutes.value;
      const beforeTypeModeContent = this.activeTypeMode?.dataset.type;

      setTimeout(() => {
        this.destroy();
        this.update({
          options: { mobile: false },
        });
        setTimeout(() => {
          this.open();

          this.hour.value = beforeHourContent;
          this.minutes.value = beforeMinutesContent;

          if (beforeTypeModeContent) {
            const afterTypeModeContent = this.activeTypeMode?.dataset.type;

            // @ts-ignore
            this[beforeTypeModeContent].classList.add(selectorActive);
            // @ts-ignore
            this[afterTypeModeContent].classList.remove(selectorActive);
          }
        }, 300);
      }, 300);
    }
  }, 400);

  private _handleIconChangeView = async (): Promise<void> => {
    if (this._options.enableSwitchIcon) {
      if (getBrowser()) {
        this.keyboardClockIcon.addEventListener('touchstart', this._handlerViewChange);
      } else {
        this.keyboardClockIcon.addEventListener('click', this._handlerViewChange);
      }
    }
  };

  private _handlerClickHourMinutes = async (event: Event): Promise<void> => {
    if (!this.modalElement) return;
    const { clockType, editable } = this._options;

    const target = event.target as HTMLDivElement;
    const validHours = handleValueAndCheck(this.hour.value, 'hour', clockType);
    const validMinutes = handleValueAndCheck(this.minutes.value, 'minutes', clockType);

    if (!editable) return;

    if (!hasClass(target, 'timepicker-ui-hour') && !hasClass(target, 'timepicker-ui-minutes')) {
      if (validHours === true && validMinutes === true) {
        if (validMinutes) this.minutes.classList.remove('invalid-value');
        if (validHours) this.hour?.classList.remove('invalid-value');
      }
    } else if (validHours === false || validMinutes === false) {
      if (!validMinutes) this.minutes.classList.add('invalid-value');
      if (!validHours) this.hour?.classList.add('invalid-value');
    }
  };

  private _handleClickOnHourMobile = (): void => {
    document.addEventListener('mousedown', this._eventsClickMobileHandler);
    document.addEventListener('touchstart', this._eventsClickMobileHandler);
  };

  private _handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.modalElement) {
      this.close();
    }
  };

  private _handleEscClick = (): void => {
    document.addEventListener('keydown', this._handleKeyPress);
  };

  private _focusTrapHandler = (): void => {
    setTimeout(() => {
      const focusableEls = this.wrapper?.querySelectorAll('div[tabindex="0"]:not([disabled])');
      const focusableInputs = this.wrapper?.querySelectorAll('input[tabindex="0"]:not([disabled])');

      if (!focusableEls || focusableEls.length <= 0 || focusableInputs.length <= 0) return;

      const allFcousablElements = [...focusableInputs, ...focusableEls];
      const firstFocusableEl = allFcousablElements[0] as HTMLDivElement;
      const lastFocusableEl = allFcousablElements[allFcousablElements.length - 1] as HTMLDivElement;

      this.wrapper.focus();

      this.wrapper.addEventListener('keydown', ({ key, shiftKey, target: t }) => {
        const target = t as HTMLDivElement;

        if (key === 'Tab') {
          if (shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
            }
          } else if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
          }
        }

        if (key === 'Enter') {
          if (hasClass(target, 'timepicker-ui-minutes')) {
            this.minutes.click();
          }

          if (hasClass(target, 'timepicker-ui-hour')) {
            this.hour.click();
          }

          if (hasClass(target, 'timepicker-ui-cancel-btn')) {
            this.cancelButton.click();
          }

          if (hasClass(target, 'timepicker-ui-ok-btn')) {
            this.okButton.click();
          }

          if (hasClass(target, 'timepicker-ui-keyboard-icon-wrapper')) {
            this.keyboardClockIcon.click();
          }

          if (hasClass(target, 'timepicker-ui-am')) {
            this.AM.click();
          }

          if (hasClass(target, 'timepicker-ui-pm')) {
            this.PM.click();
          }

          if (
            hasClass(target, 'timepicker-ui-value-tips') ||
            hasClass(target, 'timepicker-ui-value-tips-24h')
          ) {
            const { left, top, x, y, width, height } = target.getBoundingClientRect();
            const tabIndexElement = document.elementFromPoint(x, y);

            // eslint-disable-next-line no-inner-declarations
            const simulateMousedownEvent = () => {
              const ev = new MouseEvent('mousedown', {
                clientX: left + width / 2,
                clientY: top + height / 2,
                cancelable: true,
                bubbles: true,
              });

              if (hasClass(tabIndexElement, 'timepicker-ui-value-tips-24h')) {
                tabIndexElement?.dispatchEvent(ev);
              } else {
                tabIndexElement?.childNodes[0]?.dispatchEvent(ev);
              }

              this._isTouchMouseMove = false;
            };

            simulateMousedownEvent();
          }
        }

        setTimeout(() => {
          this.wrapper.addEventListener('mousedown', () => (document.activeElement as HTMLDivElement).blur());
        }, 100);
      });
    }, 301);
  };

  private _handleOpenOnEnterFocus = (): void => {
    this.input.addEventListener('keydown', ({ target, key }) => {
      if ((target as HTMLInputElement).disabled) return;

      if (key === 'Enter') {
        this.open();
      }
    });
  };
}
