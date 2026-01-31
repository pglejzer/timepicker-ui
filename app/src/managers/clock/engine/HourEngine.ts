import type { ClockType, AmPmType, DisabledTimeConfig } from '../types';

export class HourEngine {
  static angleToIndex(angle: number, clockType: ClockType, isInnerCircle: boolean): number {
    const baseIndex = Math.round(angle / 30) % 12;

    if (clockType === '24h') {
      if (isInnerCircle) {
        const hour = baseIndex + 12;
        return hour === 12 ? 0 : hour;
      } else {
        return baseIndex === 0 ? 12 : baseIndex;
      }
    }

    return baseIndex === 0 ? 12 : baseIndex;
  }

  static indexToValue(index: number, clockType: ClockType, amPm: AmPmType): string {
    if (clockType === '24h') {
      return index.toString().padStart(2, '0');
    }

    let hour = index;
    if (hour === 0) hour = 12;
    if (hour > 12) hour = hour - 12;

    return hour.toString().padStart(2, '0');
  }

  static indexToAngle(index: number, clockType: ClockType): number {
    if (clockType === '24h') {
      if (index >= 12) {
        return ((index - 12) % 12) * 30;
      } else {
        return (index % 12) * 30;
      }
    }

    const hour = index === 0 ? 12 : index;
    return (hour % 12) * 30;
  }

  static isDisabled(value: string, amPm: AmPmType, disabledTime: DisabledTimeConfig | null): boolean {
    if (!disabledTime) return false;

    if (disabledTime.isInterval && disabledTime.intervals && disabledTime.clockType) {
      return this.isDisabledByInterval(value, amPm, disabledTime);
    }

    if (disabledTime.rangeFromType !== undefined && disabledTime.rangeFromHour !== undefined) {
      return this.isDisabledForRange12h(value, amPm, disabledTime);
    }

    if (disabledTime.hours) {
      return disabledTime.hours.some(
        (h) => String(h) === value || Number(h) === Number(value) || h === value,
      );
    }

    return false;
  }

  private static isDisabledForRange12h(
    value: string,
    currentAmPm: AmPmType,
    disabledTime: DisabledTimeConfig,
  ): boolean {
    const fromType = disabledTime.rangeFromType;
    const fromHour = disabledTime.rangeFromHour;
    const toHour = parseInt(value, 10);

    if (fromType === null || fromHour === undefined) return false;

    if (currentAmPm === 'AM' && fromType === 'PM') {
      return true;
    }

    if (currentAmPm === 'AM' && fromType === 'AM') {
      if (fromHour === 12) {
        return false;
      }
      if (toHour === 12) {
        return true;
      }
      return toHour < fromHour;
    }

    if (currentAmPm === 'PM' && fromType === 'AM') {
      return false;
    }

    if (currentAmPm === 'PM' && fromType === 'PM') {
      if (fromHour === 12) {
        return false;
      }
      if (toHour === 12) {
        return true;
      }
      return toHour < fromHour;
    }

    return false;
  }

  private static isDisabledByInterval(
    hour: string,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig,
  ): boolean {
    if (!disabledTime.intervals) return false;

    for (let minute = 0; minute < 60; minute++) {
      const minuteStr = minute.toString().padStart(2, '0');
      if (!this.isTimeInIntervals(hour, minuteStr, amPm, disabledTime.intervals, disabledTime.clockType!)) {
        return false;
      }
    }

    return true;
  }

  private static isTimeInIntervals(
    hour: string,
    minute: string,
    amPm: AmPmType,
    intervals: string[],
    clockType: ClockType,
  ): boolean {
    const timeStr = clockType === '12h' ? `${hour}:${minute} ${amPm}` : `${hour}:${minute}`;

    for (const interval of intervals) {
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
    clockType: ClockType,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig | null,
    isInnerCircle: boolean,
  ): number {
    const maxHour = clockType === '24h' ? 23 : 12;

    for (let offset = 0; offset <= maxHour; offset++) {
      const candidates = offset === 0 ? [index] : [index + offset, index - offset];

      for (const candidate of candidates) {
        let testIndex = candidate;
        if (testIndex < 0) testIndex += maxHour + 1;
        if (testIndex > maxHour) testIndex = testIndex % (maxHour + 1);

        const value = this.indexToValue(testIndex, clockType, amPm);
        if (!this.isDisabled(value, amPm, disabledTime)) {
          return testIndex;
        }
      }
    }

    return index;
  }
}
