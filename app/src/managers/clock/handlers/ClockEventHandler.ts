import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { RangeSwitchEventData } from '../../../types/types';
import type { ClockSystem } from '../ClockSystem';
import type { ClockMode, DisabledTimeConfig } from '../types';

type SetToClock = (value: string | null) => void;
type RangeDisabledData = RangeSwitchEventData['disabledTime'];

const firstAfterBlocked = (blocked: string[] = []): number | undefined => {
  const lastBlocked = blocked[blocked.length - 1];
  return lastBlocked === undefined ? undefined : parseInt(lastBlocked, 10) + 1;
};

export class ClockEventHandler {
  private emitter: EventEmitter<TimepickerEventMap>;
  private getClockSystem: () => ClockSystem | null;
  private setHoursToClock: SetToClock;
  private setMinutesToClock: SetToClock;
  private setSecondsToClock?: SetToClock;
  private updateAmPm: () => void;
  private convertDisabledTime: () => DisabledTimeConfig | null;

  constructor(
    emitter: EventEmitter<TimepickerEventMap>,
    getClockSystem: () => ClockSystem | null,
    setHoursToClock: SetToClock,
    setMinutesToClock: SetToClock,
    updateAmPm: () => void,
    convertDisabledTime: () => DisabledTimeConfig | null,
    setSecondsToClock?: SetToClock,
  ) {
    this.emitter = emitter;
    this.getClockSystem = getClockSystem;
    this.setHoursToClock = setHoursToClock;
    this.setMinutesToClock = setMinutesToClock;
    this.setSecondsToClock = setSecondsToClock;
    this.updateAmPm = updateAmPm;
    this.convertDisabledTime = convertDisabledTime;
  }

  setup(): void {
    this.emitter.on('select:hour', ({ hour }) => {
      this.showFace('hours', hour, this.setHoursToClock);
    });

    this.emitter.on('select:minute', ({ minutes }) => {
      this.showFace('minutes', minutes, this.setMinutesToClock);
    });

    this.emitter.on('select:second', ({ seconds }) => {
      this.showFace('seconds', seconds, this.setSecondsToClock);
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

  private showFace(mode: ClockMode, value: string, setToClock?: SetToClock): void {
    if (value && this.getClockSystem()?.setValueIfShown(mode, value)) return;

    this.emitter.emit('animation:clock', {});
    setToClock?.(value || null);
    this.emitter.emit('switch:face', { face: mode });
  }

  private refreshDisabledTimeForRange(rangeDisabled: RangeDisabledData): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    const baseDisabled = this.convertDisabledTime();

    if (!rangeDisabled) {
      clockSystem.updateDisabledTime(baseDisabled);
      return;
    }

    clockSystem.updateDisabledTime({
      ...baseDisabled,
      rangeFromType: rangeDisabled.fromType,
      rangeFromHour: rangeDisabled.fromHour,
      rangeFromMinute: rangeDisabled.fromMinute ?? firstAfterBlocked(rangeDisabled.minutes),
      rangeFromSecond: firstAfterBlocked(rangeDisabled.seconds),
    });
  }
}
