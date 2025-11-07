/**
 * Announces a message to screen readers using the live region
 * @param modal - The modal element containing the announcer
 * @param message - The message to announce
 */
export const announceToScreenReader = (modal: HTMLElement | null, message: string): void => {
  if (!modal) return;

  const announcer = modal.querySelector('.timepicker-announcer') as HTMLElement;
  if (!announcer) return;

  announcer.textContent = '';

  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
};

/**
 * Updates aria-pressed state for AM/PM buttons
 * @param button - The button element
 * @param pressed - Whether the button is pressed
 */
export const updateAriaPressed = (button: HTMLElement | null, pressed: boolean): void => {
  if (!button) return;
  button.setAttribute('aria-pressed', String(pressed));
};

