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

const getClickTouchPosition = (
  event: {
    preventDefault?: any;
    type?: any;
    target?: any;
    clientX?: any;
    clientY?: any;
    touches?: any;
  },
  object: HTMLElement,
  isMobile = false
): Record<string, unknown> => {
  const { clientX, clientY, touches } = event;
  const { left, top } = object.getBoundingClientRect();
  let obj: Record<string, unknown> = { x: null, y: null };

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

  //@ts-ignore
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return;

  return obj;
};

const getMathDegIncrement = (degrees: number, num: number): number => {
  return Math.round(degrees / num) * num;
};

const hasClass = (el: HTMLElement, selector: string): boolean => el.classList.contains(selector);

const getInputValue = (el: HTMLInputElement): Record<string, string> => {
  const { value } = el;

  //@ts-ignore
  if (value === '') return;

  const [hour, type] = value.split(' ');
  const [hourSplit, minutesSplit] = hour.split(':');

  let min: number | string = Number(minutesSplit);
  const hor = Number(hourSplit);

  //@ts-ignore
  if (hor > 12 || min > 59 || hor === 0) return;

  //@ts-ignore
  if (type !== 'AM' && type !== 'PM') return;

  if (min < 10) {
    min = `0${min}`;
  } else if (min === 0) {
    min = '00';
  }

  return {
    hour: hor < 10 ? `0${hor}` : hor.toString(),
    minutes: min.toString(),
    type,
  };
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

export {
  toType,
  isElement,
  typeCheckConfig,
  getConfig,
  getScrollbarWidth,
  getRadians,
  getClickTouchPosition,
  getInputValue,
  createNewEvent,
  getBrowser,
  hasClass,
  getMathDegIncrement,
  getIncrementTimes,
};
