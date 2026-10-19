import type { DisabledRules } from '../../../utils/time/rules';
import type { ClockType, DisabledTimeConfig } from '../types';

const rulesCache = new WeakMap<DisabledTimeConfig, DisabledRules>();

export const toDisabledRules = (disabledTime: DisabledTimeConfig, clockType: ClockType): DisabledRules => {
  const resolvedClockType = disabledTime.clockType ?? clockType;
  const cached = rulesCache.get(disabledTime);
  if (cached && cached.clockType === resolvedClockType && cached.predicate === disabledTime.predicate) {
    return cached;
  }

  const rules: DisabledRules = {
    hours: disabledTime.hours,
    minutes: disabledTime.minutes,
    seconds: disabledTime.seconds,
    intervals: disabledTime.isInterval ? disabledTime.intervals : undefined,
    clockType: resolvedClockType,
    predicate: disabledTime.predicate,
  };
  rulesCache.set(disabledTime, rules);
  return rules;
};
