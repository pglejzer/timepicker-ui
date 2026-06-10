import type { ClockType, AmPmType, DisabledTimeConfig } from '../types';
import { parseIntervalEdge } from '../../../utils/time/parse';

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

    if (disabledTime.rangeFromType !== undefined && disabledTime.rangeFromHour !== undefined) {
      return this.isDisabledForRange12h(value, hour, amPm, disabledTime);
    }

    if (disabledTime.rangeFromHour !== undefined) {
      const currentHour = parseInt(hour, 10);
      if (currentHour !== disabledTime.rangeFromHour) {
        return false;
      }
    }

    if (disabledTime.minutes) {
      return disabledTime.minutes.some(
        (m) => String(m) === value || Number(m) === Number(value) || m === value,
      );
    }

    return false;
  }

  private static isDisabledForRange12h(
    minute: string,
    hour: string,
    currentAmPm: AmPmType,
    disabledTime: DisabledTimeConfig,
  ): boolean {
    const fromType = disabledTime.rangeFromType;
    const fromHour = disabledTime.rangeFromHour;
    const toHour = parseInt(hour, 10);
    const toMinute = parseInt(minute, 10);

    if (fromType === null || fromHour === undefined) return false;

    const disabledMinutes = disabledTime.minutes || [];
    const fromMinute =
      disabledMinutes.length > 0 ? parseInt(disabledMinutes[disabledMinutes.length - 1], 10) + 1 : 0;

    if (currentAmPm === 'AM' && fromType === 'PM') {
      return true;
    }

    if (currentAmPm === 'PM' && fromType === 'AM') {
      return false;
    }

    const isSameHour =
      toHour === fromHour ||
      (toHour === 12 && fromHour === 12) ||
      (currentAmPm === fromType && toHour === fromHour);

    if (isSameHour) {
      return toMinute < fromMinute;
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
    const target = parseIntervalEdge(timeStr, clockType);

    for (const interval of disabledTime.intervals) {
      const [start, end] = interval.split('-').map((s) => s.trim());
      const startValue = parseIntervalEdge(start, clockType);
      const endValue = parseIntervalEdge(end, clockType);
      if (target >= startValue && target <= endValue) return true;
    }

    return false;
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
