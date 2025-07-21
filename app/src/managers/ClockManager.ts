import ClockFaceManager from './ClockFaceManager';
import { themeVariables } from '../constants/variables';
import { selectorActive } from '../utils/variables';
import { getNumberOfHours12, getNumberOfHours24, getNumberOfMinutes } from '../utils/template';
import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class ClockManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  removeCircleClockClasses24h() {
    this.timepicker.circle?.classList.remove('timepicker-ui-circle-hand-24h');
    this.timepicker.clockHand?.classList.remove('timepicker-ui-clock-hand-24h');
  }

  /** @internal */
  setCircleClockClasses24h() {
    if (this.timepicker.circle) {
      this.timepicker.circle?.classList.add('timepicker-ui-circle-hand-24h');
    }
    if (this.timepicker.clockHand) {
      this.timepicker.clockHand?.classList.add('timepicker-ui-clock-hand-24h');
    }
  }

  /** @internal */
  setOnStartCSSClassesIfClockType24h() {
    if (this.timepicker._options.clockType === '24h') {
      let { hour } = this.timepicker.configManager.getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
        this.timepicker._options.currentTime,
      );

      if (this.timepicker.input.value.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        hour = this.timepicker.input.value.split(':')[0];
      }

      if (Number(hour) > 12 || Number(hour) === 0) {
        this.setCircleClockClasses24h();
      }
    }
  }

  /** @internal */
  setBgColorToCirleWithHourTips = (): void => {
    if (!this.timepicker._options) return;

    const { mobile, theme } = this.timepicker._options;

    if (mobile || this.timepicker.circle === null) return;

    if (theme === 'crane-straight' || theme === 'crane-radius') {
      this.timepicker.circle.style.backgroundColor = themeVariables.cranered400;
    } else {
      this.timepicker.circle.style.backgroundColor = themeVariables.purple;
    }
  };

  /** @internal */
  setBgColorToCircleWithMinutesTips = (): void => {
    const { theme } = this.timepicker._options;

    if (this.timepicker.minutes.value && getNumberOfMinutes.includes(this.timepicker.minutes.value)) {
      if (theme === 'crane-straight' || theme === 'crane-radius') {
        this.timepicker.circle.style.backgroundColor = themeVariables.cranered400;
      } else {
        this.timepicker.circle.style.backgroundColor = themeVariables.purple;
      }
      this.timepicker.circle.classList.remove('small-circle');
    }
  };

  /** @internal */
  removeBgColorToCirleWithMinutesTips = (): void => {
    if (this.timepicker.minutes.value && getNumberOfMinutes.includes(this.timepicker.minutes.value)) return;

    this.timepicker.circle.style.backgroundColor = '';
    this.timepicker.circle.classList.add('small-circle');
  };

  /** @internal */
  setClassActiveToHourOnOpen = (): void => {
    if (this.timepicker._options.mobile || this.timepicker._isMobileView) return;

    this.timepicker.hour?.classList.add(selectorActive);
  };

  /** @internal */
  setMinutesToClock = (value: string | null): void => {
    if (this.timepicker.clockFace !== null) this.setTransformToCircleWithSwitchesMinutes(value);
    this.removeBgColorToCirleWithMinutesTips();

    const getDisabledMinutes = this.timepicker._disabledTime?.value?.minutes
      ? this.timepicker._disabledTime?.value?.minutes
      : this.timepicker._disabledTime?.value;

    const initClockFace = new ClockFaceManager({
      array: getNumberOfMinutes,
      classToAdd: 'timepicker-ui-minutes-time',
      clockFace: this.timepicker.clockFace,
      tipsWrapper: this.timepicker.tipsWrapper,
      theme: this.timepicker._options.theme,
      disabledTime: getDisabledMinutes,
      hour: this.timepicker.hour.value,
      clockType: this.timepicker._options.clockType,
    });

    initClockFace.create();

    if (this.timepicker._options.clockType === '12h') {
      initClockFace.updateDisable();
    }

    this.toggleClassActiveToValueTips(value);

    if (this.timepicker._options.clockType === '24h') {
      this.timepicker.tipsWrapperFor24h.innerHTML = '';
    }
  };

  /** @internal */
  setHoursToClock = (value: string | null): void => {
    if (this.timepicker.clockFace !== null) {
      this.setTransformToCircleWithSwitchesHour(value);
      this.setBgColorToCirleWithHourTips();

      const disabledTime = this.timepicker._disabledTime?.value?.isInterval
        ? this.timepicker._disabledTime?.value.rangeArrHour
        : this.timepicker._disabledTime?.value?.hours;

      const init12h = new ClockFaceManager({
        array: getNumberOfHours12,
        classToAdd: 'timepicker-ui-hour-time-12',
        clockFace: this.timepicker.clockFace,
        tipsWrapper: this.timepicker.tipsWrapper,
        theme: this.timepicker._options.theme,
        disabledTime,
        clockType: '12h',
        hour: this.timepicker.hour.value,
      });

      init12h.create();

      if (this.timepicker._options.clockType === '24h') {
        new ClockFaceManager({
          array: getNumberOfHours24,
          classToAdd: 'timepicker-ui-hour-time-24',
          clockFace: this.timepicker.tipsWrapperFor24h,
          tipsWrapper: this.timepicker.tipsWrapperFor24h,
          theme: this.timepicker._options.theme,
          clockType: '24h',
          disabledTime,
          hour: this.timepicker.hour.value,
        }).create();
      } else {
        init12h.updateDisable();
      }

      this.toggleClassActiveToValueTips(value);
    }
  };

  /** @internal */
  setTransformToCircleWithSwitchesHour = (val: string | null): void => {
    // Sprawdź czy clockHand istnieje (może być null w mobile mode)
    if (!this.timepicker.clockHand) return;

    const value = Number(val);

    let degrees = value > 12 ? value * 30 - 360 : value * 30;

    if (degrees === 360) {
      degrees = 0;
    }

    if (degrees > 360) return;

    this.timepicker.clockHand.style.transform = `rotateZ(${degrees}deg)`;
  };

  /** @internal */
  setTransformToCircleWithSwitchesMinutes = (val: string | null): void => {
    // Sprawdź czy clockHand istnieje (może być null w mobile mode)
    if (!this.timepicker.clockHand) return;

    const degrees = Number(val) * 6;

    if (degrees > 360) return;

    this.timepicker.clockHand.style.transform = `rotateZ(${degrees}deg)`;
  };

  /** @internal */
  toggleClassActiveToValueTips = (value: string | number | null): void => {
    const element = this.timepicker.allValueTips.find(
      (tip: HTMLElement) => Number(tip.innerText) === Number(value),
    );

    this.timepicker.allValueTips.map((el: HTMLElement) => el.classList.remove(selectorActive));

    if (element === undefined) return;

    element.classList.add(selectorActive);
  };
}
