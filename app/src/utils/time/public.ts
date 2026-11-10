import type { ClockOptions, TimeOfDay } from '../../types/options';
import { sanitizeTimeInput } from '../validation';
import { resolveAliases } from '../options/aliases';
import { toClockType } from '../options/predicates';
import {
  formatTime as formatTimeValue,
  fromHours24,
  pad,
  resolveTime,
  type ClockType,
  type TimeValue,
} from './parse';
import { buildDisabledRules, resolveDisabledTime, validateDisabledTime } from './disable';
import { isUnitDisabled } from './rules';

export type { TimeValue } from './parse';

/** Clock format for `parseTime()` and `formatTime()`. */
export interface TimeFormatOptions {
  /** @default '12h' */
  clockType?: '12h' | '24h';
  /** @default false */
  showSeconds?: boolean;
}

/** Clock options `createDisabledTimeCheck()` reads. */
export type DisabledTimeCheckOptions = Pick<
  ClockOptions,
  'type' | 'disabledTime' | 'isTimeDisabled' | 'showSeconds'
>;

const MAX_HOUR = 23;
const MAX_SIXTY = 59;

const toFormat = (
  options: TimeFormatOptions | undefined,
): { clockType: ClockType; showSeconds: boolean } => ({
  clockType: toClockType(options?.clockType),
  showSeconds: !!options?.showSeconds,
});

const withoutEmptyParts = (value: TimeValue): TimeValue => {
  const result: TimeValue = { hour: value.hour, minutes: value.minutes };
  if (value.seconds !== undefined) result.seconds = value.seconds;
  if (value.type !== undefined) result.type = value.type;
  return result;
};

const inRange = (value: number, max: number): boolean =>
  Number.isInteger(value) && value >= 0 && value <= max;

const isTimeOfDay = (time: TimeOfDay): boolean =>
  inRange(time.hour, MAX_HOUR) && inRange(time.minutes, MAX_SIXTY) && inRange(time.seconds, MAX_SIXTY);

/**
 * Parse a time the way `setValue()` does: "14:30", "2:30 PM", with seconds when `showSeconds` is on.
 * A valid time in the other clock format is converted ("2:30 PM" gives 14:30 in 24h).
 * Needs no picker and no DOM, so it also runs on the server.
 * @returns The time in `clockType`, or `null` when the text is not a time.
 * @example
 * parseTime('2:30 PM', { clockType: '24h' }); // { hour: '14', minutes: '30' }
 */
export function parseTime(text: string, options?: TimeFormatOptions): TimeValue | null {
  if (typeof text !== 'string') return null;
  const resolved = resolveTime(sanitizeTimeInput(text.trim()), toFormat(options));
  return resolved && withoutEmptyParts(resolved.value);
}

/**
 * Format a time as the picker writes it to the input ("14:30", "02:30 PM", "14:30:05").
 * @example
 * formatTime({ hour: '2', minutes: '30', type: 'PM' }); // '02:30 PM'
 */
export function formatTime(value: TimeValue, options?: TimeFormatOptions): string {
  return formatTimeValue(value, toFormat(options));
}

/**
 * Build a check that tells whether a time is disabled by `clock.disabledTime` (hours, minutes and seconds
 * lists, `ranges` with edges in the format of `type`) and `clock.isTimeDisabled`, with the same rules as a
 * mounted picker. Needs no picker and no DOM. `type: 'auto'` uses the browser locale.
 * `TimeOfDay.hour` is 0-23 in both clock types; 12h list values (`hours: [12]`) mean the clock numbers.
 * Results of `isTimeDisabled` are cached: build a new check after the data behind it changes.
 * @throws When `disabledTime` is invalid, with the message a picker reports through `error`.
 * @returns A function that returns `true` for a disabled time, and for text that is not a time.
 * @example
 * const isDisabled = createDisabledTimeCheck({ type: '24h', disabledTime: { ranges: ['12:00 - 13:00'] } });
 * isDisabled('12:30'); // true
 * isDisabled({ hour: 9, minutes: 0, seconds: 0 }); // false
 */
export function createDisabledTimeCheck(
  options: DisabledTimeCheckOptions,
): (time: string | TimeOfDay) => boolean {
  const resolved = resolveAliases({ clock: { ...options } }).clock ?? {};
  const clockType = toClockType(resolved.type);
  const showSeconds = !!resolved.showSeconds;
  const clock = { ...resolved, type: clockType };

  validateDisabledTime(clock);
  const rules = buildDisabledRules(resolveDisabledTime(clock)?.value, clockType);
  const unit = showSeconds ? 'seconds' : 'minutes';

  const toValue = (time: string | TimeOfDay): TimeValue | null => {
    if (typeof time === 'string') return parseTime(time, { clockType, showSeconds });
    if (!time || !isTimeOfDay(time)) return null;
    const seconds = showSeconds ? pad(time.seconds) : undefined;
    return fromHours24(time.hour, { minutes: pad(time.minutes), seconds }, clockType);
  };

  return (time) => {
    const value = toValue(time);
    return !value || isUnitDisabled(rules, unit, value, showSeconds);
  };
}
