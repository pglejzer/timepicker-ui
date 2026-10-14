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
