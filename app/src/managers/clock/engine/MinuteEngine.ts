import type { ClockType, AmPmType, DisabledTimeConfig, FaceContext, SixtyMode } from '../types';
import { isMinuteDisabled, isSecondDisabled } from '../../../utils/time/rules';
import { toDisabledRules } from './disabledRules';
import { isMinuteBeforeRangeFrom, isSecondBeforeRangeFrom } from './rangeLimit';

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
    showSeconds: boolean = false,
  ): boolean {
    if (!disabledTime) return false;

    return (
      isMinuteBeforeRangeFrom(value, hour, amPm, disabledTime, clockType) ||
      isMinuteDisabled(
        toDisabledRules(disabledTime, clockType),
        { hour, minutes: value, type: amPm || undefined },
        showSeconds,
      )
    );
  }

  static isUnitDisabled(unit: SixtyMode, value: string, context: FaceContext): boolean {
    const { hour, minute, amPm, disabledTime, clockType, showSeconds } = context;
    if (unit === 'minutes') return this.isDisabled(value, hour, amPm, disabledTime, clockType, showSeconds);
    if (!disabledTime) return false;

    return (
      isSecondBeforeRangeFrom(value, minute, hour, amPm, disabledTime, clockType) ||
      isSecondDisabled(toDisabledRules(disabledTime, clockType), {
        hour,
        minutes: minute,
        seconds: value,
        type: amPm || undefined,
      })
    );
  }

  static findNearestValidIndex(index: number, unit: SixtyMode, context: FaceContext): number {
    for (let offset = 0; offset < 60; offset++) {
      const candidates = offset === 0 ? [index] : [index + offset, index - offset];

      for (const candidate of candidates) {
        let testIndex = candidate;
        if (testIndex < 0) testIndex += 60;
        if (testIndex >= 60) testIndex = testIndex % 60;

        if (!this.isUnitDisabled(unit, this.indexToValue(testIndex), context)) {
          return testIndex;
        }
      }
    }

    return index;
  }
}
