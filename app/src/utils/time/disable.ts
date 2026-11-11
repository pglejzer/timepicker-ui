import { isOverlappingRangeArray } from '../config';
import { handleValueAndCheck } from '../input';
import { TimepickerError, ERROR_CODES } from '../errors';
import { pad, type ClockType } from './parse';
import { createTimePredicate, type TimePredicate } from './predicate';
import type { DisabledRules } from './rules';
import { toClockType } from '../options/predicates';
import type { ClockOptions, TimepickerOptions } from '../../types/options';

export interface DisabledTimeValue {
  isInterval?: boolean;
  intervals?: string[];
  clockType?: string;
  hours?: string[];
  minutes?: string[];
  seconds?: string[];
  predicate?: TimePredicate;
}

export type DisabledTimeSource = Pick<ClockOptions, 'type' | 'disabledTime' | 'isTimeDisabled'>;

const toSixtyList = (
  values: ReadonlyArray<string | number> | undefined,
  unit: 'minutes' | 'seconds',
): string[] | undefined => {
  values?.forEach((value) => {
    if (Number(value) > 59) {
      throw new Error(`The disabled ${unit} value has to be less than 60`);
    }
  });
  return values?.map((value) => pad(Number(value)));
};

export const createDisabledTimeFromClock = (
  clock: DisabledTimeSource,
): { value: DisabledTimeValue } | undefined => {
  const { disabledTime, type: clockType } = clock;

  if (!disabledTime || !Object.keys(disabledTime).length) return;

  const { hours, minutes, seconds, interval } = disabledTime;

  if (interval) {
    const intervals = Array.isArray(interval) ? interval : [interval];

    if (!clockType) {
      throw new Error('clockType required for disabledTime.ranges');
    }

    isOverlappingRangeArray(intervals, toClockType(clockType));

    return { value: { isInterval: true, clockType, intervals } };
  }

  hours?.forEach((e: number | string) => {
    if (clockType === '12h' && Number(e) > 12) {
      throw new Error('The disabled hours value has to be less than 13');
    }
    if (clockType === '24h' && Number(e) > 23) {
      throw new Error('The disabled hours value has to be less than 24');
    }
  });

  const disabledMinutes = toSixtyList(minutes, 'minutes');
  const disabledSeconds = toSixtyList(seconds, 'seconds');

  return {
    value: {
      hours: hours?.map((e: number | string) =>
        e === '00' || Number(e) === 0 ? `0${Number(e)}` : `${Number(e)}`,
      ),
      minutes: disabledMinutes,
      seconds: disabledSeconds,
    },
  };
};

export const createDisabledTime = (options: Required<TimepickerOptions>) =>
  options ? createDisabledTimeFromClock(options.clock) : undefined;

export function resolveDisabledTime(clock: DisabledTimeSource): { value: DisabledTimeValue } | null {
  const disabledTime = createDisabledTimeFromClock(clock) || null;
  const { isTimeDisabled } = clock;
  if (typeof isTimeDisabled !== 'function') return disabledTime;

  return { value: { ...disabledTime?.value, predicate: createTimePredicate(isTimeDisabled) } };
}

export const buildDisabledRules = (
  value: DisabledTimeValue | undefined,
  clockType: ClockType,
): DisabledRules | null => (value ? { ...value, clockType } : null);

export const checkDisabledHoursAndMinutes = (
  value: (string | number)[] | string | number | undefined,
  type: 'hour' | 'minutes',
  clockType?: '12h' | '24h',
  arrValue?: (string | number)[],
) => {
  if (!value) return;

  if (Array.isArray(value)) {
    const checkArr = value.map((e) => handleValueAndCheck(e, type, clockType));

    if (checkArr.some((e) => e === false)) {
      return false;
    }

    return true;
  } else if (typeof value === 'string' || typeof value === 'number') {
    const isValid = handleValueAndCheck(value, type, clockType);

    const isIncludes = arrValue?.map(Number).includes(Number(value));

    if (isValid && !isIncludes) {
      return true;
    }

    return false;
  }
};

export function validateDisabledTime(clock: DisabledTimeSource): void {
  const { isTimeDisabled, disabledTime, type } = clock;
  if (isTimeDisabled && typeof isTimeDisabled !== 'function') {
    throw new TimepickerError('clock.isTimeDisabled must be a function', ERROR_CODES.INVALID_PARAMETER);
  }

  if (!disabledTime) return;

  const clockType = toClockType(type);

  if (disabledTime.interval) {
    if (!type) {
      throw new TimepickerError(
        'clockType is required when using disabledTime.ranges',
        ERROR_CODES.INVALID_PARAMETER,
      );
    }

    const intervals = Array.isArray(disabledTime.interval) ? disabledTime.interval : [disabledTime.interval];

    try {
      isOverlappingRangeArray(intervals, clockType);
    } catch (error) {
      throw new TimepickerError(
        `Invalid disabledTime.ranges: ${(error as Error).message}`,
        ERROR_CODES.INVALID_PARAMETER,
      );
    }

    return;
  }

  const { hours, minutes, seconds } = disabledTime;

  const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
  const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;
  const isValidSeconds = seconds ? checkDisabledHoursAndMinutes(seconds, 'minutes', clockType) : true;

  if (!isValidHours || !isValidMinutes) {
    throw new TimepickerError(
      'Invalid hours or minutes in disabledTime option',
      ERROR_CODES.INVALID_PARAMETER,
    );
  }

  if (!isValidSeconds) {
    throw new TimepickerError('Invalid seconds in disabledTime option', ERROR_CODES.INVALID_PARAMETER);
  }
}
