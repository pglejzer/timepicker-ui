import type { ClockType } from './parse';

export const localeClockType = (): ClockType =>
  new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12 ? '12h' : '24h';
