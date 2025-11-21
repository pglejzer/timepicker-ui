import { isDocument } from '../node';

/* eslint-disable no-else-return */
export const getScrollbarWidth = (): number => {
  if (isDocument() === false) {
    return 0;
  }

  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'tp-ui-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

export const getClickTouchPosition = (event: TouchEvent, object: HTMLElement) => {
  const { touches } = event;
  const { clientX, clientY } = event as unknown as MouseEvent;
  if (!object) return;

  const { left, top } = object.getBoundingClientRect();

  if (touches && touches.length > 0) {
    const { clientX: clx, clientY: cly } = touches[0];
    return { x: clx - left, y: cly - top };
  }

  return { x: clientX - left, y: clientY - top };
};

export const hasClass = (el: HTMLElement | null | Element, selector: string): boolean =>
  el ? el.classList.contains(selector) : false;

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
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
};

export const isOverlappingRangeArray = (intervals: string[], clockType: '12h' | '24h'): boolean => {
  if (intervals.length < 2) return false;

  const normalizedIntervals = intervals.map((rangeStr) => {
    const [first, second] = rangeStr.trim().split('-');
    let startTime: string;
    let endTime: string;

    if (clockType === '12h') {
      if (!/\s?(AM|PM|am|pm)\s?$/.test(first.trim()) || !/\s?(AM|PM|am|pm)\s?$/.test(second.trim())) {
        throw new Error(`Invalid 12h format: "${rangeStr}"`);
      }
      startTime = timeConversion(first.trim());
      endTime = timeConversion(second.trim());
    } else {
      if (/\s?(AM|PM|am|pm)\s?/.test(first.trim()) || /\s?(AM|PM|am|pm)\s?/.test(second.trim())) {
        throw new Error(`Invalid 24h format: "${rangeStr}"`);
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
        throw new Error(`Overlapping intervals: "${interval1.original}" and "${interval2.original}"`);
      }
    }
  }

  return false;
};

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
