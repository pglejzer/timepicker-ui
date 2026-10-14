import type { ClockType, AmPmType, DisabledTimeConfig } from '../types';
import { isHourDisabled, isHourOnIncrement } from '../../../utils/time/rules';
import { toDisabledRules } from './disabledRules';
import { isHourBeforeRangeFrom } from './rangeLimit';

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

  static indexToValue(index: number, clockType: ClockType): string {
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

  static isDisabled(
    value: string,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
    showSeconds: boolean = false,
  ): boolean {
    if (!disabledTime) return false;

    return (
      isHourBeforeRangeFrom(value, amPm, disabledTime, clockType) ||
      isHourDisabled(
        toDisabledRules(disabledTime, clockType),
        { hour: value, type: amPm || undefined },
        showSeconds,
      )
    );
  }

  static findNearestValid(
    index: number,
    clockType: ClockType,
    amPm: AmPmType,
    disabledTime: DisabledTimeConfig | null,
    showSeconds: boolean = false,
    incrementHours: number = 1,
  ): number {
    const maxHour = clockType === '24h' ? 23 : 12;

    for (let offset = 0; offset <= maxHour; offset++) {
      const candidates = offset === 0 ? [index] : [index + offset, index - offset];

      for (const candidate of candidates) {
        let testIndex = candidate;
        if (testIndex < 0) testIndex += maxHour + 1;
        if (testIndex > maxHour) testIndex = testIndex % (maxHour + 1);

        const value = this.indexToValue(testIndex, clockType);
        if (
          isHourOnIncrement(testIndex, incrementHours) &&
          !this.isDisabled(value, amPm, disabledTime, clockType, showSeconds)
        ) {
          return testIndex;
        }
      }
    }

    return index;
  }
}
