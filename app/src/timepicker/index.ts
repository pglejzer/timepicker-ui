import { createObjectFromData } from './utils/index';
import './styles/main.scss';
import './styles/theme.scss';
import variables from './styles/variables.scss';
import { options as optionsDefault } from './utils/options';
import type { optionTypes } from '../timepicker/utils/types';
import { name, allEvents, selectorActive } from './utils/variables';
import {
  createNewEvent,
  getBrowser,
  getClickTouchPosition,
  getConfig,
  getIncrementTimes,
  getInputValue,
  getScrollbarWidth,
  hasClass,
} from './utils';
import {
  getMobileModalTemplate,
  getModalTemplate,
  getNumberOfHours12,
  getNumberOfMinutes,
  getNumberOfHours24,
} from './utils/templates';
import ClockFace from './components/ClockFace';

export default class TimepickerUI {
  _degreesHours: number | null;
  _degreesMinutes: number | null;
  _options: optionTypes;
  private eventsClickMobile: (event: Event) => Promise<void>;
  private eventsClickMobileHandler: any;
  private mutliEventsMove: (event: Event) => void;
  private mutliEventsMoveHandler: any;
  private _clickTouchEvents: string[];
  private _element: HTMLElement;
  private _isMobileView: boolean | null;
  private _isTouchMouseMove: boolean | null;
  isMinutesClick: boolean;

  constructor(element: HTMLDivElement, options?: optionTypes) {
    this._element = element;
    this._options = getConfig(
      { ...options, ...createObjectFromData(this._element?.dataset) },
      optionsDefault
    );
    console.log(this._element);
    this._isTouchMouseMove = false;
    this._degreesHours =
      Number(
        getInputValue(
          this._element?.querySelector('input') as HTMLInputElement,
          this._options.clockType
        ).hour
      ) * 30;
    this._degreesMinutes =
      Number(
        getInputValue(
          this._element?.querySelector('input') as HTMLInputElement,
          this._options.clockType
        ).minutes
      ) * 6;

    this._isMobileView = false;

    this.mutliEventsMove = (event) => this._handleEventToMoveHand(event as TouchEvent);
    this.mutliEventsMoveHandler = this.mutliEventsMove.bind(this);

    this.eventsClickMobile = (event) => this._handlerClickHourMinutes(event);
    this.eventsClickMobileHandler = this.eventsClickMobile.bind(this);

    if (this._options.mobile) {
      this._isMobileView = true;
      this._options.editable = true;
    }

    this._clickTouchEvents = ['click', 'touchstart'];
    this.isMinutesClick = true;
  }

  // getters

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
    return document.querySelector('.timepicker-ui-minutes') as HTMLDivElement;
  }

  private get hour() {
    return document.querySelector('.timepicker-ui-hour') as HTMLDivElement;
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
    return ([
      ...document.querySelectorAll('.timepicker-ui-value-tips'),
      ...document.querySelectorAll('.timepicker-ui-value-tips-24h'),
    ] as const) as Array<HTMLDivElement>;
  }

  private get openElementData() {
    const data: NodeListOf<HTMLElement> = this._element?.querySelectorAll('[data-open]');

    if (data?.length > 0) {
      const arr: string[] = [];

      data.forEach(({ dataset }) => arr.push(dataset.open ?? ''));
      return [...new Set(arr)];
      // eslint-disable-next-line no-else-return
    } else {
      return null;
    }
  }

  private get openElement() {
    if (this.openElementData === null) {
      this.input?.setAttribute('data-open', 'timepicker-ui-input');

      return [this.input];
    } else {
      return (
        this.openElementData.map((open) =>
          this._element?.querySelectorAll(`[data-open='${open}']`)
        )[0] ?? ''
      );
    }
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

  // public

  public create = (): void => {
    this._setTimepickerClassToElement();
    this._setInputClassToInputElement();
    this._setDataOpenToInputIfDosentExistInWrapper();
    this._setClassTopOpenElement();
    this._handleOpenOnClick();
  };

  public open = (): void => {
    this.create();
    this._eventsBundle();
  };

  public close = (): void => {
    this._isTouchMouseMove = false;

    allEvents
      .split(' ')
      .map((event) => document.removeEventListener(event, this.mutliEventsMoveHandler, false));

    document.removeEventListener('mousedown', this.eventsClickMobileHandler);
    document.removeEventListener('touchstart', this.eventsClickMobileHandler);

    if (this._options.enableSwitchIcon) {
      this.keyboardClockIcon.removeEventListener('touchstart', this.handlerViewChange);
      this.keyboardClockIcon.removeEventListener('mousedown', this.handlerViewChange);
    }

    this._removeAnimationToClose();

    this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

    setTimeout(() => {
      document.body.style.overflowY = '';
      document.body.style.paddingRight = '';
    }, 400);

    setTimeout(() => {
      this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

      if (this._options.focusInputAfterCloseModal) this.input?.focus();

      if (this.modalElement === null) return;

      this.modalElement.remove();
    }, 300);
  };

  public destroy = () => {
    allEvents
      .split(' ')
      .map((event) => document.removeEventListener(event, this.mutliEventsMoveHandler, false));

    document.removeEventListener('mousedown', this.eventsClickMobileHandler);
    document.removeEventListener('touchstart', this.eventsClickMobileHandler);

    if (this._options.enableSwitchIcon && this.keyboardClockIcon) {
      this.keyboardClockIcon.removeEventListener('touchstart', this.handlerViewChange);
      this.keyboardClockIcon.removeEventListener('mousedown', this.handlerViewChange);
    }

    //@ts-ignore
    this._element = null;
    //@ts-ignore
    this._options = null;
    this._isTouchMouseMove = null;
    this._degreesHours = null;
    this._degreesMinutes = null;
    this._isMobileView = null;
    this.mutliEventsMoveHandler = null;
    this.eventsClickMobileHandler = null;
  };

  // private

  private removeCircleClockClasses24h() {
    this.circle?.classList.remove('timepicker-ui-circle-hand-24h');
    this.clockHand?.classList.remove('timepicker-ui-clock-hand-24h');
  }

  private setCircleClockClasses24h() {
    this.circle.classList.add('timepicker-ui-circle-hand-24h');
    this.clockHand.classList.add('timepicker-ui-clock-hand-24h');
  }

  private setErrorHandler() {
    const { error, currentHour, currentMin, currentType, currentLength } = getInputValue(
      this.input,
      this._options.clockType
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

    return;
  }

  private removeErrorHandler() {
    this.input?.classList.remove('timepicker-ui-invalid-format');
    const divToRemove = this._element?.querySelector(
      '.timepicker-ui-invalid-text'
    ) as HTMLDivElement;
    if (divToRemove) {
      divToRemove.remove();
    }
  }

  private _setOnStartCSSClassesIfClockType24h() {
    if (this._options.clockType === '24h') {
      const { hour } = getInputValue(this.input, this._options.clockType);

      if (Number(hour) > 12 || Number(hour) === 0) {
        this.setCircleClockClasses24h();
      }
    }
  }

  private _setTheme = (): void => {
    const allDiv = this.modalElement.querySelectorAll('div');
    const { theme } = this._options;
    if (theme === 'crane-straight') {
      allDiv.forEach((div: HTMLDivElement) => div.classList.add('crane-straight'));
    } else if (theme === 'crane-radius') {
      allDiv.forEach((div: HTMLDivElement) => div.classList.add('crane-straight', 'radius'));
    }
  };

  private _setInputClassToInputElement = (): void => {
    if (!hasClass(this.input, 'timepicker-ui-input')) {
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

    this.modalElement.classList.add('removed');
    this.openElement.forEach((openEl) => openEl?.classList.add('disabled'));
  };

  private _setNormalizeClass = (): void => {
    const allElement = this.modalElement.querySelectorAll('div');

    this.modalElement.classList.add('timepicker-ui-normalize');
    allElement.forEach((div) => div.classList.add('timepicker-ui-normalize'));
  };

  private _setFlexEndToFooterIfNoKeyboardIcon = (): void => {
    if (!this._options.enableSwitchIcon) {
      this.footer.style.justifyContent = 'flex-end';
    }
  };

  private _eventsBundle = (): void => {
    this.setErrorHandler();
    this.removeErrorHandler();

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
        });

        initClockFace24h.create();
      }
    }

    this._setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this._setTheme();
    }, 0);

    this._setAnimationToOpen();
    this._getInputValueOnOpenAndSet();
    this._toggleClassActiveToValueTips(this.hour.textContent);

    if (!this._isMobileView) {
      this._setTransformToCircleWithSwitchesHour(this.hour.textContent);
      this._handleAnimationClock();
    }

    this._handleMinutesClick();
    this._handleHourClick();

    if (this._options.clockType !== '24h') {
      this._handleAmClick();
      this._handlePmClick();
    }

    this._handleMoveHand();
    this._handleCancelButton();
    this._handleOkButton();
    this._handleBackdropClick();

    this._handleIconChangeView();
    this._handleClickOnHourMobile();
  };

  private _handleOpenOnClick = (): void => {
    return this.openElement.forEach((openEl) =>
      this._clickTouchEvents.map((el: string) => {
        return openEl?.addEventListener(el, () => this._eventsBundle());
      })
    );
  };

  private _getInputValueOnOpenAndSet = (): void => {
    const value = getInputValue(this.input, this._options.clockType);

    if (value === undefined) {
      this.hour.innerText = '12';
      this.minutes.innerText = '00';

      createNewEvent(this._element, 'show', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.activeTypeMode?.dataset.type,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      this._options.clockType !== '24h' && this.AM.classList.add('active');

      return;
    }

    const { hour, minutes, type } = value;

    this.hour.innerText = hour as string;
    this.minutes.innerText = minutes as string;

    const typeMode = document.querySelector(`[data-type="${type}"]`) as HTMLElement;

    if (this._options.clockType !== '24h' && typeMode) {
      typeMode.classList.add('active');
    }

    createNewEvent(this._element, 'show', {
      ...value,
      type: this.activeTypeMode?.dataset.type,
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
    });
  };

  private _handleCancelButton = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.cancelButton.addEventListener(el, () => {
        const value = getInputValue(this.input, this._options.clockType);

        createNewEvent(this._element, 'cancel', {
          ...value,
          hourNotAccepted: this.hour.textContent,
          minutesNotAccepted: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        this.close();
      });
    });
  };

  private _handleOkButton = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.okButton.addEventListener(el, () => {
        const validHours = this._handleValueAndCheck(this.hour.textContent, 'hour');
        const validMinutes = this._handleValueAndCheck(this.minutes.textContent, 'minutes');

        if (validHours === false || validMinutes === false) {
          if (!validMinutes) {
            this.minutes.classList.add('invalid-value');
          }

          return;
        }

        this.input.value = `${this.hour.textContent}:${this.minutes.textContent} ${
          this._options.clockType === '24h' ? '' : this.activeTypeMode?.dataset.type
        }`.trimEnd();

        createNewEvent(this._element, 'accept', {
          hour: this.hour.textContent,
          minutes: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        this.close();
      });
    });
  };

  private _handleBackdropClick = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.modalElement.addEventListener(el, (ev) => {
        const target = (ev.target as Element) as HTMLElement;

        if (!hasClass(target, 'timepicker-ui-modal')) return;

        const value = getInputValue(this.input, this._options.clockType);

        createNewEvent(this._element, 'cancel', {
          ...value,
          hourNotAccepted: this.hour.textContent,
          minutesNotAccepted: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        this.close();
      });
    });
  };

  private _setBgColorToCirleWithHourTips = (): void => {
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

    if (this.minutes.textContent && getNumberOfMinutes.includes(this.minutes.textContent)) {
      if (theme === 'crane-straight' || theme === 'crane-radius') {
        this.circle.style.backgroundColor = variables.cranered400;
      } else {
        this.circle.style.backgroundColor = variables.purple;
      }
      this.circle.classList.remove('small-circle');
    }
  };

  private _removeBgColorToCirleWithMinutesTips = (): void => {
    if (this.minutes.textContent && getNumberOfMinutes.includes(this.minutes.textContent)) return;

    this.circle.style.backgroundColor = '';
    this.circle.classList.add('small-circle');
  };

  private _setTimepickerClassToElement = (): void => {
    this._element?.classList.add(name);
  };

  private _setClassActiveToHourOnOpen = (): void => {
    if (this._options.mobile || this._isMobileView) return;

    this.hour.classList.add(selectorActive);
  };

  private _setMinutesToClock = (value: string | null): void => {
    if (this.clockFace !== null) this._setTransformToCircleWithSwitchesMinutes(value);
    this._removeBgColorToCirleWithMinutesTips();

    new ClockFace({
      array: getNumberOfMinutes,
      classToAdd: 'timepicker-ui-minutes-time',
      clockFace: this.clockFace,
      tipsWrapper: this.tipsWrapper,
      theme: this._options.theme,
    }).create();

    this._toggleClassActiveToValueTips(value);

    if (this._options.clockType === '24h') {
      this.tipsWrapperFor24h.innerHTML = '';
    }
  };

  private _setHoursToClock = (value: string | null): void => {
    if (this.clockFace !== null) {
      this._setTransformToCircleWithSwitchesHour(value);
      this._setBgColorToCirleWithHourTips();

      new ClockFace({
        array: getNumberOfHours12,
        classToAdd: 'timepicker-ui-hour-time-12',
        clockFace: this.clockFace,
        tipsWrapper: this.tipsWrapper,
        theme: this._options.theme,
      }).create();

      if (this._options.clockType === '24h') {
        new ClockFace({
          array: getNumberOfHours24,
          classToAdd: 'timepicker-ui-hour-time-24',
          clockFace: this.tipsWrapperFor24h,
          tipsWrapper: this.tipsWrapperFor24h,
          theme: this._options.theme,
          clockType: '24h',
        }).create();
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

  private _handleAmClick = (): void => {
    this._clickTouchEvents.map((e: string) => {
      this.AM.addEventListener(e, (ev) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.PM.classList.remove(selectorActive);

        createNewEvent(this._element, 'selectamtypemode', {
          hour: this.hour.textContent,
          minutes: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
      });
    });
  };

  private _handlePmClick = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.PM.addEventListener(el, (ev) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.AM.classList.remove(selectorActive);

        createNewEvent(this._element, 'selectpmtypemode', {
          hour: this.hour.textContent,
          minutes: this.minutes.textContent,
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
        this.clockFace.classList.add('timepicker-ui-clock-animation');

        setTimeout(() => {
          this.clockFace.classList.remove('timepicker-ui-clock-animation');
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

  private _handleHourClick = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.hour.addEventListener(el, (ev) => {
        const target = ev.target as Element;

        if (this.clockFace !== null) this._handleAnimationSwitchTipsMode();

        if (this._options.clockType === '24h') {
          if (Number(target.textContent) > 12 || target.textContent === '00') {
            this.setCircleClockClasses24h();
          }

          if (!this._options.mobile) {
            this.tipsWrapperFor24h?.classList.remove('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        this._setHoursToClock(target.textContent);
        target.classList.add(selectorActive);
        this.minutes.classList.remove(selectorActive);

        createNewEvent(this._element, 'selecthourmode', {
          hour: this.hour.textContent,
          minutes: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });

        if (this.clockFace !== null) this.circle.classList.remove('small-circle');
      });
    });
  };

  private _handleMinutesClick = (): void => {
    this._clickTouchEvents.map((el: string) => {
      this.minutes.addEventListener(el, (ev) => {
        const target = ev.target as Element;

        if (this.clockFace !== null) {
          this._handleAnimationSwitchTipsMode();
          this._setMinutesToClock(target.textContent);
        }

        if (this._options.clockType === '24h') {
          this.removeCircleClockClasses24h();

          if (!this._options.mobile) {
            this.tipsWrapperFor24h?.classList.add('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        target.classList.add(selectorActive);
        this.hour.classList.remove(selectorActive);

        createNewEvent(this._element, 'selectminutemode', {
          hour: this.hour.textContent,
          minutes: this.minutes.textContent,
          type: this.activeTypeMode?.dataset.type,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
      });
    });
  };

  private _handleEventToMoveHand = (event: TouchEvent): void => {
    if (this._options.preventDefault) {
      event.preventDefault();
    }

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

    if (
      type === 'mousedown' ||
      type === 'mousemove' ||
      type === 'touchmove' ||
      type === 'touchstart'
    ) {
      if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
        if (
          hasClass(target, 'timepicker-ui-clock-face') ||
          hasClass(target, 'timepicker-ui-circle-hand') ||
          hasClass(target, 'timepicker-ui-hour-time-12') ||
          hasClass(target, 'timepicker-ui-minutes-time') ||
          hasClass(target, 'timepicker-ui-clock-hand') ||
          hasClass(target, 'timepicker-ui-value-tips') ||
          hasClass(target, 'timepicker-ui-value-tips-24h') ||
          hasClass(target, 'timepicker-ui-tips-wrapper') ||
          hasClass(target, 'timepicker-ui-tips-wrapper-24h')
        ) {
          this._isTouchMouseMove = true;
        } else {
          this._isTouchMouseMove = false;
        }
      }
    }

    if (!this._isTouchMouseMove) return;

    if (this.minutesTips !== null) {
      this.minutes.classList.add('active');
      let deg =
        rtangens &&
        getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementMinutes, 6);

      if (deg === undefined) return;

      let minute: number;
      if (deg < 0) {
        minute = Math.round(360 + deg / 6) % 60;
        deg = 360 + Math.round(deg / 6) * 6;
      } else {
        minute = Math.round(deg / 6) % 60;
        deg = Math.round(deg / 6) * 6;
      }

      this.minutes.innerText = minute >= 10 ? `${minute}` : `0${minute}`;
      this.clockHand.style.transform = `rotateZ(${deg}deg)`;

      this._degreesMinutes = deg;

      this._toggleClassActiveToValueTips(this.minutes.textContent);
      this._removeBgColorToCirleWithMinutesTips();
      this._setBgColorToCircleWithMinutesTips();

      createNewEvent(this._element, 'update', {
        ...getInputValue(this.input, this._options.clockType),
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
      this.hour.classList.add('active');

      if (
        !hasClass(realTarget ? realTarget : target, 'timepicker-ui-value-tips-24h') ||
        hasClass(realTarget ? realTarget : target, 'timepicker-ui-value-tips') ||
        hasClass(realTarget ? realTarget : target, 'timepicker-ui-tips-wrapper')
      ) {
        this.removeCircleClockClasses24h();
        let deg =
          rtangens &&
          getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this.clockHand.style.transform = `rotateZ(${deg}deg)`;
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

        this.hour.innerText = hour > 9 ? `${hour}` : `0${hour}`;

        this._toggleClassActiveToValueTips(hour);
      }

      if (
        hasClass(realTarget ? realTarget : target, 'timepicker-ui-value-tips-24h') ||
        hasClass(realTarget ? realTarget : target, 'timepicker-ui-tips-wrapper-24h')
      ) {
        this.setCircleClockClasses24h();
        let deg =
          rtangens &&
          getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this.clockHand.style.transform = `rotateZ(${deg}deg)`;
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

        this.hour.innerText = `${hour}`;

        this._toggleClassActiveToValueTips(hour);
      }

      createNewEvent(this._element, 'update', {
        ...getInputValue(this.input, this._options.clockType),
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
        eventType: type,
        type: this.activeTypeMode?.dataset.type,
      });
    }
  };

  private _toggleClassActiveToValueTips = (value: string | number | null): void => {
    const element = this.allValueTips.find(
      (tip: HTMLElement) => Number(tip.innerText) === Number(value)
    );

    this.allValueTips.map((el) => el.classList.remove('active'));

    if (element === undefined) return;

    element.classList.add('active');
  };

  private _handleMoveHand = (): void => {
    if (this._options.mobile || this._isMobileView) return;

    allEvents.split(' ').map((event) => {
      if (event === 'touchstart' || event === 'touchmove' || event === 'touchend') {
        document.addEventListener(event, this.mutliEventsMoveHandler, {
          passive: false,
        });
      } else {
        document.addEventListener(event, this.mutliEventsMoveHandler, false);
      }
    });
  };

  private _setModalTemplate = (): void => {
    const { appendModalSelector } = this._options;

    if (appendModalSelector === '' || !appendModalSelector) {
      document.body.insertAdjacentHTML('afterend', this.modalTemplate);
    } else {
      const element = document?.querySelector(appendModalSelector);
      element?.insertAdjacentHTML('beforeend', this.modalTemplate);
    }
  };

  private _setScrollbarOrNot = (): void => {
    const { enableScrollbar } = this._options;

    if (!enableScrollbar) {
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
    this.modalElement.classList.add('opacity');

    if (this._options.animation) {
      setTimeout(() => {
        this.modalElement.classList.add('show');
      }, 150);
    } else {
      this.modalElement.classList.add('show');
    }
  };

  private _removeAnimationToClose = (): void => {
    if (this.modalElement) {
      if (this._options.animation) {
        setTimeout(() => {
          this.modalElement?.classList.remove('show');
        }, 150);
      } else {
        this.modalElement.classList.remove('show');
      }
    }
  };

  private _handleValueAndCheck(val: string | null, type: string): undefined | boolean {
    const value = Number(val);

    if (type === 'hour') {
      if (this._options.clockType !== '24h') {
        if (value > 0 && value <= 12) {
          return true;
        } else {
          return false;
        }
      } else {
        if (value >= 0 && value <= 23) {
          return true;
        } else {
          return false;
        }
      }
    }

    if (type === 'minutes') {
      if (value >= 0 && value <= 59) {
        return true;
      } else {
        return false;
      }
    }
  }

  private handlerViewChange = async () => {
    if (!hasClass(this.modalElement, 'mobile')) {
      this.close();

      this._isMobileView = true;
      this._options.mobile = true;

      const beforeHourContent = this.hour.textContent;
      const beforeMinutesContent = this.minutes.textContent;
      const beforeTypeModeContent = this.activeTypeMode?.dataset.type;

      setTimeout(() => {
        this._eventsBundle();

        this._isMobileView = false;
        this._options.mobile = false;

        this.hour.textContent = beforeHourContent;
        this.minutes.textContent = beforeMinutesContent;

        const typeMode = [
          ...document.querySelectorAll('.timepicker-ui-type-mode'),
        ] as Array<HTMLElement>;

        typeMode?.map((type) => type.classList.remove('active'));

        const nowActiveType = typeMode.find(
          (type) => type.textContent === beforeTypeModeContent
        ) as HTMLElement;
        nowActiveType?.classList.add('active');
      }, 300);
    } else {
      const validHours = this._handleValueAndCheck(this.hour.textContent, 'hour');
      const validMinutes = this._handleValueAndCheck(this.minutes.textContent, 'minutes');

      if (validHours === false || validMinutes === false) {
        if (!validMinutes) {
          this.minutes.classList.add('invalid-value');
        }

        if (!validHours) {
          this.hour.classList.add('invalid-value');
        }

        return;
      }

      if (validHours === true && validMinutes === true) {
        if (validMinutes) {
          this.minutes.classList.remove('invalid-value');
        }

        if (validHours) {
          this.hour.classList.remove('invalid-value');
        }
      }

      this.close();

      this._isMobileView = false;
      this._options.mobile = false;

      const beforeHourContent = this.hour.textContent;
      const beforeMinutesContent = this.minutes.textContent;
      const beforeTypeModeContent = this.activeTypeMode?.dataset.type;

      setTimeout(() => {
        this._eventsBundle();

        if (Number(beforeHourContent) > 12 || Number(beforeHourContent) === 0) {
          this.setCircleClockClasses24h();
        }

        this._isMobileView = true;
        this._options.mobile = true;

        this.hour.textContent = beforeHourContent;
        this.minutes.textContent = beforeMinutesContent;

        const typeMode = [
          ...document.querySelectorAll('.timepicker-ui-type-mode'),
        ] as Array<HTMLElement>;

        typeMode?.map((type) => type.classList.remove('active'));

        const nowActiveType = typeMode.find(
          (type) => type.textContent === beforeTypeModeContent
        ) as HTMLElement;

        nowActiveType?.classList.add('active');

        this._setTransformToCircleWithSwitchesHour(this.hour.textContent);
        this._toggleClassActiveToValueTips(this.hour.textContent);
      }, 300);
    }
  };

  private _handleIconChangeView = async (): Promise<void> => {
    if (this._options.enableSwitchIcon) {
      if (getBrowser()) {
        this.keyboardClockIcon.addEventListener('touchstart', this.handlerViewChange);
      } else {
        this.keyboardClockIcon.addEventListener('click', this.handlerViewChange);
      }
    }
  };

  private _handlerClickHourMinutes = async (event: Event): Promise<void> => {
    if (!this.modalElement) return;

    const target = event.target as HTMLDivElement;
    const allTrue = this.modalElement.querySelectorAll('[contenteditable]');
    const validHours = this._handleValueAndCheck(this.hour.textContent, 'hour');
    const validMinutes = this._handleValueAndCheck(this.minutes.textContent, 'minutes');

    if (!this._options.editable) return;

    if (!hasClass(target, 'timepicker-ui-hour') && !hasClass(target, 'timepicker-ui-minutes')) {
      const arr = Array.from(allTrue);
      arr.map((el) => {
        const target = el as HTMLDivElement;

        target.contentEditable = 'false';
        target.classList.remove('active');
      });

      if (validHours === true && validMinutes === true) {
        if (validMinutes) this.minutes.classList.remove('invalid-value');
        if (validHours) this.hour.classList.remove('invalid-value');
      }

      if (this.minutesTips) {
        this._setMinutesToClock(this.minutes.textContent);
      } else if (this.hourTips) {
        this._setHoursToClock(this.hour.textContent);
      }
    } else {
      if (validHours === false || validMinutes === false) {
        if (!validMinutes) this.minutes.classList.add('invalid-value');
        if (!validHours) this.hour.classList.add('invalid-value');
      }

      target.contentEditable = 'true';
    }
  };

  private _handleClickOnHourMobile = (): void => {
    document.addEventListener('mousedown', this.eventsClickMobileHandler);
    document.addEventListener('touchstart', this.eventsClickMobileHandler);
  };
}
