import './styles/main.scss';
import './styles/theme.scss';
import variables from './styles/variables.scss';

import { types, options as optionsDefault } from './utils/options';
import { name, allEvents, selectorActive } from './utils/variables';
import {
  getConfig,
  getRadians,
  getScrollbarWidth,
  getClickTouchPosition,
  getMathDegIncrement,
  hasClass,
  getInputValue,
  createNewEvent,
  getBrowser,
} from './utils';
import {
  getModalTemplate,
  getMobileModalTemplate,
  getNumberOfHours12,
  getNumberOfMinutes,
} from './utils/templates';

class TimepickerUI {
  constructor(element, options) {
    this._element = element;
    this._options = getConfig(options, optionsDefault, types);

    this._isTouchMouseMove = false;
    this._degreesHours = Number(getInputValue(this.input).hour) * 30;
    this._degreesMinutes = Number(getInputValue(this.input).minutes) * 6;

    this._isMobileView = false;
    this._isDesktopView = true;

    this.mutliEventsMove = (event) => this._handleEventToMoveHand(event);
    this.mutliEventsMoveHandler = this.mutliEventsMove.bind(this);

    this.eventsClickMobile = (event) => this._handlerClickPmAm(event);
    this.eventsClickMobileHandler = this.eventsClickMobile.bind(this);

    if (this._options.mobile) {
      this._isMobileView = true;
    }
  }

  // getters

  get modalTemplate() {
    if (!this._options.mobile || !this._isMobileView) {
      return getModalTemplate(this._options);
    }
    return getMobileModalTemplate(this._options);
  }

  get modalElement() {
    return document.querySelector('.timepicker-ui-modal');
  }

  get clockFace() {
    return document.querySelector('.timepicker-ui-clock-face');
  }

  get input() {
    return this._element.querySelector('input');
  }

  get clockHand() {
    return document.querySelector('.timepicker-ui-clock-hand');
  }

  get circle() {
    return document.querySelector('.timepicker-ui-circle-hand');
  }

  get tipsWrapper() {
    return document.querySelector('.timepicker-ui-tips-wrapper');
  }

  get minutes() {
    return document.querySelector('.timepicker-ui-minutes');
  }

  get hour() {
    return document.querySelector('.timepicker-ui-hour');
  }

  get AM() {
    return document.querySelector('.timepicker-ui-am');
  }

  get PM() {
    return document.querySelector('.timepicker-ui-pm');
  }

  get minutesTips() {
    return document.querySelector('.timepicker-ui-minutes-time');
  }

  get hourTips() {
    return document.querySelector('.timepicker-ui-hour-time-12');
  }

  get allValueTips() {
    return document.querySelectorAll('.timepicker-ui-value-tips');
  }

  get button() {
    return document.querySelector('.timepicker-ui-button');
  }

  get openElementData() {
    const data = this._element.querySelector('[data-open]');
    if (data) {
      return Object.values(data.dataset)[0];
      // eslint-disable-next-line no-else-return
    } else {
      return null;
    }
  }

  get openElement() {
    return this._element.querySelector(`[data-open='${this.openElementData}']`);
  }

  get cancelButton() {
    return document.querySelector('.timepicker-ui-cancel-btn');
  }

  get okButton() {
    return document.querySelector('.timepicker-ui-ok-btn');
  }

  get activeTypeMode() {
    return document.querySelector('.timepicker-ui-type-mode.active');
  }

  get keyboardClockIcon() {
    return document.querySelector('.timepicker-ui-keyboard-icon');
  }

  get keyboardIconWrapper() {
    return new Promise((resolve) => {
      resolve(document.querySelector('.timepicker-ui-keyboard-icon-wrapper'));
    });
  }

  get footer() {
    return document.querySelector('.timepicker-ui-footer');
  }

  // public

  create = () => {
    this._setTimepickerClassToElement();
    this._setInputClassToInputElement();
    this._setDataOpenToInputIfDosentExistInWrapper();
    this._setClassTopOpenElement();
    this._handleOpenOnClick();
  };

  open = () => {
    this.create();
    this._eventsBundle();
  };

  _setTheme = () => {
    const allDiv = this.modalElement.querySelectorAll('div');

    if (this._options.theme === 'crane-straight') {
      [...allDiv].forEach((div) => div.classList.add('crane-straight'));
    } else if (this._options.theme === 'crane-radius') {
      [...allDiv].forEach((div) => div.classList.add('crane-straight', 'radius'));
    }
  };

  close = () => {
    this._isTouchMouseMove = false;

    allEvents
      .split(' ')
      .map((event) => document.removeEventListener(event, this.mutliEventsMoveHandler, false));

    document.removeEventListener('mousedown', this.eventsClickMobileHandler);
    document.removeEventListener('touchstart', this.eventsClickMobileHandler);

    this._removeAnimationToClose();

    this.openElement.classList.remove('disabled');

    setTimeout(() => {
      document.body.style.overflowY = '';
      document.body.style.paddingRight = '';
    }, 400);

    setTimeout(() => {
      this.openElement.classList.remove('disabled');
      if (this._options.focusInputAfterCloseModal) this.input.focus();
      this.modalElement.remove();
    }, 300);
  };

  // private

  _setInputClassToInputElement = () => {
    const input = this._element.querySelector('input');
    if (!hasClass(input, 'timepicker-ui-input')) {
      input.classList.add('timepicker-ui-input');
    }
  };

  _setDataOpenToInputIfDosentExistInWrapper = () => {
    const input = this._element.querySelector('input');

    if (this.openElementData === null) {
      input.setAttribute('data-open', 'timepicker-ui-input');
    }
  };

  _setClassTopOpenElement = () => {
    this.openElement.classList.add('timepicker-ui-open-element');
  };

  _removeBackdrop = () => {
    if (this._options.backdrop) return;

    this.modalElement.classList.add('removed');
    this.openElement.classList.add('disabled');
  };

  _setNormalizeClass = () => {
    const allElement = this.modalElement.querySelectorAll('div');

    this.modalElement.classList.add('timepicker-ui-normalize');
    allElement.forEach((div) => div.classList.add('timepicker-ui-normalize'));
  };

  _setFlexEndToFooterIfNoKeyboardIcon = () => {
    if (!this._options.enableSwitchIcon) {
      this.footer.style.justifyContent = 'flex-end';
    }
  };

  _eventsBundle = () => {
    this.openElement.classList.add('disabled');
    this.input.blur();

    this._setScrollbarOrNot();
    this._setModalTemplate();
    this._setNormalizeClass();
    this._removeBackdrop();
    this._setClassActiveToHourOnOpen();
    this._setBgColorToCirleWithHourTips();

    if (this.clockFace !== null) {
      this._setNumbersToClockFace();
    }

    this._setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this._setTheme();
    }, 0);

    this._setAnimationToOpen();
    this._getInputValueOnOpenAndSet();
    this._toggleClassActiveToValueTips(this.hour.textContent);

    if (this.clockFace !== null) {
      this._setTransformToCircleWithSwitchesHour(this.hour.textContent);
      this._handleAnimationClock();
    }

    this._handleMinutesClick();
    this._handleHourClick();
    this._handleAmClick();
    this._handlePmClick();
    this._handleMoveHand();
    this._handleCancelButton();
    this._handleOkButton();
    this._handleBackdropClick();

    this._handleIconChangeView();

    this._handleClickOnHourMobile(this.hour);
    this._handleClickOnHourMobile(this.minute);
  };

  _handleOpenOnClick = () => {
    this.openElement.addEventListener('click', () => this._eventsBundle());
  };

  _getInputValueOnOpenAndSet = () => {
    const value = getInputValue(this.input);

    if (value === undefined) {
      this.hour.innerText = '12';
      this.minutes.innerText = '00';
      this.AM.classList.add('active');

      createNewEvent(this._element, 'show', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      return;
    }

    const { hour, minutes, type } = value;
    const typeMode = document.querySelector(`[data-type="${type}"]`);

    this.hour.innerText = hour;
    this.minutes.innerText = minutes;
    typeMode.classList.add('active');

    createNewEvent(this._element, 'show', {
      ...value,
      type: this.AM.textContent,
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
    });
  };

  _handleCancelButton = () => {
    this.cancelButton.addEventListener('click', () => {
      const value = getInputValue(this.input);

      createNewEvent(this._element, 'cancel', {
        ...value,
        hourNotAccepted: this.hour.textContent,
        minutesNotAccepted: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      this.close();
    });
  };

  _handleOkButton = () => {
    this.okButton.addEventListener('click', () => {
      const validHours = this._handleValueAndCheck(this.hour.textContent, 'hour');
      const validMinutes = this._handleValueAndCheck(this.minutes.textContent, 'minutes');

      if (validHours === false || validMinutes === false) {
        if (!validMinutes) {
          this.minutes.classList.add('invalid-value');
        }

        return;
      }

      this.input.value = `${this.hour.textContent}:${this.minutes.textContent} ${this.activeTypeMode.textContent}`;

      createNewEvent(this._element, 'accept', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      this.close();
    });
  };

  _handleBackdropClick = () => {
    this.modalElement.addEventListener('click', (event) => {
      if (!hasClass(event.target, 'timepicker-ui-modal')) return;

      const value = getInputValue(this.input);

      createNewEvent(this._element, 'cancel', {
        ...value,
        hourNotAccepted: this.hour.textContent,
        minutesNotAccepted: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      this.close();
    });
  };

  _setBgColorToCirleWithHourTips = () => {
    const { mobile, theme } = this._options;
    if (mobile || this.circle === null) return;

    if (theme === 'crane-straight' || theme === 'crane-radius') {
      this.circle.style.backgroundColor = variables.cranered400;
    } else {
      this.circle.style.backgroundColor = variables.purple;
    }
  };

  _setBgColorToCircleWithMinutesTips = () => {
    const { theme } = this._options;

    if (getNumberOfMinutes.includes(this.minutes.textContent)) {
      if (theme === 'crane-straight' || theme === 'crane-radius') {
        this.circle.style.backgroundColor = variables.cranered400;
      } else {
        this.circle.style.backgroundColor = variables.purple;
      }
      this.circle.classList.remove('small-circle');
    }
  };

  _removeBgColorToCirleWithMinutesTips = () => {
    if (getNumberOfMinutes.includes(this.minutes.textContent)) return;

    this.circle.style.backgroundColor = '';
    this.circle.classList.add('small-circle');
  };

  _setTimepickerClassToElement = () => {
    this._element.classList.add(name);
  };

  _setClassActiveToHourOnOpen = () => {
    if (this._options.mobile || this._isMobileView) return;

    this.hour.classList.add(selectorActive);
  };

  _setMinutesToClock = (value) => {
    if (this.clockFace !== null) this._setTransformToCircleWithSwitchesMinutes(value);
    this.tipsWrapper.innerHTML = '';
    this._removeBgColorToCirleWithMinutesTips();
    this._setNumbersToClockFace(getNumberOfMinutes, 'timepicker-ui-minutes-time');
    this._toggleClassActiveToValueTips(value);
  };

  _setHoursToClock = (value) => {
    if (this.clockFace !== null) {
      this._setTransformToCircleWithSwitchesHour(value);
      this.tipsWrapper.innerHTML = '';
      this._setBgColorToCirleWithHourTips();
      this._setNumbersToClockFace();
      this._toggleClassActiveToValueTips(value);
    }
  };

  _setTransformToCircleWithSwitchesHour = (val) => {
    const value = Number(val);
    const degrees = value > 12 ? value * 30 - 360 : value * 30;
    this.clockHand.style.transform = `rotateZ(${degrees}deg)`;
  };

  _setTransformToCircleWithSwitchesMinutes = (val) => {
    this.clockHand.style.transform = `rotateZ(${Number(val) * 6}deg)`;
  };

  _handleAmClick = () => {
    this.AM.addEventListener('click', (ev) => {
      const { target } = ev;

      target.classList.add(selectorActive);
      this.PM.classList.remove(selectorActive);

      createNewEvent(this._element, 'selectamtypemode', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });
    });
  };

  _handlePmClick = () => {
    this.PM.addEventListener('click', (ev) => {
      const { target } = ev;

      target.classList.add(selectorActive);
      this.AM.classList.remove(selectorActive);

      createNewEvent(this._element, 'selectpmtypemode', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });
    });
  };

  _handleAnimationClock = () => {
    setTimeout(() => {
      this.clockFace.classList.add('timepicker-ui-clock-animation');

      setTimeout(() => {
        this.clockFace.classList.remove('timepicker-ui-clock-animation');
      }, 600);
    }, 150);
  };

  _handleAnimationSwitchTipsMode = () => {
    this.clockHand.classList.add('timepicker-ui-tips-animation');
    setTimeout(() => {
      this.clockHand.classList.remove('timepicker-ui-tips-animation');
    }, 401);
  };

  _handleHourClick = () => {
    this.hour.addEventListener('click', (ev) => {
      const { target } = ev;

      if (this.clockFace !== null) this._handleAnimationSwitchTipsMode();

      this._setHoursToClock(target.textContent);
      target.classList.add(selectorActive);
      this.minutes.classList.remove(selectorActive);

      createNewEvent(this._element, 'selecthourmode', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });

      if (this.clockFace !== null) this.circle.classList.remove('small-circle');
    });
  };

  _handleMinutesClick = () => {
    this.minutes.addEventListener('click', (ev) => {
      const { target } = ev;

      if (this.clockFace !== null) this._handleAnimationSwitchTipsMode();

      if (this.clockFace !== null) this._setMinutesToClock(target.textContent);
      target.classList.add(selectorActive);
      this.hour.classList.remove(selectorActive);

      createNewEvent(this._element, 'selectminutemode', {
        hour: this.hour.textContent,
        minutes: this.minutes.textContent,
        type: this.AM.textContent,
        degreesHours: this._degreesHours,
        degreesMinutes: this._degreesMinutes,
      });
    });
  };

  _handleEventToMoveHand = (event) => {
    if (!getBrowser()) event.preventDefault();

    const { type, target } = event;
    const { incrementMinutes, incrementHours, switchToMinutesAfterSelectHour } = this._options;

    const { x, y } = getClickTouchPosition(event, this.clockFace);
    const clockFaceRadius = this.clockFace.offsetWidth / 2;
    let rtangens = Math.atan2(y - clockFaceRadius, x - clockFaceRadius);

    if (getBrowser()) {
      const touched = getClickTouchPosition(event, this.clockFace, true);
      if (touched === undefined) return;
      rtangens = Math.atan2(touched.y - clockFaceRadius, touched.x - clockFaceRadius);
    }

    if (type === 'mouseup' || type === 'touchend') {
      this._isTouchMouseMove = false;

      if (switchToMinutesAfterSelectHour) this.minutes.click();

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
          hasClass(target, 'timepicker-ui-value-tips')
        ) {
          this._isTouchMouseMove = true;
        } else {
          this._isTouchMouseMove = false;
        }
      }
    }

    if (!this._isTouchMouseMove) return;

    if (this.minutesTips !== null) {
      let degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

      if (incrementMinutes === 5) {
        degrees = getMathDegIncrement(degrees, 30);
      } else if (incrementMinutes === 10) {
        degrees = getMathDegIncrement(degrees, 60);
      } else if (incrementMinutes === 15) {
        degrees = getMathDegIncrement(degrees, 90);
      }

      let minute;

      if (degrees < 0) {
        minute = Math.round(360 + degrees / 6) % 60;
        degrees = 360 + Math.round(degrees / 6) * 6;
      } else {
        minute = Math.round(degrees / 6) % 60;
        degrees = Math.round(degrees / 6) * 6;
      }

      this.minutes.innerText = minute >= 10 ? minute : `0${minute}`;
      this.clockHand.style.transform = `rotateZ(${degrees}deg)`;

      this._degreesMinutes = degrees;

      this._toggleClassActiveToValueTips(this.minutes.textContent);
      this._removeBgColorToCirleWithMinutesTips();
      this._setBgColorToCircleWithMinutesTips();
    }

    if (this.hourTips !== null) {
      let degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

      degrees = getMathDegIncrement(degrees, 30);

      if (incrementHours === 2) {
        degrees = getMathDegIncrement(degrees, 60);
      } else if (incrementHours === 3) {
        degrees = getMathDegIncrement(degrees, 90);
      }

      this.clockHand.style.transform = `rotateZ(${degrees}deg)`;
      this._degreesHours = degrees;

      let hour;
      if (degrees < 0) {
        hour = Math.round(360 + degrees / 30) % 12;
        degrees = 360 + degrees;
      } else {
        hour = Math.round(degrees / 30) % 12;
        if (hour === 0 || hour > 12) {
          hour = 12;
        }
      }

      this.hour.innerText = hour > 9 ? hour : `0${hour}`;

      this._toggleClassActiveToValueTips(hour);
    }

    createNewEvent(this._element, 'update', {
      ...getInputValue(this.input),
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
      eventType: type,
    });
  };

  _toggleClassActiveToValueTips = (value) => {
    const element = [...this.allValueTips].find((tip) => Number(tip.innerText) === Number(value));

    [...this.allValueTips].forEach((el) => el.classList.remove('active'));

    if (element === undefined) return;

    element.classList.add('active');
  };

  _handleMoveHand = () => {
    if (this._options.mobile || this._isMobileView) return;

    allEvents
      .split(' ')
      .map((event) => document.addEventListener(event, this.mutliEventsMoveHandler, false));
  };

  _setModalTemplate = () => {
    const { appendModalSelector } = this._options;

    if (appendModalSelector === '') {
      document.body.insertAdjacentHTML('afterend', this.modalTemplate);
    } else {
      const element = document.querySelector(appendModalSelector);

      element.insertAdjacentHTML('beforeend', this.modalTemplate);
    }
  };

  _setScrollbarOrNot = () => {
    const { enableScrollbar } = this._options;

    if (enableScrollbar) {
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      document.body.style.overflowY = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
      }, 400);
    }
  };

  _setNumbersToClockFace = (
    array = getNumberOfHours12,
    classToAdd = 'timepicker-ui-hour-time-12'
  ) => {
    const el = 360 / array.length;
    const clockWidth = (this.clockFace.offsetWidth - 32) / 2;
    const clockHeight = (this.clockFace.offsetHeight - 32) / 2;
    const radius = clockWidth - 9;

    array.forEach((num, index) => {
      const angle = getRadians(index * el);
      const span = document.createElement('span');
      const spanTips = document.createElement('span');

      spanTips.innerHTML = num;
      spanTips.classList.add('timepicker-ui-value-tips');
      span.classList.add(classToAdd);

      if (this._options.theme === 'crane-straight') {
        span.classList.add('crane-straight');
        spanTips.classList.add('crane-straight');
      }

      span.style.left = `${clockWidth + Math.sin(angle) * radius - span.offsetWidth}px`;
      span.style.bottom = `${clockHeight + Math.cos(angle) * radius - span.offsetHeight}px`;

      span.appendChild(spanTips);
      this.tipsWrapper.appendChild(span);
    });
  };

  _setAnimationToOpen = () => {
    this.modalElement.classList.add('opacity');

    setTimeout(() => {
      this.modalElement.classList.add('show');
    }, 150);
  };

  _removeAnimationToClose = () => {
    setTimeout(() => {
      this.modalElement.classList.remove('show');
    }, 150);
  };

  _handleValueAndCheck(val, type) {
    const value = Number(val);

    if (type === 'hour') {
      if (value > 0 && value <= 12) {
        return true;
        // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    }
    if (type === 'minutes') {
      if (value >= 0 && value <= 59) {
        return true;
        // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    }
  }

  _handleIconChangeView = async () => {
    const handlerViewChange = async () => {
      if (!hasClass(this.modalElement, 'mobile')) {
        this.close();

        this._isMobileView = true;
        this._options.mobile = true;
        this._isDesktopView = false;

        const beforeHourContent = this.hour.textContent;
        const beforeMinutesContent = this.minutes.textContent;
        const beforeTypeModeContent = this.activeTypeMode.textContent;

        setTimeout(() => {
          this._eventsBundle();

          this._isMobileView = false;
          this._options.mobile = false;
          this._isDesktopView = true;

          this.hour.textContent = beforeHourContent;
          this.minutes.textContent = beforeMinutesContent;

          const typeMode = document.querySelectorAll('.timepicker-ui-type-mode');
          typeMode.forEach((type) => type.classList.remove('active'));

          const nowActiveType = [...typeMode].find(
            (type) => type.textContent === beforeTypeModeContent
          );
          nowActiveType.classList.add('active');
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
        this._isDesktopView = true;

        const beforeHourContent = this.hour.textContent;
        const beforeMinutesContent = this.minutes.textContent;
        const beforeTypeModeContent = this.activeTypeMode.textContent;

        setTimeout(() => {
          this._eventsBundle();

          this._isMobileView = true;
          this._options.mobile = true;
          this._isDesktopView = false;

          this.hour.textContent = beforeHourContent;
          this.minutes.textContent = beforeMinutesContent;

          const typeMode = document.querySelectorAll('.timepicker-ui-type-mode');
          typeMode.forEach((type) => type.classList.remove('active'));

          const nowActiveType = [...typeMode].find(
            (type) => type.textContent === beforeTypeModeContent
          );
          nowActiveType.classList.add('active');

          this._setTransformToCircleWithSwitchesHour(this.hour.textContent);
          this._toggleClassActiveToValueTips(this.hour.textContent);
        }, 300);
      }
    };

    if (this._options.enableSwitchIcon) {
      this.keyboardClockIcon.addEventListener('touchdown', (event) => handlerViewChange(event));
      this.keyboardClockIcon.addEventListener('mousedown', (event) => handlerViewChange(event));
    }
  };

  // Mobile version
  _handlerClickPmAm = async ({ target }) => {
    const allTrue = this.modalElement.querySelectorAll('[contenteditable]');
    const validHours = this._handleValueAndCheck(this.hour.textContent, 'hour');
    const validMinutes = this._handleValueAndCheck(this.minutes.textContent, 'minutes');

    if (!hasClass(this.modalElement, 'mobile')) return;

    if (!hasClass(target, 'timepicker-ui-hour') && !hasClass(target, 'timepicker-ui-minutes')) {
      allTrue.forEach((el) => {
        el.contentEditable = false;
        el.classList.remove('active');
      });

      if (validHours === true && validMinutes === true) {
        if (validMinutes) {
          this.minutes.classList.remove('invalid-value');
        }

        if (validHours) {
          this.hour.classList.remove('invalid-value');
        }
      }
    } else {
      if (validHours === false || validMinutes === false) {
        if (!validMinutes) {
          this.minutes.classList.add('invalid-value');
        }

        if (!validHours) {
          this.hour.classList.add('invalid-value');
        }
      }

      target.contentEditable = true;
    }
  };

  _handleClickOnHourMobile = () => {
    if (!this._options.mobile || !this._isMobileView) return;

    document.addEventListener('mousedown', this.eventsClickMobileHandler);
    document.addEventListener('touchstart', this.eventsClickMobileHandler);
  };
}
export default TimepickerUI;

const test = document.querySelector('.timepicker-ui');

const init = new TimepickerUI(test, { theme: 'crane-radius' });

init.create();
