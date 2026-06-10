import type { RangeValue, FormattedRange } from './types';
import { parseTime12, parseTime24, timeToMinutes as sharedTimeToMinutes } from '../../../utils/time/parse';

export function parseTimeString(str: string): RangeValue | null {
  if (!str || str === '--:--') return null;
  const r12 = parseTime12(str);
  if (r12) return { hour: r12.hour, minutes: r12.minutes, type: r12.type };
  const lax12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (lax12) return { hour: lax12[1], minutes: lax12[2], type: lax12[3].toUpperCase() };
  const r24 = parseTime24(str);
  if (r24) return { hour: r24.hour, minutes: r24.minutes };
  const lax24 = str.match(/^(\d{1,2}):(\d{2})$/);
  if (lax24) return { hour: lax24[1], minutes: lax24[2] };
  return null;
}

export function formatDisplayTime(value: RangeValue): string {
  const mins = value.minutes === '--' ? '--' : value.minutes.padStart(2, '0');
  const time = `${value.hour}:${mins}`;
  return value.type ? `${time} ${value.type}` : time;
}

export function formatOutputTime(value: RangeValue): string {
  const time = `${value.hour.padStart(2, '0')}:${value.minutes.padStart(2, '0')}`;
  return value.type ? `${time} ${value.type}` : time;
}

export function timeToMinutes(value: RangeValue | null, clockType: '12h' | '24h'): number {
  if (!value) return 0;
  return sharedTimeToMinutes(value, clockType);
}

export function calculateDuration(
  fromValue: RangeValue | null,
  toValue: RangeValue | null,
  clockType: '12h' | '24h',
): number {
  if (!fromValue || !toValue) return 0;

  const fromMinutes = timeToMinutes(fromValue, clockType);
  const toMinutes = timeToMinutes(toValue, clockType);

  return toMinutes - fromMinutes;
}

export function isValueComplete(value: RangeValue | null, clockType: '12h' | '24h'): boolean {
  if (!value) return false;

  if (clockType === '12h') {
    return !!(value.hour && value.minutes && value.type);
  }

  return !!(value.hour && value.minutes);
}

export function formatRange(fromValue: RangeValue | null, toValue: RangeValue | null): FormattedRange | null {
  if (!fromValue || !toValue) return null;

  return {
    from: formatOutputTime(fromValue),
    to: formatOutputTime(toValue),
  };
}

export function parseRangeInput(inputValue: string): { from: RangeValue | null; to: RangeValue | null } {
  if (!inputValue || !inputValue.includes(' - ')) {
    return { from: null, to: null };
  }

  const parts = inputValue.split(' - ').map((p) => p.trim());
  if (parts.length !== 2 || parts[0] === '--:--' || parts[1] === '--:--') {
    return { from: null, to: null };
  }

  return {
    from: parseTimeString(parts[0]),
    to: parseTimeString(parts[1]),
  };
}
