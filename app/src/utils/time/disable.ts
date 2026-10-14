import { isOverlappingRangeArray } from '../config';
import { handleValueAndCheck } from '../input';
import { pad } from './parse';
import { getClockType } from '../options/predicates';
import type { TimepickerOptions } from '../../types/options';

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

export const createDisabledTime = (options: Required<TimepickerOptions>) => {
  if (!options) return;
  const { disabledTime, type: clockType } = options.clock;

  if (!disabledTime || !Object.keys(disabledTime).length) return;

  const { hours, minutes, seconds, interval } = disabledTime;

  if (interval) {
    const intervals = Array.isArray(interval) ? interval : [interval];

    if (!clockType) {
      throw new Error('clockType required for interval');
    }

    isOverlappingRangeArray(intervals, getClockType(options));

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
