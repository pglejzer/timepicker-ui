import type { TimeOfDay } from '../../types/options';
import { rethrowLater } from '../errors/rethrowLater';
import { MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from './parse';

const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const HOURS_PER_DAY = 24;

export type TimePredicate = ((secondOfDay: number) => boolean) & { clear(): void };

const toTimeOfDay =(secondOfDay: number): TimeOfDay => ({
  hour: Math.floor(secondOfDay / SECONDS_PER_HOUR) % HOURS_PER_DAY,
  minutes: Math.floor(secondOfDay / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR,
  seconds: secondOfDay % SECONDS_PER_MINUTE,
});

const evaluate = (fn: (time: TimeOfDay) => boolean, secondOfDay: number): boolean => {
  try {
    return !!fn(toTimeOfDay(secondOfDay));
  } catch (error) {
    rethrowLater(error);
    return false;
  }
};

export function createTimePredicate(fn: (time: TimeOfDay) => boolean): TimePredicate {
  const cache = new Map<number, boolean>();

  const predicate = (secondOfDay: number): boolean => {
    const cached = cache.get(secondOfDay);
    if (cached !== undefined) return cached;

    const result = evaluate(fn, secondOfDay);
    cache.set(secondOfDay, result);
    return result;
  };

  return Object.assign(predicate, { clear: (): void => cache.clear() });
}
