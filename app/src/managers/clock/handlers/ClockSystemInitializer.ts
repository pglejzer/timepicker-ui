import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { ClockSystem, type ClockSystemConfig } from '../ClockSystem';
import type { DisabledTimeConfig } from '../types';
import { announceToScreenReader } from '../../../utils/accessibility';

export class ClockSystemInitializer {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private clockSystem: ClockSystem | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  getClockSystem(): ClockSystem | null {
    return this.clockSystem;
  }

  initialize(): void {
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
      smoothHourSnap: this.core.options.clock.smoothHourSnap ?? true,
      timepicker: null,
      dragConfig: {
        autoSwitchToMinutes: this.core.options.clock.autoSwitchToMinutes,
        isMobileView: this.core.isMobileView,
        smoothHourSnap: this.core.options.clock.smoothHourSnap ?? true,
        hourElement: hour,
        minutesElement: minutes,
        onMinuteCommit: () => {
          const m = this.core.getMinutes();
          const h = this.core.getHour();
          const activeTypeMode = this.core.getActiveTypeMode();
          this.emitter.emit('range:minute:commit', {
            hour: h?.value ?? '12',
            minutes: m?.value ?? '00',
            type: activeTypeMode?.textContent ?? undefined,
          });
        },
      },
      onHourChange: (hourValue: string) => {
        const h = this.core.getHour();
        if (h) {
          h.value = hourValue;
          h.setAttribute('aria-valuenow', hourValue);
        }

        const modal = this.core.getModalElement();
        announceToScreenReader(modal, `Hour: ${hourValue}`);

        const minutesEl = this.core.getMinutes();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hourValue,
          minutes: minutesEl?.value,
          type: activeTypeMode?.textContent || undefined,
        });
      },
      onMinuteChange: (minuteValue: string) => {
        const m = this.core.getMinutes();
        if (m) {
          m.value = minuteValue;
          m.setAttribute('aria-valuenow', minuteValue);
        }

        const modal = this.core.getModalElement();
        announceToScreenReader(modal, `Minutes: ${minuteValue}`);

        const hourEl = this.core.getHour();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hourEl?.value,
          minutes: minuteValue,
          type: activeTypeMode?.textContent || undefined,
        });
      },
    };

    this.clockSystem = new ClockSystem(config);
    this.clockSystem.initialize();
  }

  convertDisabledTime(): DisabledTimeConfig | null {
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

  getAmPmValue(): '' | 'AM' | 'PM' {
    if (this.core.options.clock.type === '24h') return '';
    const activeMode = this.core.getActiveTypeMode();
    if (activeMode) {
      const text = activeMode.textContent?.trim();
      if (text === 'AM' || text === 'PM') return text;
    }
    const AM = this.core.getAM();
    const isRangeMode = this.core.options.range?.enabled === true;
    if (isRangeMode) {
      return AM?.classList.contains('active') ? 'AM' : '';
    }
    return AM?.classList.contains('active') ? 'AM' : 'PM';
  }

  destroy(): void {
    if (this.clockSystem) {
      this.clockSystem.destroy();
      this.clockSystem = null;
    }
  }
}

