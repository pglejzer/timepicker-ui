export type ClockType = '12h' | '24h';
export type AmPm = 'AM' | 'PM';

export interface Parsed12 {
  hour: string;
  minutes: string;
  type: AmPm;
}

export interface Parsed24 {
  hour: string;
  minutes: string;
}

export interface TimeValue {
  hour: string;
  minutes: string;
  type?: string;
}

const RE_12H = /^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i;
const RE_24H = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

export function parseTime12(input: string): Parsed12 | null {
  const match = input.match(RE_12H);
  if (!match) return null;
  return { hour: match[1], minutes: match[2], type: match[3].toUpperCase() as AmPm };
}

export function parseTime24(input: string): Parsed24 | null {
  const match = input.match(RE_24H);
  if (!match) return null;
  return { hour: match[1], minutes: match[2] };
}

export function timeToMinutes(value: TimeValue, clockType: ClockType): number {
  let hours = parseInt(value.hour, 10);
  const minutes = parseInt(value.minutes, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  if (clockType === '12h' && value.type) {
    const type = value.type.toUpperCase();
    if (type === 'PM' && hours !== 12) hours += 12;
    if (type === 'AM' && hours === 12) hours = 0;
  }

  return hours * 60 + minutes;
}

export function parseIntervalEdge(timeStr: string, clockType: ClockType): number {
  if (clockType === '12h') {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;
    return timeToMinutes({ hour: match[1], minutes: match[2], type: match[3] }, '12h');
  }
  const [h, m] = timeStr.split(':');
  return timeToMinutes({ hour: h ?? '0', minutes: m ?? '0' }, '24h');
}
