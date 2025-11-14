import type { EngineInput, EngineOutput } from '../types';
import { AngleEngine } from './AngleEngine';
import { HourEngine } from './HourEngine';
import { MinuteEngine } from './MinuteEngine';

export class ClockEngine {
  static processPointerInput(input: EngineInput): EngineOutput {
    const rawAngle = AngleEngine.calculateRawAngle(input.pointerPosition, input.clockCenter);

    if (input.mode === 'hours') {
      return this.processHours(rawAngle, input);
    } else {
      return this.processMinutes(rawAngle, input);
    }
  }

  private static processHours(rawAngle: number, input: EngineInput): EngineOutput {
    const increment = input.incrementHours * 30;
    const snappedAngle = AngleEngine.snapToIncrement(rawAngle, increment);

    const distance = AngleEngine.calculateDistance(input.pointerPosition, input.clockCenter);
    const isInner = input.clockType === '24h' && AngleEngine.isInnerCircle(distance, input.clockRadius);

    let index = HourEngine.angleToIndex(snappedAngle, input.clockType, isInner);
    const value = HourEngine.indexToValue(index, input.clockType, input.amPm);

    const isDisabled = HourEngine.isDisabled(value, input.amPm, input.disabledTime);

    if (isDisabled) {
      index = HourEngine.findNearestValid(index, input.clockType, input.amPm, input.disabledTime, isInner);
    }

    const finalValue = HourEngine.indexToValue(index, input.clockType, input.amPm);
    const finalAngle = HourEngine.indexToAngle(index, input.clockType);

    return {
      angle: finalAngle,
      value: finalValue,
      index,
      isValid: !isDisabled,
      isInnerCircle: input.clockType === '24h' ? isInner : undefined,
    };
  }

  private static processMinutes(rawAngle: number, input: EngineInput): EngineOutput {
    const increment = input.incrementMinutes * 6;
    const snappedAngle = AngleEngine.snapToIncrement(rawAngle, increment);

    let index = MinuteEngine.angleToIndex(snappedAngle);
    const value = MinuteEngine.indexToValue(index);

    const currentHour = input.currentHour || '00';

    const isDisabled = MinuteEngine.isDisabled(
      value,
      currentHour,
      input.amPm,
      input.disabledTime,
      input.clockType,
    );

    if (isDisabled) {
      index = MinuteEngine.findNearestValid(
        index,
        currentHour,
        input.amPm,
        input.disabledTime,
        input.clockType,
      );
    }

    const finalValue = MinuteEngine.indexToValue(index);
    const finalAngle = MinuteEngine.indexToAngle(index);

    return {
      angle: finalAngle,
      value: finalValue,
      index,
      isValid: !isDisabled,
    };
  }

  static valueToAngle(value: string, mode: 'hours' | 'minutes', clockType: '12h' | '24h'): number {
    const numValue = parseInt(value, 10);

    if (mode === 'hours') {
      return HourEngine.indexToAngle(numValue, clockType);
    } else {
      return MinuteEngine.indexToAngle(numValue);
    }
  }
}
