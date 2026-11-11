import type { RangeValue } from './types';
import {
  parseTime,
  pad,
  timeToSeconds,
  isTimePlaceholder,
  getTimePlaceholder,
  SECONDS_PER_MINUTE,
  type ClockType,
} from '../../../utils/time/parse';

export {
  TIME_PLACEHOLDER_PREFIX as PART_PLACEHOLDER,
  isTimePlaceholder as isPlaceholder,
  getTimePlaceholder,
} from '../../../utils/time/parse';

export function parseTimeString(str: string, showSeconds = false): RangeValue | null {
  if (!str || isTimePlaceholder(str)) return null;
  const parseAs = (clockType: ClockType): RangeValue | null => parseTime(str, { clockType, showSeconds });
  return parseAs('12h') ?? parseAs('24h');
}

export function formatDisplayTime(value: RangeValue, showSeconds = false): string {
  const time = `${value.hour}:${pad(value.minutes)}`;
  const withSeconds = showSeconds ? `${time}:${pad(value.seconds ?? '0')}` : time;
  return value.type ? `${withSeconds} ${value.type}` : withSeconds;
}

export function formatRangePart(value: RangeValue | null, showSeconds = false): string {
  return value ? formatDisplayTime(value, showSeconds) : getTimePlaceholder(showSeconds);
}

export function calculateDurationSeconds(
  fromValue: RangeValue | null,
  toValue: RangeValue | null,
  clockType: '12h' | '24h',
): number {
  if (!fromValue || !toValue) return 0;

  return timeToSeconds(toValue, clockType) - timeToSeconds(fromValue, clockType);
}

export function calculateDuration(
  fromValue: RangeValue | null,
  toValue: RangeValue | null,
  clockType: '12h' | '24h',
): number {
  return Math.floor(calculateDurationSeconds(fromValue, toValue, clockType) / SECONDS_PER_MINUTE);
}

export function isValueComplete(value: RangeValue | null, clockType: '12h' | '24h'): boolean {
  if (!value) return false;

  if (clockType === '12h') {
    return !!(value.hour && value.minutes && value.type);
  }

  return !!(value.hour && value.minutes);
}

const sameNumber = (a: string | undefined, b: string | undefined): boolean =>
  a === b || Number(a ?? 0) === Number(b ?? 0);

export function isSameValue(a: RangeValue | null, b: RangeValue | null): boolean {
  if (!a || !b) return a === b;
  return (
    sameNumber(a.hour, b.hour) &&
    sameNumber(a.minutes, b.minutes) &&
    sameNumber(a.seconds, b.seconds) &&
    (a.type ?? '') === (b.type ?? '')
  );
}

export function parseRangeInput(
  inputValue: string,
  showSeconds = false,
): { from: RangeValue | null; to: RangeValue | null } {
  if (!inputValue || !inputValue.includes(' - ')) {
    return { from: null, to: null };
  }

  const parts = inputValue.split(' - ').map((p) => p.trim());
  if (parts.length !== 2) {
    return { from: null, to: null };
  }

  return {
    from: parseTimeString(parts[0], showSeconds),
    to: parseTimeString(parts[1], showSeconds),
  };
}
