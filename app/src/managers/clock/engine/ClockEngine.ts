import type { ClockMode, ClockType, EngineInput, EngineOutput, FaceContext, SixtyMode } from '../types';
import { AngleEngine } from './AngleEngine';
import { HourEngine } from './HourEngine';
import { MinuteEngine } from './MinuteEngine';

export class ClockEngine {
  static processPointerInput(input: EngineInput): EngineOutput {
    const rawAngle = AngleEngine.calculateRawAngle(input.pointerPosition, input.clockCenter);

    if (input.mode === 'hours') {
      return this.processHours(rawAngle, input);
    } else {
      return this.processSixty(rawAngle, input, input.mode);
    }
  }

  private static processHours(rawAngle: number, input: EngineInput): EngineOutput {
    const snappedAngle = AngleEngine.snapToIncrement(rawAngle, input.incrementHours * 30);

    const distance = AngleEngine.calculateDistance(input.pointerPosition, input.clockCenter);
    const isInner = input.clockType === '24h' && AngleEngine.isInnerCircle(distance, input.clockRadius);

    let index = HourEngine.angleToIndex(snappedAngle, input.clockType, isInner);
    const value = HourEngine.indexToValue(index, input.clockType);

    const isDisabled = HourEngine.isDisabled(
      value,
      input.amPm,
      input.disabledTime,
      input.clockType,
      input.showSeconds,
    );

    if (isDisabled) {
      index = HourEngine.findNearestValid(
        index,
        input.clockType,
        input.amPm,
        input.disabledTime,
        input.showSeconds,
        input.incrementHours,
      );
    }

    return {
      angle: input.smoothHourSnap === false ? HourEngine.indexToAngle(index, input.clockType) : rawAngle,
      value: HourEngine.indexToValue(index, input.clockType),
      index,
      isValid: !isDisabled,
      isInnerCircle: input.clockType === '24h' ? isInner : undefined,
    };
  }

  private static processSixty(rawAngle: number, input: EngineInput, unit: SixtyMode): EngineOutput {
    const step = unit === 'seconds' ? (input.incrementSeconds ?? 1) : input.incrementMinutes;
    const snappedAngle = AngleEngine.snapToIncrement(rawAngle, step * 6);

    let index = MinuteEngine.angleToIndex(snappedAngle);

    const context: FaceContext = {
      hour: input.currentHour || '00',
      minute: input.currentMinute || '00',
      amPm: input.amPm,
      disabledTime: input.disabledTime,
      clockType: input.clockType,
      showSeconds: input.showSeconds,
    };

    const isDisabled = MinuteEngine.isUnitDisabled(unit, MinuteEngine.indexToValue(index), context);

    if (isDisabled) {
      index = MinuteEngine.findNearestValidIndex(index, unit, context);
    }

    return {
      angle: MinuteEngine.indexToAngle(index),
      value: MinuteEngine.indexToValue(index),
      index,
      isValid: !isDisabled,
    };
  }

  static valueToAngle(value: string, mode: ClockMode, clockType: ClockType): number {
    const numValue = parseInt(value, 10);

    if (mode === 'hours') {
      return HourEngine.indexToAngle(numValue, clockType);
    } else {
      return MinuteEngine.indexToAngle(numValue);
    }
  }
}
