import type { ClockSystem } from '../ClockSystem';
import type { ClockStyleHandler } from './ClockStyleHandler';

export class ClockTimeHandler {
  private getClockSystem: () => ClockSystem | null;
  private styleHandler: ClockStyleHandler;
  private getAmPmValue: () => '' | 'AM' | 'PM';
  private clockType: '12h' | '24h';

  constructor(
    getClockSystem: () => ClockSystem | null,
    styleHandler: ClockStyleHandler,
    getAmPmValue: () => '' | 'AM' | 'PM',
    clockType: '12h' | '24h',
  ) {
    this.getClockSystem = getClockSystem;
    this.styleHandler = styleHandler;
    this.getAmPmValue = getAmPmValue;
    this.clockType = clockType;
  }

  setMinutesToClock(value: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    this.styleHandler.removeBgColorToCirleWithMinutesTips();

    if (value) {
      clockSystem.setMinute(value);
    }

    clockSystem.switchToMinutes();
  }

  setHoursToClock(value: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    if (value) {
      clockSystem.setHour(value);
    }

    clockSystem.switchToHours();
  }

  setTransformToCircleWithSwitchesHour(val: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem || !val) return;
    clockSystem.setHour(val);
  }

  setTransformToCircleWithSwitchesMinutes(val: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem || !val) return;
    clockSystem.setMinute(val);
  }

  updateAmPm(): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem || this.clockType === '24h') return;
    const amPm = this.getAmPmValue();
    if (amPm !== '') {
      clockSystem.setAmPm(amPm);
    }
  }
}

