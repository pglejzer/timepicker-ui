import { selectorActive } from '../utils/variables';
import { MINUTES_STEP_5 } from '../utils/template';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { ClockSystem, type ClockSystemConfig, type DisabledTimeConfig } from './clock';

export default class ClockManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private clockSystem: ClockSystem | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.emitter.on('select:hour', ({ hour }) => {
      this.emitter.emit('animation:clock', {});
      this.setHoursToClock(hour || null);
    });

    this.emitter.on('select:minute', ({ minutes }) => {
      this.emitter.emit('animation:clock', {});
      this.setMinutesToClock(minutes || null);
    });

    this.emitter.on('select:am', () => {
      this.updateAmPm();
    });

    this.emitter.on('select:pm', () => {
      this.updateAmPm();
    });
  }

  initializeClockSystem(): void {
    const clockFace = this.core.getClockFace();
    const clockHand = this.core.getClockHand();
    const circle = this.core.getCircle();

    if (!clockFace || !clockHand || !circle) {
      return;
    }

    const is24h = this.core.options.clock.type === '24h';
    const tipsWrapper = this.core.getTipsWrapper();

    if (!tipsWrapper) {
      return;
    }

    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();

    const config: ClockSystemConfig = {
      clockFace,
      tipsWrapper,
      tipsWrapperFor24h: is24h ? this.core.getTipsWrapperFor24h() || undefined : undefined,
      clockHand,
      circle,
      clockType: (this.core.options.clock.type || '12h') as '12h' | '24h',
      disabledTime: this.convertDisabledTime(),
      initialHour: hour?.value || '12',
      initialMinute: minutes?.value || '00',
      initialAmPm: this.getAmPmValue(),
      theme: this.core.options.ui.theme,
      incrementHours: this.core.options.clock.incrementHours || 1,
      incrementMinutes: this.core.options.clock.incrementMinutes || 1,
      timepicker: null,
      dragConfig: {
        autoSwitchToMinutes: this.core.options.clock.autoSwitchToMinutes,
        isMobileView: this.core.isMobileView,
        hourElement: hour,
        minutesElement: minutes,
      },
      onHourChange: (hourValue: string) => {
        const h = this.core.getHour();
        if (h) {
          h.value = hourValue;
        }

        const minutes = this.core.getMinutes();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hourValue,
          minutes: minutes?.value,
          type: activeTypeMode?.textContent || undefined,
        });
      },
      onMinuteChange: (minuteValue: string) => {
        const m = this.core.getMinutes();
        if (m) {
          m.value = minuteValue;
        }

        const hour = this.core.getHour();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hour?.value,
          minutes: minuteValue,
          type: activeTypeMode?.textContent || undefined,
        });
      },
    };

    this.clockSystem = new ClockSystem(config);
    this.clockSystem.initialize();
  }

  private convertDisabledTime(): DisabledTimeConfig | null {
    const disabledTimeData = this.core.disabledTime?.value;
    if (!disabledTimeData) return null;

    let intervals: string[] | undefined;
    if (disabledTimeData.intervals) {
      intervals = Array.isArray(disabledTimeData.intervals)
        ? disabledTimeData.intervals
        : [disabledTimeData.intervals];
    }

    return {
      hours: disabledTimeData.hours,
      minutes: disabledTimeData.minutes,
      isInterval: disabledTimeData.isInterval,
      intervals,
      clockType: disabledTimeData.clockType as '12h' | '24h' | undefined,
    };
  }

  private getAmPmValue(): '' | 'AM' | 'PM' {
    if (this.core.options.clock.type === '24h') return '';
    const activeMode = this.core.getActiveTypeMode();
    if (activeMode) {
      const text = activeMode.textContent?.trim();
      if (text === 'AM' || text === 'PM') return text;
    }
    const AM = this.core.getAM();
    return AM?.classList.contains('active') ? 'AM' : 'PM';
  }

  destroyClockSystem(): void {
    if (this.clockSystem) {
      this.clockSystem.destroy();
      this.clockSystem = null;
    }
  }

  removeCircleClockClasses24h(): void {
    const circle = this.core.getCircle();
    const clockHand = this.core.getClockHand();
    circle?.classList.remove('tp-ui-circle-hand-24h');
    clockHand?.classList.remove('tp-ui-clock-hand-24h');
  }

  setCircleClockClasses24h(): void {
    const circle = this.core.getCircle();
    const clockHand = this.core.getClockHand();
    if (circle) {
      circle.classList.add('tp-ui-circle-hand-24h');
    }
    if (clockHand) {
      clockHand.classList.add('tp-ui-clock-hand-24h');
    }
  }

  setOnStartCSSClassesIfClockType24h(): void {
    if (this.core.options.clock.type === '24h') {
      const input = this.core.getInput();
      if (!input) return;

      let hour: string | undefined;

      if (input.value.length > 0) {
        hour = input.value.split(':')[0];
      }

      if (hour && (Number(hour) > 12 || Number(hour) === 0)) {
        this.setCircleClockClasses24h();
      }
    }
  }

  setBgColorToCircleWithMinutesTips = (): void => {
    const minutes = this.core.getMinutes();
    const circle = this.core.getCircle();
    if (!minutes || !circle) return;

    if (minutes.value && MINUTES_STEP_5.includes(minutes.value)) {
      const primaryColor = getComputedStyle(circle).getPropertyValue('--timepicker-primary').trim();
      if (primaryColor) {
        circle.style.backgroundColor = primaryColor;
      }
      circle.classList.remove('small-circle');
    }
  };

  removeBgColorToCirleWithMinutesTips = (): void => {
    const minutes = this.core.getMinutes();
    const circle = this.core.getCircle();
    if (!minutes || !circle) return;

    if (minutes.value && MINUTES_STEP_5.includes(minutes.value)) return;

    circle.style.backgroundColor = '';
    circle.classList.add('small-circle');
  };

  setClassActiveToHourOnOpen = (): void => {
    if (this.core.options.ui.mobile || this.core.isMobileView) return;
    const hour = this.core.getHour();
    hour?.classList.add(selectorActive);
  };

  setMinutesToClock = (value: string | null): void => {
    if (!this.clockSystem) return;

    this.removeBgColorToCirleWithMinutesTips();

    if (value) {
      this.clockSystem.setMinute(value);
    }

    this.clockSystem.switchToMinutes();
  };

  setHoursToClock = (value: string | null): void => {
    if (!this.clockSystem) return;

    if (value) {
      this.clockSystem.setHour(value);
    }

    this.clockSystem.switchToHours();
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
    if (!this.clockSystem || this.core.options.clock.type === '24h') return;
    const amPm = this.getAmPmValue();
    if (amPm !== '') {
      this.clockSystem.setAmPm(amPm);
    }
  };

  toggleClassActiveToValueTips = (value: string | number | null): void => {
    if (this.clockSystem) return;

    const allValueTips = this.core.getAllValueTips();
    if (!allValueTips) return;

    const element = allValueTips.find((tip: HTMLElement) => Number(tip.innerText) === Number(value));

    allValueTips.forEach((el: HTMLElement) => {
      el.classList.remove(selectorActive);
      el.setAttribute('aria-selected', 'false');
    });

    if (element === undefined) return;

    element.classList.add(selectorActive);
    element.setAttribute('aria-selected', 'true');
  };

  destroy(): void {
    this.destroyClockSystem();
  }
}
