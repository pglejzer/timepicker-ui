import { parseInterval, findOverlappingIntervals } from '../time/rules';

export const hasClass = (el: HTMLElement | null | Element, selector: string): boolean =>
  el ? el.classList.contains(selector) : false;

export const isOverlappingRangeArray = (intervals: string[], clockType: '12h' | '24h'): boolean => {
  intervals.forEach((rangeStr) => {
    if (!parseInterval(rangeStr, clockType)) {
      throw new Error(`Invalid ${clockType} format: "${rangeStr}"`);
    }
  });

  const overlap = findOverlappingIntervals(intervals, clockType);
  if (overlap) {
    throw new Error(`Overlapping intervals: "${overlap[0]}" and "${overlap[1]}"`);
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
