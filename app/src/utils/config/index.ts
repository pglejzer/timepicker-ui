/* eslint-disable no-else-return */
import type { OptionTypes, CallbackData } from '../../types/types';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export const toType = (obj: unknown): string => {
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
  config: Record<string, unknown>,
  configTypes: Record<string, string>,
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

export const getClickTouchPosition = (event: TouchEvent, object: HTMLElement) => {
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
    eventType?: 'accept' | 'cancel' | 'click' | 'change' | null;
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

/**
 * @description Creates a new event and triggers callback if provided
 * This function properly dispatches CustomEvents and handles callbacks
 */
export const createEventWithCallback = (
  el: Element,
  eventName: string,
  newEventName: string,
  value: CallbackData,
  callback?: (eventData: CallbackData) => void,
  timepicker?: ITimepickerUI,
): void => {
  if (!el) return;

  const namespacedEvent = new CustomEvent(newEventName, {
    detail: value,
    bubbles: true,
    cancelable: true,
  });

  try {
    // Deprecated notice planned for v4
    const dispatched = el.dispatchEvent(namespacedEvent);

    if (dispatched && eventName !== newEventName) {
      const legacyEvent = new CustomEvent(eventName, {
        detail: value,
        bubbles: true,
        cancelable: true,
      });
      // Deprecated notice planned for v4
      el.dispatchEvent(legacyEvent);
    }

    if (
      timepicker &&
      'emit' in timepicker &&
      typeof (timepicker as unknown as { emit: Function }).emit === 'function'
    ) {
      const eventKey = newEventName.replace('timepicker:', '').replace(/-/g, ':');
      (timepicker as unknown as { emit: (event: string, data: CallbackData) => void }).emit(eventKey, value);
    }
  } catch (error) {
    console.warn(`TimepickerUI: Error dispatching event ${newEventName}:`, error);
  }

  if (callback && typeof callback === 'function') {
    try {
      callback(value);
    } catch (error) {
      console.warn(`TimepickerUI: Error in ${newEventName} callback:`, error);
    }
  }
};

export const getBrowser = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const getIncrementTimes = (degrees: number, type: number, count: number) =>
  getMathDegIncrement(degrees, type * count);

export const createObjectFromData = (
  obj: OptionTypes,
): Record<string, string | number | boolean> | undefined => {
  if (!obj) return;

  const parse = JSON.parse(JSON.stringify(obj));
  const keys = Object.keys(parse);

  return Object.values(parse).reduce((acc: Record<string, string | number | boolean>, curr, index) => {
    if (Number(curr)) {
      acc[keys[index]] = Number(curr);
    } else if (curr === 'true' || curr === 'false') {
      acc[keys[index]] = JSON.parse(curr);
    } else if (typeof curr === 'string' || typeof curr === 'number' || typeof curr === 'boolean') {
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

export const normalize24h = (str: string): string => {
  const [h, m] = str.split(':');
  const hour = Number(h);
  const minute = Number(m);
  return `${hour <= 9 ? '0' + hour : hour}:${minute <= 9 ? '0' + minute : minute}`;
};

export const isOverlappingRangeArray = (intervals: string[], clockType: '12h' | '24h'): boolean => {
  if (intervals.length < 2) return false;

  const normalizedIntervals = intervals.map((rangeStr) => {
    const [first, second] = rangeStr.trim().split('-');

    let startTime: string;
    let endTime: string;

    if (clockType === '12h') {
      if (!/\s?(AM|PM|am|pm)\s?$/.test(first.trim()) || !/\s?(AM|PM|am|pm)\s?$/.test(second.trim())) {
        throw new Error(
          `Invalid 12h format in interval: "${rangeStr}". AM/PM is required for 12h clock type.`,
        );
      }
      startTime = timeConversion(first.trim());
      endTime = timeConversion(second.trim());
    } else {
      if (/\s?(AM|PM|am|pm)\s?/.test(first.trim()) || /\s?(AM|PM|am|pm)\s?/.test(second.trim())) {
        throw new Error(
          `Invalid 24h format in interval: "${rangeStr}". AM/PM is not allowed for 24h clock type.`,
        );
      }
      startTime = normalize24h(first.trim());
      endTime = normalize24h(second.trim());
    }

    return { start: startTime, end: endTime, original: rangeStr };
  });

  for (let i = 0; i < normalizedIntervals.length; i++) {
    for (let j = i + 1; j < normalizedIntervals.length; j++) {
      const interval1 = normalizedIntervals[i];
      const interval2 = normalizedIntervals[j];

      if (
        (interval1.start <= interval2.end && interval1.end >= interval2.start) ||
        (interval2.start <= interval1.end && interval2.end >= interval1.start)
      ) {
        throw new Error(
          `Overlapping time intervals detected: "${interval1.original}" overlaps with "${interval2.original}"`,
        );
      }
    }
  }

  return false;
};

/**
 * @description Generates a UUID with fallback for older browsers and SSR environments
 * @returns {string} UUID string
 */
export const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
