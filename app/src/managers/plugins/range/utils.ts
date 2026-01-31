import type { RangeValue, FormattedRange } from './types';

export function parseTimeString(str: string): RangeValue | null {
  if (!str || str === '--:--') return null;

  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    return {
      hour: match12[1],
      minutes: match12[2],
      type: match12[3].toUpperCase(),
    };
  }

  const match24 = str.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return {
      hour: match24[1],
      minutes: match24[2],
    };
  }

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

  let hours = parseInt(value.hour, 10);
  const minutes = parseInt(value.minutes, 10);

  if (clockType === '12h' && value.type) {
    if (value.type === 'PM' && hours !== 12) hours += 12;
    if (value.type === 'AM' && hours === 12) hours = 0;
  }

  return hours * 60 + minutes;
}

export function calculateDuration(
  fromValue: RangeValue | null,
  toValue: RangeValue | null,
  clockType: '12h' | '24h',
): number {
  if (!fromValue || !toValue) return 0;

  const fromMinutes = timeToMinutes(fromValue, clockType);
  let toMinutes = timeToMinutes(toValue, clockType);

  if (toMinutes <= fromMinutes) {
    toMinutes += 24 * 60;
  }

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

