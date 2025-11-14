import { selectorActive } from '../utils/variables';
import { MINUTES_STEP_5 } from '../utils/template';
import type { ITimepickerUI } from '../types/ITimepickerUI';
import { ClockSystem, type ClockSystemConfig, type DisabledTimeConfig } from './clock';

export default class ClockManager {
  private timepicker: ITimepickerUI;
  private clockSystem: ClockSystem | null = null;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  initializeClockSystem(): void {
    if (!this.timepicker.clockFace || !this.timepicker.clockHand || !this.timepicker.circle) {
      return;
    }

    const is24h = this.timepicker._options.clockType === '24h';

    if (!this.timepicker.tipsWrapper) {
      return;
    }

    const config: ClockSystemConfig = {
      clockFace: this.timepicker.clockFace,
      tipsWrapper: this.timepicker.tipsWrapper,
      tipsWrapperFor24h: is24h ? this.timepicker.tipsWrapperFor24h : undefined,
      clockHand: this.timepicker.clockHand,
      circle: this.timepicker.circle,
      clockType: (this.timepicker._options.clockType || '12h') as '12h' | '24h',
      disabledTime: this.convertDisabledTime(),
      initialHour: this.timepicker.hour?.value || '12',
      initialMinute: this.timepicker.minutes?.value || '00',
      initialAmPm: this.getAmPmValue(),
      theme: this.timepicker._options.theme,
      incrementHours: this.timepicker._options.incrementHours || 1,
      incrementMinutes: this.timepicker._options.incrementMinutes || 1,
      timepicker: this.timepicker,
      onHourChange: (hour: string) => {
        if (this.timepicker.hour) {
          this.timepicker.hour.value = hour;
        }
      },
      onMinuteChange: (minute: string) => {
        if (this.timepicker.minutes) {
          this.timepicker.minutes.value = minute;
        }
      },
    };

    this.clockSystem = new ClockSystem(config);
    this.clockSystem.initialize();
  }

  private convertDisabledTime(): DisabledTimeConfig | null {
    if (!this.timepicker._disabledTime?.value) return null;

    const oldValue = this.timepicker._disabledTime.value;

    let intervals: string[] | undefined;
    if (oldValue.intervals) {
      intervals = Array.isArray(oldValue.intervals) ? oldValue.intervals : [oldValue.intervals];
    }

    return {
      hours: oldValue.hours,
      minutes: oldValue.minutes,
      isInterval: oldValue.isInterval,
      intervals,
      clockType: oldValue.clockType as '12h' | '24h' | undefined,
    };
  }

  private getAmPmValue(): '' | 'AM' | 'PM' {
    if (this.timepicker._options.clockType === '24h') return '';
    const activeMode = this.timepicker.activeTypeMode;
    if (activeMode) {
      const text = activeMode.textContent?.trim();
      if (text === 'AM' || text === 'PM') return text;
    }
    return this.timepicker.AM?.classList.contains('active') ? 'AM' : 'PM';
  }

  destroyClockSystem(): void {
    if (this.clockSystem) {
      this.clockSystem.destroy();
      this.clockSystem = null;
    }
  }

  removeCircleClockClasses24h() {
    this.timepicker.circle?.classList.remove('timepicker-ui-circle-hand-24h');
    this.timepicker.clockHand?.classList.remove('timepicker-ui-clock-hand-24h');
  }

  setCircleClockClasses24h() {
    if (this.timepicker.circle) {
      this.timepicker.circle?.classList.add('timepicker-ui-circle-hand-24h');
    }
    if (this.timepicker.clockHand) {
      this.timepicker.clockHand?.classList.add('timepicker-ui-clock-hand-24h');
    }
  }

  setOnStartCSSClassesIfClockType24h() {
    if (this.timepicker._options.clockType === '24h') {
      const inputValue = this.timepicker?.configManager?.getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
        this.timepicker._options.currentTime,
      );

      let hour = inputValue?.hour;

      if (this.timepicker.input.value.length > 0) {
        hour = this.timepicker.input.value.split(':')[0];
      }

      if (Number(hour) > 12 || Number(hour) === 0) {
        this.setCircleClockClasses24h();
      }
    }
  }

  setBgColorToCircleWithMinutesTips = (): void => {
    if (this.timepicker.minutes.value && MINUTES_STEP_5.includes(this.timepicker.minutes.value)) {
      const primaryColor = getComputedStyle(this.timepicker.circle)
        .getPropertyValue('--timepicker-primary')
        .trim();
      if (primaryColor) {
        this.timepicker.circle.style.backgroundColor = primaryColor;
      }
      this.timepicker.circle.classList.remove('small-circle');
    }
  };

  removeBgColorToCirleWithMinutesTips = (): void => {
    if (this.timepicker.minutes.value && MINUTES_STEP_5.includes(this.timepicker.minutes.value)) return;

    this.timepicker.circle.style.backgroundColor = '';
    this.timepicker.circle.classList.add('small-circle');
  };

  setClassActiveToHourOnOpen = (): void => {
    if (this.timepicker._options.mobile || this.timepicker._isMobileView) return;
    this.timepicker.hour?.classList.add(selectorActive);
  };

  setMinutesToClock = (value: string | null): void => {
    if (!this.clockSystem) return;

    this.removeBgColorToCirleWithMinutesTips();
    this.clockSystem.switchToMinutes();

    if (value) {
      this.clockSystem.setMinute(value);
    }
  };

  setHoursToClock = (value: string | null): void => {
    if (!this.clockSystem) return;

    this.clockSystem.switchToHours();

    if (value) {
      this.clockSystem.setHour(value);
    }
  };

  setTransformToCircleWithSwitchesHour = (val: string | null): void => {
    if (!this.clockSystem || !val) return;
    this.clockSystem.setHour(val);
  };

  setTransformToCircleWithSwitchesMinutes = (val: string | null): void => {
    if (!this.clockSystem || !val) return;
    this.clockSystem.setMinute(val);
  };

  updateAmPm = (): void => {
    if (!this.clockSystem || this.timepicker._options.clockType === '24h') return;
    const amPm = this.getAmPmValue();
    if (amPm !== '') {
      this.clockSystem.setAmPm(amPm);
    }
  };

  toggleClassActiveToValueTips = (value: string | number | null): void => {
    if (this.clockSystem) return;

    const element = this.timepicker.allValueTips.find(
      (tip: HTMLElement) => Number(tip.innerText) === Number(value),
    );

    this.timepicker.allValueTips.map((el: HTMLElement) => {
      el.classList.remove(selectorActive);
      el.setAttribute('aria-selected', 'false');
    });

    if (element === undefined) return;

    element.classList.add(selectorActive);
    element.setAttribute('aria-selected', 'true');
  };
}
