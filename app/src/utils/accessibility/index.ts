import { TIMINGS } from '../../constants/timings';

export const announceToScreenReader = (modal: HTMLElement | null, message: string): void => {
  if (!modal) return;

  const announcer = modal.querySelector('.timepicker-announcer') as HTMLElement;
  if (!announcer) return;

  announcer.textContent = '';

  setTimeout(() => {
    announcer.textContent = message;
  }, TIMINGS.ANNOUNCE_DELAY);
};

type MaybeElement = HTMLElement | null | undefined;

export const setClass = (el: Element | null | undefined, className: string, on: boolean): void => {
  el?.classList.toggle(className, on);
};

export const setOrRemoveAttribute = (
  el: Element,
  name: string,
  value: string | false | null | undefined,
): void => {
  if (!value) {
    el.removeAttribute(name);
  } else if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
};

const setPeriodChecked = (segment: MaybeElement, checked: boolean, focusable: boolean): void => {
  if (!segment) return;
  setClass(segment, 'active', checked);
  setOrRemoveAttribute(segment, 'aria-checked', String(checked));
  setOrRemoveAttribute(segment, 'tabindex', focusable ? '0' : '-1');
};

export const setActivePeriod = (am: MaybeElement, pm: MaybeElement, type?: string): void => {
  const isPm = type === 'PM';
  setPeriodChecked(am, type === 'AM', !isPm);
  setPeriodChecked(pm, isPm, isPm);
};

const CLOCK_SLIDER_ATTRIBUTES: ReadonlyArray<string> = [
  'aria-label',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
];

export const syncClockSlider = (modal: Element | null | undefined): void => {
  if (!modal) return;
  const dial = modal.querySelector('.tp-ui-clock-face');
  if (!dial) return;

  const field = modal.querySelector('input.active') ?? modal.querySelector('.tp-ui-hour');
  CLOCK_SLIDER_ATTRIBUTES.forEach((name) => setOrRemoveAttribute(dial, name, field?.getAttribute(name)));
};

export const VALUE_TEXT_ATTRIBUTE = 'data-value-text';

export const formatValueText = (template: string, value: number, count: number): string =>
  template.replaceAll('{value}', String(value)).replaceAll('{count}', String(count));

const valueCount = (input: HTMLInputElement): number =>
  Number(input.getAttribute('aria-valuemax')) - Number(input.getAttribute('aria-valuemin')) + 1;

const valueTextOf = (
  input: HTMLInputElement,
  modal: Element | null,
  value: string,
  valueNow: number,
): string => {
  const template = modal?.getAttribute(VALUE_TEXT_ATTRIBUTE);
  const count = valueCount(input);
  return template && Number.isFinite(count) ? formatValueText(template, valueNow, count) : value;
};

export const setSpinbuttonValue = (input: HTMLInputElement | null, value: string): void => {
  if (!input) return;
  input.value = value;

  const valueNow = parseInt(value, 10);
  const hasValue = !Number.isNaN(valueNow);
  const modal = input.closest('.tp-ui-modal');
  setOrRemoveAttribute(input, 'aria-valuenow', hasValue && String(valueNow));
  setOrRemoveAttribute(input, 'aria-valuetext', hasValue && valueTextOf(input, modal, value, valueNow));

  syncClockSlider(modal);
};

export const isElementDisabled = (el: Element): boolean =>
  el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled');

export const setElementDisabled = (el: Element | null, disabled: boolean): void => {
  if (!el) return;
  setClass(el, 'disabled', disabled);
  setOrRemoveAttribute(el, 'aria-disabled', String(disabled));
};

const KEY_ACTIVATION_TARGETS = '[role="button"], [tabindex], input, select, textarea';
const NATIVE_KEY_ACTIVATION =
  'button, a[href], summary, input[type="button"], input[type="submit"], input[type="reset"], input[type="image"]';

const needsKeyActivation = (el: Element): boolean =>
  el.matches(KEY_ACTIVATION_TARGETS) && !el.matches(NATIVE_KEY_ACTIVATION);

export const isActivationKey = (key: string): boolean => key === 'Enter' || key === ' ';

export const bindActivate = (el: HTMLElement | null, handler: (e: Event) => void): (() => void) => {
  if (!el) return () => {};

  const clickHandler = (e: Event): void => {
    if (isElementDisabled(el)) return;
    handler(e);
  };

  const keydownHandler = (e: KeyboardEvent): void => {
    if (!isActivationKey(e.key)) return;
    if (!needsKeyActivation(el)) return;
    if (e.key !== 'Enter') {
      e.preventDefault();
    }
    if (isElementDisabled(el)) return;
    handler(e);
  };

  el.addEventListener('click', clickHandler);
  el.addEventListener('keydown', keydownHandler);

  return () => {
    el.removeEventListener('click', clickHandler);
    el.removeEventListener('keydown', keydownHandler);
  };
};

const POINTER_MODALITY_CLASS = 'tp-ui-pointer';
const MODIFIER_KEYS: ReadonlyArray<string> = ['Shift', 'Control', 'Alt', 'Meta'];

export const trackPointerModality = (modal: HTMLElement): (() => void) => {
  const root = modal.ownerDocument;

  const markPointer = (): void => setClass(modal, POINTER_MODALITY_CLASS, true);

  const markKeyboard = (e: KeyboardEvent): void => {
    if (!MODIFIER_KEYS.includes(e.key)) setClass(modal, POINTER_MODALITY_CLASS, false);
  };

  modal.addEventListener('pointerdown', markPointer, true);
  root.addEventListener('keydown', markKeyboard, true);

  return () => {
    modal.removeEventListener('pointerdown', markPointer, true);
    root.removeEventListener('keydown', markKeyboard, true);
  };
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
