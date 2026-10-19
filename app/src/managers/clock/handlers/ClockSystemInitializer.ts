import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { ClockSystem, type ClockSystemConfig } from '../ClockSystem';
import type { DisabledTimeConfig } from '../types';
import { setSpinbuttonValue } from '../../../utils/accessibility';
import { announceField, buildUpdatePayload, getTimeInput, type TimeField } from '../../events/timeFields';

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
    this.destroy();

    const clockFace = this.core.getClockFace();
    const clockHand = this.core.getClockHand();
    const circle = this.core.getCircle();

    if (!clockFace || !clockHand || !circle) {
      return;
    }

    const { clock } = this.core.options;
    const is24h = clock.type === '24h';
    const tipsWrapper = this.core.getTipsWrapper();

    if (!tipsWrapper) {
      return;
    }

    const showSeconds = clock.showSeconds === true;
    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();
    const seconds = showSeconds ? this.core.getSeconds() : null;

    const config: ClockSystemConfig = {
      clockFace,
      tipsWrapper,
      tipsWrapperFor24h: is24h ? this.core.getTipsWrapperFor24h() || undefined : undefined,
      clockHand,
      circle,
      clockType: (clock.type || '12h') as '12h' | '24h',
      disabledTime: this.convertDisabledTime(),
      initialHour: hour?.value || '12',
      initialMinute: minutes?.value || '00',
      initialSecond: seconds?.value || '00',
      initialAmPm: this.getAmPmValue(),
      theme: this.core.options.ui.theme,
      incrementHours: clock.incrementHours || 1,
      incrementMinutes: clock.incrementMinutes || 1,
      incrementSeconds: clock.incrementSeconds || 1,
      smoothHourSnap: clock.smoothHourSnap ?? true,
      showSeconds,
      timepicker: null,
      dragConfig: {
        autoSwitchToMinutes: clock.autoSwitchToMinutes,
        autoSwitchToSeconds: clock.autoSwitchToSeconds,
        isMobileView: this.core.isMobileView,
        smoothHourSnap: clock.smoothHourSnap ?? true,
        hourElement: hour,
        minutesElement: minutes,
        secondsElement: seconds,
        onMinuteCommit: () => {
          const time = buildUpdatePayload(this.core);
          this.emitter.emit('range:minute:commit', {
            ...time,
            hour: time.hour ?? '12',
            minutes: time.minutes ?? '00',
          });
        },
      },
      onHourChange: (value: string) => this.reflectClockValue('hour', value),
      onMinuteChange: (value: string) => this.reflectClockValue('minutes', value),
      onSecondChange: (value: string) => this.reflectClockValue('seconds', value),
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
      seconds: disabledTimeData.seconds,
      isInterval: disabledTimeData.isInterval,
      intervals,
      clockType: disabledTimeData.clockType as '12h' | '24h' | undefined,
      predicate: disabledTimeData.predicate,
    };
  }

  getAmPmValue(): '' | 'AM' | 'PM' {
    if (this.core.options.clock.type === '24h') return '';
    const activeType = this.core.getActiveType();
    if (activeType) return activeType;
    const AM = this.core.getAM();
    const isRangeMode = this.core.options.range?.enabled === true;
    if (isRangeMode) {
      return AM?.classList.contains('active') ? 'AM' : '';
    }
    return AM?.classList.contains('active') ? 'AM' : 'PM';
  }

  private reflectClockValue(field: TimeField, value: string): void {
    setSpinbuttonValue(getTimeInput(this.core, field), value);
    announceField(this.core, field);
    this.emitter.emit('update', buildUpdatePayload(this.core));
  }

  destroy(): void {
    if (this.clockSystem) {
      this.clockSystem.destroy();
      this.clockSystem = null;
    }
  }
}
