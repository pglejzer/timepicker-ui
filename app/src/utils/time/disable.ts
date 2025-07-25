import { range, reverseRange, timeConversion } from '../config';
import { getInputValue, handleValueAndCheck } from '../input';
import type { OptionTypes } from '../../types/types';

/* eslint-disable no-else-return */
export const createDisabledTime = (options: any) => {
  if (!options) return;
  const { disabledTime, clockType } = options;

  if (!disabledTime || Object.keys(disabledTime).length <= 0 || disabledTime.constructor.name !== 'Object') {
    return;
  }

  const { hours, interval, minutes } = disabledTime;

  if (interval) {
    delete disabledTime.hours;
    delete disabledTime.minutes;

    const [first, second] = interval.toString().split('-');

    const {
      hour: startHour,
      minutes: startMinutes,
      type: startType,
    } = getInputValue({ value: first.trimEnd() } as any, clockType);

    const {
      hour: endHour,
      minutes: endMinutes,
      type: endType,
    } = getInputValue({ value: second.trimEnd().trimStart() } as any, clockType);

    let rangeArrHour = range(startHour, endHour).map((e: number | string) =>
      e === '00' || Number(e) === 0 ? `0${Number(e)}` : `${Number(e)}`,
    );

    const removedHours: any = [];
    const numberStartMinutes = Number(startMinutes);
    const numerEndMinutes = Number(endMinutes);

    if (endType === startType) {
      if (numberStartMinutes > 0 && numerEndMinutes <= 0) {
        removedHours.push(rangeArrHour[0], rangeArrHour[rangeArrHour.length - 1]);
        rangeArrHour = rangeArrHour.slice(1, -1);
      } else if (numerEndMinutes < 59 && numerEndMinutes > 0 && numberStartMinutes <= 0) {
        removedHours.push(undefined, rangeArrHour[rangeArrHour.length - 1]);
        rangeArrHour = rangeArrHour.slice(0, -1);
      } else if (numerEndMinutes > 0 && numberStartMinutes > 0) {
        removedHours.push(rangeArrHour[0], rangeArrHour[rangeArrHour.length - 1]);
        rangeArrHour = rangeArrHour.slice(1, -1);
      } else if (numerEndMinutes === 0 && numberStartMinutes === 0) {
        removedHours.push(undefined, rangeArrHour[rangeArrHour.length - 1]);
        rangeArrHour.pop();
      }

      return {
        value: {
          removedStartedHour: Number(removedHours[0]) <= 9 ? `0${removedHours[0]}` : removedHours[0],
          removedEndHour: Number(removedHours[1]) <= 9 ? `0${removedHours[1]}` : removedHours[1],
          rangeArrHour,
          isInterval: true,
          startMinutes: range(startMinutes, 59).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
          endMinutes: reverseRange(0, endMinutes).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
          endType,
          startType,
        },
      };
      // eslint-disable-next-line no-else-return
    } else {
      const amHours = range(startHour, 12).map(String);
      const pmHours = reverseRange(1, endHour).map(String);

      const removedPmHours: string[] = [];
      const removedAmHours = [];

      if (numberStartMinutes > 0 && numerEndMinutes <= 0) {
        removedPmHours.push(pmHours[pmHours.length - 1]);
        removedAmHours.push(amHours[0]);

        pmHours.splice(-1, 1);
        amHours.splice(0, 1);
      } else if (numerEndMinutes < 59 && numerEndMinutes > 0 && numberStartMinutes <= 0) {
        removedAmHours.push(amHours[0]);
        removedPmHours.push(pmHours[pmHours.length - 1]);

        pmHours.splice(-1, 1);
      } else if (numerEndMinutes > 0 && numberStartMinutes > 0) {
        removedPmHours.push(pmHours[pmHours.length - 1]);
        removedAmHours.push(amHours[0]);

        pmHours.splice(-1, 1);
        amHours.splice(0, 1);
      } else if (numerEndMinutes === 0 && numberStartMinutes === 0) {
        removedPmHours.push(pmHours[pmHours.length - 1]);
        removedAmHours.push(amHours[0]);
        pmHours.pop();
      }

      return {
        value: {
          isInterval: true,
          endType,
          startType,
          pmHours,
          amHours,
          startMinutes:
            Number(startMinutes) === 0
              ? []
              : range(startMinutes, 59).map((e: number | string) => (Number(e) <= 9 ? `0${e}` : `${e}`)),
          endMinutes: reverseRange(0, endMinutes).map((e: number | string) =>
            Number(e) <= 9 ? `0${e}` : `${e}`,
          ),
          removedAmHour: Number(removedAmHours[0]) <= 9 ? `0${removedAmHours[0]}` : removedAmHours[0],
          removedPmHour: Number(removedPmHours[0]) <= 9 ? `0${removedPmHours[0]}` : removedPmHours[0],
        },
      };
    }
  } else {
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
  }
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

export const checkedDisabledValuesInterval = (hour?: any, minutes?: any, type?: any, interval?: any) => {
  const actualTime = type ? timeConversion(`${hour}:${minutes} ${type}`.trim()) : `${hour}:${minutes}`.trim();
  let getFirstTime: string;
  let getSecondTime: string;

  if (!type) {
    const [first, second] = interval.trim().split('-');

    const normalizeValue = (str: string) =>
      str
        .trim()
        .split(':')
        .map((e: string) => (Number(e) <= 9 ? `0${Number(e)}` : e))
        .join(':');

    getFirstTime = normalizeValue(first);
    getSecondTime = normalizeValue(second);
  } else {
    const [first, second] = interval
      .trim()
      .split('-')
      .map((e: string) => e.trim());

    getFirstTime = timeConversion(first);
    getSecondTime = timeConversion(second);
  }

  return actualTime < getFirstTime || actualTime > getSecondTime;
};
