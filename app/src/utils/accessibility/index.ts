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

export const updateAriaPressed = (button: MaybeElement, pressed: boolean): void => {
  if (button) setOrRemoveAttribute(button, 'aria-pressed', String(pressed));
};

const setPeriodPressed = (button: MaybeElement, pressed: boolean): void => {
  setClass(button, 'active', pressed);
  updateAriaPressed(button, pressed);
};

export const setActivePeriod = (am: MaybeElement, pm: MaybeElement, type?: string): void => {
  setPeriodPressed(am, type === 'AM');
  setPeriodPressed(pm, type === 'PM');
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

export const setSpinbuttonValue = (input: HTMLInputElement | null, value: string): void => {
  if (!input) return;
  input.value = value;

  const valueNow = parseInt(value, 10);
  const hasValue = !Number.isNaN(valueNow);
  setOrRemoveAttribute(input, 'aria-valuenow', hasValue && String(valueNow));
  setOrRemoveAttribute(input, 'aria-valuetext', hasValue && value);

  syncClockSlider(input.closest('.tp-ui-modal'));
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

export const bindActivate = (
  el: HTMLElement | null,
  handler: (e: Event) => void,
): (() => void) => {
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
