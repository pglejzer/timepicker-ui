import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { ClockSystem } from '../ClockSystem';
import type { DisabledTimeConfig } from '../types';

type RangeDisabledData =
  | {
      hours: string[];
      minutes: string[];
      fromType?: string | null;
      fromHour?: number;
    }
  | null
  | undefined;

export class ClockEventHandler {
  private emitter: EventEmitter<TimepickerEventMap>;
  private getClockSystem: () => ClockSystem | null;
  private setHoursToClock: (value: string | null) => void;
  private setMinutesToClock: (value: string | null) => void;
  private updateAmPm: () => void;
  private convertDisabledTime: () => DisabledTimeConfig | null;

  constructor(
    emitter: EventEmitter<TimepickerEventMap>,
    getClockSystem: () => ClockSystem | null,
    setHoursToClock: (value: string | null) => void,
    setMinutesToClock: (value: string | null) => void,
    updateAmPm: () => void,
    convertDisabledTime: () => DisabledTimeConfig | null,
  ) {
    this.emitter = emitter;
    this.getClockSystem = getClockSystem;
    this.setHoursToClock = setHoursToClock;
    this.setMinutesToClock = setMinutesToClock;
    this.updateAmPm = updateAmPm;
    this.convertDisabledTime = convertDisabledTime;
  }

  setup(): void {
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

    this.emitter.on('animation:start', () => {
      this.getClockSystem()?.blockInteractions();
    });

    this.emitter.on('animation:end', () => {
      this.getClockSystem()?.unblockInteractions();
    });

    this.emitter.on('range:switch', (data) => {
      this.refreshDisabledTimeForRange(data.disabledTime);
    });
  }

  private refreshDisabledTimeForRange(rangeDisabled: RangeDisabledData): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    const baseDisabled = this.convertDisabledTime();
    let mergedDisabled: DisabledTimeConfig | null = baseDisabled;

    if (rangeDisabled) {
      const hours = [...(baseDisabled?.hours || []), ...(rangeDisabled.hours || [])];
      const minutes = [...(baseDisabled?.minutes || []), ...(rangeDisabled.minutes || [])];

      mergedDisabled = {
        ...baseDisabled,
        hours: hours.length > 0 ? hours : undefined,
        minutes: minutes.length > 0 ? minutes : undefined,
        rangeFromType: rangeDisabled.fromType,
        rangeFromHour: rangeDisabled.fromHour,
      };
    }

    clockSystem.updateDisabledTime(mergedDisabled);
  }
}

