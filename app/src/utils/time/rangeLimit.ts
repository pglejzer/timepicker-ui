import type { RangeSwitchEventData } from '../../types/types';
import { MINUTES_PER_HOUR, SECONDS_PER_MINUTE, type ClockType } from './parse';

type Period = string | null | undefined;

export interface RangeFromLimit {
  rangeFromHour?: number;
  rangeFromMinute?: number;
  rangeFromSecond?: number;
  rangeFromType?: string | null;
}

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
  period: Period,
  limit: RangeFromLimit,
  clockType: ClockType,
): boolean => {
  const { rangeFromHour, rangeFromMinute = 0, rangeFromSecond = 0, rangeFromType } = limit;
  if (rangeFromHour === undefined) return false;

  const from = toDaySecond(rangeFromHour, rangeFromMinute, rangeFromSecond, rangeFromType, clockType);
  const value = toDaySecond(hour, minute, second, period, clockType);
  return from !== null && value !== null && value < from;
};

export const isHourBeforeRangeFrom = (
  hour: string,
  period: Period,
  limit: RangeFromLimit,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(parseInt(hour, 10), LAST_MINUTE_OF_HOUR, LAST_SECOND_OF_MINUTE, period, limit, clockType);

export const isMinuteBeforeRangeFrom = (
  minute: string,
  hour: string,
  period: Period,
  limit: RangeFromLimit,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(
    parseInt(hour, 10),
    parseInt(minute, 10),
    LAST_SECOND_OF_MINUTE,
    period,
    limit,
    clockType,
  );

export const isSecondBeforeRangeFrom = (
  second: string,
  minute: string,
  hour: string,
  period: Period,
  limit: RangeFromLimit,
  clockType: ClockType,
): boolean =>
  isBeforeRangeFrom(parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), period, limit, clockType);

const firstAfterBlocked = (blocked: string[] = []): number | undefined => {
  const lastBlocked = blocked[blocked.length - 1];
  return lastBlocked === undefined ? undefined : parseInt(lastBlocked, 10) + 1;
};

export const toRangeFromLimit = (
  disabledTime: RangeSwitchEventData['disabledTime'],
): RangeFromLimit | null => {
  if (!disabledTime) return null;

  return {
    rangeFromType: disabledTime.fromType,
    rangeFromHour: disabledTime.fromHour,
    rangeFromMinute: disabledTime.fromMinute ?? firstAfterBlocked(disabledTime.minutes),
    rangeFromSecond: firstAfterBlocked(disabledTime.seconds),
  };
};
