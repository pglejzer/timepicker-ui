import { optionTypes } from './types';

// Thanks for Bootstrap 5 - alpha version
const toType = (obj: null | undefined | string | number): string => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};

// Thanks for Bootstrap 5 - alpha version
const isElement = (obj: string | any[] | any): string => (obj[0] || obj).nodeType;

// Thanks for Bootstrap 5 - alpha version
const typeCheckConfig = (
  componentName: string,
  config: { [x: string]: any },
  configTypes: { [x: string]: any }
): void => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? 'el' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error(
        `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`
      );
    }
  });
};

// Thanks for Bootstrap 5 - alpha version
const getConfig = (
  options?: optionTypes,
  defaultOptions?: Record<string, unknown>
): Record<string, unknown> => {
  const config = {
    ...defaultOptions,
    ...options,
  };

  return config;
};

// Thanks for Bootstrap 5 - alpha version
const getScrollbarWidth = (): number => {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'timepicker-ui-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

const getRadians = (el: number): number => el * (Math.PI / 180);

const getClickTouchPosition = (event: TouchEvent, object: HTMLElement, isMobile = false) => {
  const { touches } = event;
  const { clientX, clientY } = (event as unknown) as MouseEvent;

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

const getMathDegIncrement = (degrees: number, num: number): number => {
  return Math.round(degrees / num) * num;
};

const hasClass = (el: HTMLElement | null | Element, selector: string): boolean =>
  el ? el.classList.contains(selector) : false;

const getInputValue = (el: HTMLInputElement, clockType?: string) => {
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
    } else if (value.length > 8 || (type !== 'AM' && type !== 'PM')) {
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
          min
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
  } else {
    if (hor < 0 || hor > 23 || min > 59) {
      return {
        error: `The input contains invalid numbers. Problem is with hour which should be less than 24 and higher or equal 0, currentHour: ${hor}. Minutes should be less than 60 and higher or equal 0, currentMinutes: ${Number(
          min
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

const createNewEvent = (
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
  }
): void => {
  const ev = new CustomEvent(eventName, { detail: value });

  el.dispatchEvent(ev);
};

const getBrowser = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const getIncrementTimes = (degrees: number, type: any, count: number) => {
  return getMathDegIncrement(degrees, (type as never) * count);
};

export const createObjectFromData = (obj: optionTypes): any => {
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

export {
  createNewEvent,
  getBrowser,
  getClickTouchPosition,
  getConfig,
  getIncrementTimes,
  getInputValue,
  getMathDegIncrement,
  getRadians,
  getScrollbarWidth,
  hasClass,
  isElement,
  toType,
  typeCheckConfig,
};
