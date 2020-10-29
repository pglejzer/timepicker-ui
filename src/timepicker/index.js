import './styles/main.scss';

import {
  getConfig,
  getRadians,
  getScrollbarWidth,
  clickOrTouchPosition,
  mathDegreesIncrement,
  hasClass,
  removeListenerMulti,
  offMulti,
} from './utils';
import {
  getModalTemplate,
  getMobileModalTemplate,
  numberOfHours12,
  numberOfHours24,
  numberOfMinutes,
} from './templates';

const DEFAULT_OPTIONS = {
  appendModalSelector: '',
  backdrop: true,
  enableScrollbar: false,
  mobile: false,
  inputTemplate: '',
  incrementMinutes: 1,
  incrementHours: 1,
  switchToMinutesAfterSelectOur: false,
};
const DEFAULT_TYPE = {
  appendModalSelector: 'string',
  backdrop: 'boolean',
  enableScrollbar: 'boolean',
  mobile: 'boolean',
  inputTemplate: 'string',
  incrementMinutes: 'number',
  incrementHours: 'number',
  switchToMinutesAfterSelectOur: 'boolean',
};
const NAME = 'timepicker-ui';
const MOUSE_EVENTS = 'mousedown mouseup mousemove mouseleave mouseover';
const TOUCH_EVENTS = 'touchstart touchmove touchend';
const ALL_EVENTS = MOUSE_EVENTS.concat(` ${TOUCH_EVENTS}`);
const SELECTOR_ACTIVE = 'active';

class Timepicker {
  constructor(element, options) {
    this._element = element;
    this._options = getConfig(options, DEFAULT_OPTIONS, DEFAULT_TYPE, NAME);

    this._isMouseMove = false;

    this.init();
    this.mutliEventsMove = (event) => {
      this._handleEventToMoveHand(event);
    };

    this.mutliEventsMoveHandler = this.mutliEventsMove.bind(this);
  }

  // getters

  static get NAME() {
    return NAME;
  }

  get modalTemplate() {
    if (!this._options.mobile) {
      return getModalTemplate();
    } else {
      return getMobileModalTemplate();
    }
  }

  get modalElement() {
    return document.querySelector('.timepicker-ui-modal');
  }

  get clockFace() {
    return document.querySelector('.timepicker-ui-clock-face');
  }

  get input() {
    return document.querySelector('input.timepicker-ui-input');
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

  get input() {
    return document.querySelector('.timepicker-ui-input');
  }

  get button() {
    return document.querySelector('.timepicker-ui-button');
  }

  get openElementData() {
    return Object.values(this._element.querySelector('[data-open]').dataset)[0];
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

  // public

  init = () => {
    this._setTimepickerClassToElement();
    this._setScrollbarOrNot();
    this._handleOpenOnClick();
  };

  open = () => {
    this.init();
  };

  _close = () => {
    this._isMouseMove = false;

    ALL_EVENTS.split(' ').map((event) =>
      window.removeEventListener(event, this.mutliEventsMoveHandler, false)
    );

    this.modalElement.remove();
  };

  // private

  _handleOpenOnClick = () => {
    this.openElement.addEventListener('click', () => {
      if (this._options.backdrop) this._setModalTemplate();
      this._setClassActiveToHourOnOpen();
      this._setBgColorToCirleWithHourTips();

      if (!this._options.mobile) this._setNumbersToClockFace();

      this._toggleClassActiveToValueTips(this.hour.textContent);
      this._setTransformToCircleWithSwitchesHour(this.hour.textContent);
      this._handleAnimationClock();
      this._handleMinutesClick();
      this._handleHourClick();
      this._handleAmClick();
      this._handlePmClick();
      this._handleMoveHand();
      this._handleCancelButton();
    });
  };

  _handleCancelButton = () => {
    this.cancelButton.addEventListener('click', (event) => {
      this._close();
    });
  };

  _setBgColorToCirleWithHourTips = () => {
    if (this.minutesTips !== null) return;

    this.circle.style.backgroundColor = '#6200EE';
  };

  _setBgColorToCircleWithMinutesTips = () => {
    if (numberOfMinutes.includes(this.minutes.textContent)) {
      this.circle.style.backgroundColor = '#6200EE';
      this.circle.classList.remove('small-circle');
    }
  };

  _removeBgColorToCirleWithMinutesTips = () => {
    if (numberOfMinutes.includes(this.minutes.textContent)) return;

    this.circle.style.backgroundColor = '';
    this.circle.classList.add('small-circle');
  };

  _setTimepickerClassToElement = () => {
    this._element.classList.add(NAME);
  };

  _setClassActiveToHourOnOpen = () => {
    this.hour.classList.add(SELECTOR_ACTIVE);
  };

  _setMinutesToClock = (value) => {
    this.tipsWrapper.innerHTML = '';
    this._removeBgColorToCirleWithMinutesTips();
    this._setNumbersToClockFace(numberOfMinutes, 'timepicker-ui-minutes-time');
    this._toggleClassActiveToValueTips(value);
    this._setTransformToCircleWithSwitchesMinutes(value);
  };

  _setHoursToClock = (value) => {
    this.tipsWrapper.innerHTML = '';
    this._setBgColorToCirleWithHourTips();
    this._setNumbersToClockFace();
    this._toggleClassActiveToValueTips(value);
    this._setTransformToCircleWithSwitchesHour(value);
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

      target.classList.add(SELECTOR_ACTIVE);
      this.PM.classList.remove(SELECTOR_ACTIVE);
    });
  };

  _handlePmClick = () => {
    this.PM.addEventListener('click', (ev) => {
      const { target } = ev;

      target.classList.add(SELECTOR_ACTIVE);
      this.AM.classList.remove(SELECTOR_ACTIVE);
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

  _handleHourClick = () => {
    this.hour.addEventListener('click', (ev) => {
      const { target } = ev;

      this._setHoursToClock(target.textContent);
      target.classList.add(SELECTOR_ACTIVE);
      this.minutes.classList.remove(SELECTOR_ACTIVE);
      this.circle.classList.remove('small-circle');
    });
  };

  _handleMinutesClick = () => {
    this.minutes.addEventListener('click', (ev) => {
      const { target } = ev;

      this._setMinutesToClock(target.textContent);
      target.classList.add(SELECTOR_ACTIVE);
      this.hour.classList.remove(SELECTOR_ACTIVE);
    });
  };

  _handleEventToMoveHand = (event) => {
    event.preventDefault();

    const { type, target } = event;
    const { incrementMinutes, incrementHours, switchToMinutesAfterSelectOur } = this._options;

    const { x, y } = clickOrTouchPosition(event, this.clockFace);
    const clockFaceRadius = this.clockFace.offsetWidth / 2;
    let rtangens = Math.atan2(y - clockFaceRadius, x - clockFaceRadius);

    if (type === 'mouseup' || type === 'touchend') {
      this._isMouseMove = false;

      if (switchToMinutesAfterSelectOur) this.minutes.click();

      return;
    }

    if (
      type === 'mousedown' ||
      type === 'mousemove' ||
      type === 'touchmove' ||
      type === 'touchmove'
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
          this._isMouseMove = true;
        }
      }
    }

    if (!this._isMouseMove) return;

    if (this.minutesTips !== null) {
      let degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

      if (incrementMinutes === 5) {
        degrees = mathDegreesIncrement(degrees, 30);
      } else if (incrementMinutes === 10) {
        degrees = mathDegreesIncrement(degrees, 60);
      } else if (incrementMinutes === 15) {
        degrees = mathDegreesIncrement(degrees, 60);
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

      this._toggleClassActiveToValueTips(this.minutes.textContent);
      this._removeBgColorToCirleWithMinutesTips();
      this._setBgColorToCircleWithMinutesTips();
    }

    if (this.hourTips !== null) {
      let degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

      degrees = mathDegreesIncrement(degrees, 30);

      if (incrementHours === 2) {
        degrees = mathDegreesIncrement(degrees, 60);
      } else if (incrementHours === 3) {
        degrees = mathDegreesIncrement(degrees, 90);
      }

      this.clockHand.style.transform = `rotateZ(${degrees}deg)`;

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
  };

  _toggleClassActiveToValueTips = (value) => {
    const element = [...this.allValueTips].find((tip) => Number(tip.innerText) === Number(value));

    [...this.allValueTips].forEach((element) => element.classList.remove('active'));

    if (element === undefined) return;

    element.classList.add('active');
  };

  _handleMoveHand = () => {
    ALL_EVENTS.split(' ').map((event) =>
      window.addEventListener(event, this.mutliEventsMoveHandler, false)
    );
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

    if (!enableScrollbar) {
      document.body.style.overflowY = 'hidden';
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
    }
  };

  _setNumbersToClockFace = (array = numberOfHours12, classToAdd = 'timepicker-ui-hour-time-12') => {
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

      span.style.left = `${clockWidth + Math.sin(angle) * radius - span.offsetWidth}px`;
      span.style.bottom = `${clockHeight + Math.cos(angle) * radius - span.offsetHeight}px`;

      span.appendChild(spanTips);
      this.tipsWrapper.appendChild(span);
    });
  };
}
export default Timepicker;

const test = document.querySelector('.test');
const btn = document.querySelector('.test-btn');

const xd = new Timepicker(test);
