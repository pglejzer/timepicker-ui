export type ClockType = '12h' | '24h';

export interface TimeValue {
  hour: string;
  minutes: string;
  seconds?: string;
  type?: string;
}

export interface TimeFormatOptions {
  clockType: ClockType;
  showSeconds?: boolean;
}

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const DEGREES_PER_HOUR = 30;
export const DEGREES_PER_SIXTY = 6;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const RE_TIME_12H = /^(0?[1-9]|1[0-2]):([0-5]?\d)(?::([0-5]?\d))?\s*(AM|PM)$/i;
const RE_TIME_24H = /^([01]?\d|2[0-3]):([0-5]?\d)(?::([0-5]?\d))?$/;
const RE_HAS_SECONDS = /^\s*\d{1,2}:\d{1,2}:\d{1,2}/;

export const pad = (value: string | number): string => String(value).padStart(2, '0');

export function parseTime(text: string, options: TimeFormatOptions): TimeValue | null {
  const match = text.trim().match(options.clockType === '12h' ? RE_TIME_12H : RE_TIME_24H);
  if (!match) return null;
  const value: TimeValue = { hour: pad(match[1]), minutes: pad(match[2]) };
  if (options.showSeconds) value.seconds = pad(match[3] ?? '0');
  if (options.clockType === '12h') value.type = match[4].toUpperCase();
  return value;
}

export function hasSeconds(text: string): boolean {
  return RE_HAS_SECONDS.test(text);
}

export function formatTime(value: TimeValue, options: TimeFormatOptions): string {
  const base = `${pad(value.hour)}:${pad(value.minutes)}`;
  const time = options.showSeconds ? `${base}:${pad(value.seconds ?? '0')}` : base;
  return options.clockType === '12h' && value.type ? `${time} ${value.type}` : time;
}

const to24Hour = (hours: number, type: string | undefined, clockType: ClockType): number => {
  if (clockType !== '12h' || !type) return hours;
  const period = type.toUpperCase();
  if (period === 'PM' && hours !== 12) return hours + 12;
  if (period === 'AM' && hours === 12) return 0;
  return hours;
};

export function fromHours24(
  hours24: number,
  rest: Pick<TimeValue, 'minutes' | 'seconds'>,
  clockType: ClockType,
): TimeValue {
  if (clockType === '24h') return { hour: pad(hours24), ...rest, type: undefined };
  return { hour: pad(hours24 % 12 || 12), ...rest, type: hours24 >= 12 ? 'PM' : 'AM' };
}

export function convertTime(value: TimeValue, from: ClockType, to: TimeFormatOptions): TimeValue {
  const hours24 = to24Hour(parseInt(value.hour, 10), value.type, from);
  const seconds = to.showSeconds ? pad(value.seconds ?? '0') : undefined;
  return fromHours24(hours24, { minutes: value.minutes, seconds }, to.clockType);
}

export function hourToSeconds(value: Pick<TimeValue, 'hour' | 'type'>, clockType: ClockType): number {
  const hours = parseInt(value.hour, 10);
  if (Number.isNaN(hours)) return 0;
  return to24Hour(hours, value.type, clockType) * SECONDS_PER_HOUR;
}

export function timeToSeconds(value: TimeValue, clockType: ClockType): number {
  const hours = parseInt(value.hour, 10);
  const minutes = parseInt(value.minutes, 10);
  const seconds = parseInt(value.seconds ?? '0', 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) return 0;

  return to24Hour(hours, value.type, clockType) * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
}

export function timeToMinutes(value: TimeValue, clockType: ClockType): number {
  return Math.floor(timeToSeconds(value, clockType) / SECONDS_PER_MINUTE);
}

export function clockDegrees(value: Pick<TimeValue, 'hour' | 'minutes'>): {
  degreesHours: number;
  degreesMinutes: number;
} {
  return {
    degreesHours: Number(value.hour) * DEGREES_PER_HOUR,
    degreesMinutes: Number(value.minutes) * DEGREES_PER_SIXTY,
  };
}
