import type { RangeValue } from './types';
import { parseTime, pad, timeToSeconds, SECONDS_PER_MINUTE, type ClockType } from '../../../utils/time/parse';

export const PART_PLACEHOLDER = '--';

export const isPlaceholder = (part: string): boolean => part.startsWith(PART_PLACEHOLDER);

export function getTimePlaceholder(showSeconds = false): string {
  return showSeconds ? '--:--:--' : '--:--';
}

export function parseTimeString(str: string, showSeconds = false): RangeValue | null {
  if (!str || isPlaceholder(str)) return null;
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

export function parseRangeInput(
  inputValue: string,
  showSeconds = false,
): { from: RangeValue | null; to: RangeValue | null } {
  if (!inputValue || !inputValue.includes(' - ')) {
    return { from: null, to: null };
  }

  const parts = inputValue.split(' - ').map((p) => p.trim());
  if (parts.length !== 2 || parts.some(isPlaceholder)) {
    return { from: null, to: null };
  }

  return {
    from: parseTimeString(parts[0], showSeconds),
    to: parseTimeString(parts[1], showSeconds),
  };
}
