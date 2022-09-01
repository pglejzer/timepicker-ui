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

  if (touches === undefined) {
    obj = {
      x: clientX - left,
      y: clientY - top,
    };
  } else if (touches !== undefined && touches.length > 0) {
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

export const initCallback = (callback?: () => void): void => {
  if (callback && typeof callback === 'function') {
    callback();
  }
};

export const timeConversion = (str = '') => {
  const time = str.replace(/(AM|PM|am|pm)/, (match) => ` ${match}`);
  const date = new Date(`September 20, 2000 ${time}`);
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${mins}`;
};

export const debounce = <T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
