export const announceToScreenReader = (modal: HTMLElement | null, message: string): void => {
  if (!modal) return;

  const announcer = modal.querySelector('.timepicker-announcer') as HTMLElement;
  if (!announcer) return;

  announcer.textContent = '';

  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
};

export const updateAriaPressed = (button: HTMLElement | null, pressed: boolean): void => {
  if (!button) return;
  button.setAttribute('aria-pressed', String(pressed));
};

const isElementDisabled = (el: Element): boolean =>
  el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled');

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
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    if (e.key === ' ' || e.key === 'Spacebar') {
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

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
