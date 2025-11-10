import type { ClockType, AmPmType, DisabledTimeConfig } from '../types';
import { AngleEngine } from './AngleEngine';

export class MinuteEngine {
  static angleToIndex(angle: number): number {
    return Math.round(angle / 6) % 60;
  }

  static indexToValue(index: number): string {
    return index.toString().padStart(2, '0');
  }

  static indexToAngle(index: number): number {
    return (index % 60) * 6;
  }

  static isDisabled(
    value: string,
    hour: string,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
  ): boolean {
    if (!disabledTime) return false;

    if (disabledTime.isInterval && disabledTime.intervals) {
      return this.isDisabledByInterval(value, hour, amPm, disabledTime, clockType);
    }

    if (disabledTime.minutes) {
      return disabledTime.minutes.some(
        (m) => String(m) === value || Number(m) === Number(value) || m === value,
      );
    }

    return false;
  }

  private static isDisabledByInterval(
    minute: string,
    hour: string,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig,
    clockType: ClockType,
  ): boolean {
    if (!disabledTime.intervals) return false;

    const timeStr = clockType === '12h' ? `${hour}:${minute} ${amPm}` : `${hour}:${minute}`;

    for (const interval of disabledTime.intervals) {
      const [start, end] = interval.split('-').map((s) => s.trim());
      if (this.isTimeBetween(timeStr, start, end, clockType)) {
        return true;
      }
    }

    return false;
  }

  private static isTimeBetween(time: string, start: string, end: string, clockType: ClockType): boolean {
    const timeValue = this.timeToMinutes(time, clockType);
    const startValue = this.timeToMinutes(start, clockType);
    const endValue = this.timeToMinutes(end, clockType);

    return timeValue >= startValue && timeValue <= endValue;
  }

  private static timeToMinutes(time: string, clockType: ClockType): number {
    if (clockType === '12h') {
      const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return 0;

      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    } else {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }

  static findNearestValid(
    index: number,
    hour: string,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
  ): number {
    for (let offset = 0; offset < 60; offset++) {
      const candidates = offset === 0 ? [index] : [index + offset, index - offset];

      for (const candidate of candidates) {
        let testIndex = candidate;
        if (testIndex < 0) testIndex += 60;
        if (testIndex >= 60) testIndex = testIndex % 60;

        const value = this.indexToValue(testIndex);
        if (!this.isDisabled(value, hour, amPm, disabledTime, clockType)) {
          return testIndex;
        }
      }
    }

    return index;
  }
}

