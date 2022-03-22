/* eslint-disable no-else-return */
import { OptionTypes } from './types';

export const toType = (obj: null | undefined | string | number): string => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  // @ts-ignore
  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};

export const isElement = (obj: string | any[] | any): string => (obj[0] || obj).nodeType;

export const typeCheckConfig = (
  componentName: string,
  config: { [x: string]: any },
  configTypes: { [x: string]: any },
): void => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? 'el' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error(
        `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`,
      );
    }
  });
};

export const getConfig = (
  options?: OptionTypes,
  defaultOptions?: Record<string, unknown>,
): Record<string, unknown> => {
  const config = {
    ...defaultOptions,
    ...options,
  };

  return config;
};

export const getScrollbarWidth = (): number => {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'timepicker-ui-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

export const getRadians = (el: number): number => el * (Math.PI / 180);

export const getClickTouchPosition = (event: TouchEvent, object: HTMLElement, isMobile = false) => {
  const { touches } = event;
  const { clientX, clientY } = event as unknown as MouseEvent;

  if (!object) return;

  const { left, top } = object.getBoundingClientRect();
  let obj: { x: number; y: number } = { x: 0, y: 0 };

  if (!isMobile) {
    obj = {
      x: clientX - left,
      y: clientY - top,
    };
  } else if (isMobile && touches !== undefined) {
    if (Object.keys(touches).length > 0) {
      const { clientX: clx, clientY: cly } = touches[0];

      obj = {
        x: clx - left,
        y: cly - top,
      };
    }
  }

  if (Object.keys(obj).length === 0 && obj.constructor === Object) return;

  return obj;
};

export const getMathDegIncrement = (degrees: number, num: number): number => Math.round(degrees / num) * num;

export const hasClass = (el: HTMLElement | null | Element, selector: string): boolean =>
  el ? el.classList.contains(selector) : false;

export const getInputValue = (el: HTMLInputElement, clockType?: string) => {
  if (!el) {
    return {
      hour: '12',
      minutes: '00',
      type: clockType === '24h' ? undefined : 'PM',
    };
  }

  const { value } = el;

  if (value === '' || !value) {
    return {
      hour: '12',
      minutes: '00',
      type: clockType === '24h' ? undefined : 'PM',
    };
  }

  const [hour, type] = value.split(' ');
  const [hourSplit, minutesSplit] = hour.split(':');

  if (/[a-z]/i.test(hour)) {
    return {
      error: 'The input contains invalid letters or whitespace.',
    };
  }

  if (value.includes(' ')) {
    if (!type) {
      return {
        error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 5), currentLength: ${value.length}.`,
        currentLength: value.length,
      };
    }
    if (value.length > 8 || (type !== 'AM' && type !== 'PM')) {
      return {
        error: `The input contains invalid letters or whitespace.
        Problem is with input length (max 8), currentLength: ${value.length} or invalid type (PM or AM), currentType: ${type}.`,
        currentLength: value.length,
        currentType: type,
      };
    }
  }

  let min: number | string = Number(minutesSplit);
  const hor = Number(hourSplit);

  if (min < 10) {
    min = `0${min}`;
  } else if (min === 0) {
    min = '00';
  }

  if (clockType === '12h') {
    if (hor > 12 || min > 59 || min < 0 || hor === 0 || (type !== 'AM' && type !== 'PM')) {
      return {
        error: `The input contains invalid letters or numbers. Problem is with hour which should be less than 13 and higher or equal 0, currentHour: ${hor}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(
          min,
        )} or invalid type (PM or AM), currentType: ${type}.`,
        currentHour: hor,
        currentMin: min,
        currentType: type,
      };
    }

    return {
      hour: hor < 10 ? `0${hor}` : hor.toString(),
      minutes: min.toString(),
      type,
    };
    // eslint-disable-next-line no-else-return
  } else {
    if (hor < 0 || hor > 23 || min > 59) {
      return {
        error: `The input contains invalid numbers. Problem is with hour which should be less than 24 and higher or equal 0, currentHour: ${hor}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(
          min,
        )}`,
        currentHour: hor,
        currentMin: min,
      };
    }

    return {
      hour: hor < 10 ? `0${hor}` : hor.toString(),
      minutes: min.toString(),
    };
  }
};

export const createNewEvent = (
  el: Element,
  eventName: string,
  value: {
    hour?: string | null;
    minutes?: string | null;
    type?: string | null;
    degreesHours?: number | null;
    degreesMinutes?: number | null;
    hourNotAccepted?: string | null;
    minutesNotAccepted?: string | null;
    eventType?: any;
    test?: string;
    error?: string;
    currentHour?: string | number;
    currentMin?: string | number;
    currentType?: string;
    currentLength?: string | number;
  },
): void => {
  if (!el) return;

  const ev = new CustomEvent(eventName, { detail: value });

  el.dispatchEvent(ev);
};

export const getBrowser = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const getIncrementTimes = (degrees: number, type: any, count: number) =>
  getMathDegIncrement(degrees, (type as never) * count);

export const createObjectFromData = (obj: OptionTypes): any => {
  if (!obj) return;

  const parse = JSON.parse(JSON.stringify(obj));
  const keys = Object.keys(parse);

  return Object.values(parse).reduce((acc: any, curr, index) => {
    if (Number(curr)) {
      acc[keys[index]] = Number(curr);
    } else if (curr === 'true' || curr === 'false') {
      acc[keys[index]] = JSON.parse(curr);
    } else {
      acc[keys[index]] = curr;
    }

    return acc;
  }, {});
};

export const range = (start?: number | string, stop?: number | string) =>
  Array.from({ length: Number(stop) - Number(start) + 1 }, (_, i) => Number(start) + i);

export const reverseRange = (start?: number | string, stop?: number | string) =>
  Array.from({ length: Number(stop) - Number(start) + 1 }, (_, i) => Number(stop) - i).reverse();

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

export const initCallback = (callback?: () => void): void => {
  if (callback && typeof callback === 'function') {
    callback();
  }
};

export const handleValueAndCheck = (
  val: string | number | null,
  type: 'hour' | 'minutes',
  clockType?: OptionTypes['clockType'],
): undefined | boolean => {
  const value = Number(val);

  if (type === 'hour') {
    if (clockType !== '24h') {
      if (value > 0 && value <= 12) {
        return true;
      } else {
        return false;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (value >= 0 && value <= 23) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (type === 'minutes') {
    if (value >= 0 && value <= 59) {
      return true;
    } else {
      return false;
    }
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

export const timeConversion = (str = '') => {
  const time = str.replace(/(AM|PM|am|pm)/, (match) => ` ${match}`);
  const date = new Date(`September 20, 2000 ${time}`);
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${mins}`;
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
