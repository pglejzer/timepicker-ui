import type { UIOptions } from '../types/options';
import { isDocument } from './node';

export const resolveElement = (target: string | HTMLElement | undefined): HTMLElement | null => {
  if (!target || !isDocument()) return null;
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
  return target;
};

export const getInlineContainer = (inline: UIOptions['inline']): HTMLElement | null => {
  if (!inline) return null;
  if (inline.container) return resolveElement(inline.container);
  if (!inline.containerId || !isDocument()) return null;
  return document.getElementById(inline.containerId);
};

const hasSize = (element: Element): boolean => {
  const { width, height } = element.getBoundingClientRect();
  return width > 0 && height > 0;
};

export const whenSized = (element: Element | null | undefined, callback: () => void): (() => void) => {
  if (!element || typeof ResizeObserver === 'undefined' || hasSize(element)) return () => {};

  const observer = new ResizeObserver(() => {
    if (!hasSize(element)) return;
    observer.disconnect();
    callback();
  });
  observer.observe(element);
  return () => observer.disconnect();
};
