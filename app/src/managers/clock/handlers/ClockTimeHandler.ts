import type { ClockSystem } from '../ClockSystem';
import type { SixtyMode } from '../types';

const SIXTY_FACES = {
  minutes: { set: 'setMinute', show: 'switchToMinutes' },
  seconds: { set: 'setSecond', show: 'switchToSeconds' },
} as const;

export class ClockTimeHandler {
  private getClockSystem: () => ClockSystem | null;
  private getAmPmValue: () => '' | 'AM' | 'PM';
  private getClockType: () => '12h' | '24h';

  constructor(
    getClockSystem: () => ClockSystem | null,
    getAmPmValue: () => '' | 'AM' | 'PM',
    getClockType: () => '12h' | '24h',
  ) {
    this.getClockSystem = getClockSystem;
    this.getAmPmValue = getAmPmValue;
    this.getClockType = getClockType;
  }

  setMinutesToClock(value: string | null): void {
    this.setSixtyToClock('minutes', value);
  }

  setSecondsToClock(value: string | null): void {
    this.setSixtyToClock('seconds', value);
  }

  setHoursToClock(value: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    if (value) {
      clockSystem.setHour(value);
    }

    clockSystem.switchToHours();
  }

  updateAmPm(): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem || this.getClockType() === '24h') return;
    const amPm = this.getAmPmValue();
    if (amPm !== '') {
      clockSystem.setAmPm(amPm);
    }
  }

  private setSixtyToClock(unit: SixtyMode, value: string | null): void {
    const clockSystem = this.getClockSystem();
    if (!clockSystem) return;

    const face = SIXTY_FACES[unit];

    if (value) {
      clockSystem[face.set](value);
    }

    clockSystem[face.show]();
  }
}
