import { range, reverseRange, timeConversion, normalize24h, isOverlappingRangeArray } from '../config';
import { getInputValue, handleValueAndCheck } from '../input';
import type { OptionTypes } from '../../types/types';

/* eslint-disable no-else-return */
export const createDisabledTime = (options: OptionTypes) => {
  if (!options) return;
  const { disabledTime, clockType } = options;

  if (!disabledTime || Object.keys(disabledTime).length <= 0 || disabledTime.constructor.name !== 'Object') {
    return;
  }

  const { hours, minutes, interval } = disabledTime;

  if (interval) {
    delete disabledTime.hours;
    delete disabledTime.minutes;

    const intervals = Array.isArray(interval) ? interval : [interval];

    if (!clockType) {
      throw new Error('clockType is required when using disabledTime.interval');
    }

    try {
      isOverlappingRangeArray(intervals, clockType);
    } catch (error) {
      throw error;
    }

    const results = intervals.map((rangeStr) => {
      const [first, second] = rangeStr.trim().split('-');

      const {
        hour: startHour,
        minutes: startMinutes,
        type: startType,
      } = getInputValue({ value: first.trim() } as any, clockType);

      const {
        hour: endHour,
        minutes: endMinutes,
        type: endType,
      } = getInputValue({ value: second.trim() } as any, clockType);

      let rangeArrHour = range(startHour, endHour).map((e: number | string) =>
        e === '00' || Number(e) === 0 ? `0${Number(e)}` : `${Number(e)}`,
      );

      const removedHours: (string | undefined)[] = [];
      const numberStartMinutes = Number(startMinutes);
      const numberEndMinutes = Number(endMinutes);

      if (endType === startType) {
        if (numberStartMinutes > 0 && numberEndMinutes <= 0) {
          removedHours.push(rangeArrHour[0], rangeArrHour[rangeArrHour.length - 1]);
          rangeArrHour = rangeArrHour.slice(1, -1);
        } else if (numberEndMinutes < 59 && numberEndMinutes > 0 && numberStartMinutes <= 0) {
          removedHours.push(undefined, rangeArrHour[rangeArrHour.length - 1]);
          rangeArrHour = rangeArrHour.slice(0, -1);
        } else if (numberEndMinutes > 0 && numberStartMinutes > 0) {
          removedHours.push(rangeArrHour[0], rangeArrHour[rangeArrHour.length - 1]);
          rangeArrHour = rangeArrHour.slice(1, -1);
        } else if (numberEndMinutes === 0 && numberStartMinutes === 0) {
          removedHours.push(undefined, rangeArrHour[rangeArrHour.length - 1]);
          rangeArrHour.pop();
        }

        return {
          removedStartedHour:
            removedHours[0] !== undefined && Number(removedHours[0]) <= 9
              ? `0${removedHours[0]}`
              : removedHours[0],
          removedEndHour:
            removedHours[1] !== undefined && Number(removedHours[1]) <= 9
              ? `0${removedHours[1]}`
              : removedHours[1],
          rangeArrHour,
          startMinutes: range(startMinutes, 59).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
          endMinutes: reverseRange(0, endMinutes).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
          startType,
          endType,
        };
      } else {
        const amHours = range(startHour, 12).map(String);
        const pmHours = reverseRange(1, endHour).map(String);

        const removedAmHours: string[] = [];
        const removedPmHours: string[] = [];

        if (numberStartMinutes > 0 && numberEndMinutes <= 0) {
          removedPmHours.push(pmHours[pmHours.length - 1]);
          removedAmHours.push(amHours[0]);
          pmHours.pop();
          amHours.shift();
        } else if (numberEndMinutes < 59 && numberEndMinutes > 0 && numberStartMinutes <= 0) {
          removedAmHours.push(amHours[0]);
          removedPmHours.push(pmHours[pmHours.length - 1]);
          pmHours.pop();
        } else if (numberEndMinutes > 0 && numberStartMinutes > 0) {
          removedPmHours.push(pmHours[pmHours.length - 1]);
          removedAmHours.push(amHours[0]);
          pmHours.pop();
          amHours.shift();
        } else if (numberEndMinutes === 0 && numberStartMinutes === 0) {
          removedPmHours.push(pmHours[pmHours.length - 1]);
          removedAmHours.push(amHours[0]);
          pmHours.pop();
        }

        return {
          startType,
          endType,
          amHours,
          pmHours,
          removedAmHour:
            removedAmHours[0] && Number(removedAmHours[0]) <= 9 ? `0${removedAmHours[0]}` : removedAmHours[0],
          removedPmHour:
            removedPmHours[0] && Number(removedPmHours[0]) <= 9 ? `0${removedPmHours[0]}` : removedPmHours[0],
          startMinutes:
            Number(startMinutes) === 0
              ? []
              : range(startMinutes, 59).map((e: number | string) => (Number(e) <= 9 ? `0${e}` : `${e}`)),
          endMinutes: reverseRange(0, endMinutes).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
        };
      }
    });

    const merged = results.reduce(
      (acc, curr) => {
        Object.entries(curr).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            acc[key] = Array.isArray(acc[key]) ? [...acc[key], ...val] : [...val];
          } else {
            acc[key] = val;
          }
        });
        return acc;
      },
      {
        isInterval: true,
        clockType,
        intervals: intervals,
      } as any,
    );

    return { value: merged };
  }

  hours?.forEach((e: number | string) => {
    if (clockType === '12h' && Number(e) > 12) {
      throw new Error('The disabled hours value has to be less than 13');
    }
    if (clockType === '24h' && Number(e) > 23) {
      throw new Error('The disabled hours value has to be less than 24');
    }
  });

  minutes?.forEach((e: number | string) => {
    if (Number(e) > 59) {
      throw new Error('The disabled minutes value has to be less than 60');
    }
  });

  return {
    value: {
      hours: hours?.map((e: number | string) =>
        e === '00' || Number(e) === 0 ? `0${Number(e)}` : `${Number(e)}`,
      ),
      minutes: minutes?.map((e: number | string) => (Number(e) <= 9 ? `0${e}` : `${e}`)),
    },
  };
};

export const checkDisabledHoursAndMinutes = (
  value: (string | number)[] | string | number | undefined,
  type: 'hour' | 'minutes',
  clockType?: OptionTypes['clockType'],
  arrValue?: (string | number)[],
) => {
  if (!value) return;

  if (Array.isArray(value) && value.length > 0) {
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

export const checkedDisabledValuesInterval = (
  hour?: string,
  minutes?: string,
  type?: string,
  interval?: string | string[],
  clockType?: '12h' | '24h',
): boolean => {
  if (!hour || !minutes || !interval || !clockType) return false;

  const actualTime =
    clockType === '12h'
      ? timeConversion(`${hour}:${minutes} ${type || ''}`.trim())
      : normalize24h(`${hour}:${minutes}`);

  const intervals = Array.isArray(interval) ? interval : [interval];

  for (const rangeStr of intervals) {
    const [first, second] = rangeStr.trim().split('-');

    let getFirstTime: string;
    let getSecondTime: string;

    if (clockType === '12h') {
      const firstTrimmed = first.trim();
      const secondTrimmed = second.trim();

      if (!/\s?(AM|PM|am|pm)\s?$/.test(firstTrimmed) || !/\s?(AM|PM|am|pm)\s?$/.test(secondTrimmed)) {
        console.warn(`Invalid 12h format in interval: "${rangeStr}". AM/PM is required for 12h clock type.`);
        continue;
      }

      getFirstTime = timeConversion(firstTrimmed);
      getSecondTime = timeConversion(secondTrimmed);
    } else {
      const firstTrimmed = first.trim();
      const secondTrimmed = second.trim();

      if (/\s?(AM|PM|am|pm)\s?/.test(firstTrimmed) || /\s?(AM|PM|am|pm)\s?/.test(secondTrimmed)) {
        console.warn(
          `Invalid 24h format in interval: "${rangeStr}". AM/PM is not allowed for 24h clock type.`,
        );
        continue;
      }

      getFirstTime = normalize24h(firstTrimmed);
      getSecondTime = normalize24h(secondTrimmed);
    }

    if (actualTime >= getFirstTime && actualTime <= getSecondTime) {
      return false;
    }
  }

  return true;
};
