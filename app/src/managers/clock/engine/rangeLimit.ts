import { MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from '../../../utils/time/parse';
import type { AmPmType, ClockType, DisabledTimeConfig } from '../types';

type Period = string | null | undefined;

const HOURS_PER_PERIOD = 12;
const LAST_MINUTE_OF_HOUR = MINUTES_PER_HOUR - 1;
const LAST_SECOND_OF_MINUTE = SECONDS_PER_MINUTE - 1;

const toDayHour = (hour: number, period: Period, clockType: ClockType): number | null => {
  if (clockType === '24h') return hour;
  if (period === 'AM') return hour % HOURS_PER_PERIOD;
  if (period === 'PM') return (hour % HOURS_PER_PERIOD) + HOURS_PER_PERIOD;
  return null;
};

const toDaySecond = (
  hour: number,
  minute: number,
  second: number,
  period: Period,
  clockType: ClockType,
): number | null => {
  const dayHour = toDayHour(hour, period, clockType);
  return dayHour === null ? null : (dayHour * MINUTES_PER_HOUR + minute) * SECONDS_PER_MINUTE + second;
};

const isBeforeRangeFrom = (
  hour: number,
  minute: number,
  second: number,
  amPm: AmPmType,
  disabledTime: DisabledTimeConfig,
  clockType: ClockType,
): boolean => {
  const { rangeFromHour, rangeFromMinute = 0, rangeFromSecond = 0, rangeFromType } = disabledTime;
  if (rangeFromHour === undefined) return false;

  const from = toDaySecond(rangeFromHour, rangeFromMinute, rangeFromSecond, rangeFromType, clockType);
  const value = toDaySecond(hour, minute, second, amPm, clockType);
  return from !== null && value !== null && value < from;
};

export const isHourBeforeRangeFrom = (
  hour: string,
  amPm: AmPmType,
  disabledTime: DisabledTimeConfig,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(
    parseInt(hour, 10),
    LAST_MINUTE_OF_HOUR,
    LAST_SECOND_OF_MINUTE,
    amPm,
    disabledTime,
    clockType,
  );

export const isMinuteBeforeRangeFrom = (
  minute: string,
  hour: string,
  amPm: AmPmType,
  disabledTime: DisabledTimeConfig,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(
    parseInt(hour, 10),
    parseInt(minute, 10),
    LAST_SECOND_OF_MINUTE,
    amPm,
    disabledTime,
    clockType,
  );

export const isSecondBeforeRangeFrom = (
  second: string,
  minute: string,
  hour: string,
  amPm: AmPmType,
  disabledTime: DisabledTimeConfig,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10),
    amPm,
    disabledTime,
    clockType,
  );
