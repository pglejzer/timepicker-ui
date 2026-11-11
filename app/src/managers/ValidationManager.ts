import { getInputValue } from '../utils/input';
import { validateDisabledTime } from '../utils/time/disable';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { ErrorEventData } from '../types/types';
import { isDocument } from '../utils/node';
import { announceToScreenReader, setClass, setOrRemoveAttribute } from '../utils/accessibility';

export default class ValidationManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  setErrorHandler(): boolean {
    const input = this.core.getInput();
    if (!input) return true;

    this.removeErrorHandler();
    if (this.core.options.range?.enabled) return true;

    const { clock } = this.core.options;
    const { error, currentHour, currentMin, currentSec, currentType, currentLength } = getInputValue(
      input,
      clock.type,
      undefined,
      undefined,
      !!clock.showSeconds,
    );

    if (error) {
      if (isDocument() === false) {
        return false;
      }

      const message = this.core.options.labels.invalidTimeFormat!;
      const errorId = this.getErrorId();

      const errorEl = document.createElement('div');
      errorEl.id = errorId;
      errorEl.classList.add('tp-ui-invalid-text');
      errorEl.setAttribute('role', 'alert');
      const strong = document.createElement('b');
      strong.textContent = message;
      errorEl.appendChild(strong);

      input.classList.add('tp-ui-invalid-format');

      if (!input.nextElementSibling?.classList.contains('tp-ui-invalid-text')) {
        input.after(errorEl);
      }

      this.linkErrorMessage(input, errorId);
      this.announceInModal(message);

      const eventData: ErrorEventData = {
        error,
        rejectedHour: undefined,
        rejectedMinute: undefined,
        inputHour: currentHour,
        inputMinute: currentMin,
        inputType: currentType,
        inputLength: currentLength,
      };

      if (currentSec !== undefined) {
        eventData.inputSecond = currentSec;
      }

      this.emitter.emit('error', eventData);

      return false;
    }

    return true;
  }

  removeErrorHandler(): void {
    const input = this.core.getInput();
    if (!input) return;

    setClass(input, 'tp-ui-invalid-format', false);
    this.unlinkErrorMessage(input);

    const next = input.nextElementSibling;
    if (next?.classList.contains('tp-ui-invalid-text')) {
      next.remove();
    }
  }

  private getErrorId(): string {
    return `tp-ui-invalid-text-${this.core.instanceId}`;
  }

  private getDescribedByIds(input: HTMLInputElement): string[] {
    return (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  }

  private linkErrorMessage(input: HTMLInputElement, errorId: string): void {
    const ids = this.getDescribedByIds(input).filter((id) => id !== errorId);
    input.setAttribute('aria-describedby', [...ids, errorId].join(' '));
    input.setAttribute('aria-invalid', 'true');
  }

  private unlinkErrorMessage(input: HTMLInputElement): void {
    const errorId = this.getErrorId();
    const ids = this.getDescribedByIds(input);
    if (!ids.includes(errorId)) return;

    setOrRemoveAttribute(input, 'aria-describedby', ids.filter((id) => id !== errorId).join(' '));
    input.removeAttribute('aria-invalid');
  }

  private announceInModal(message: string): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    if (!this.core.options.behavior.focusTrap) {
      announceToScreenReader(modal, message);
      return;
    }

    modal.addEventListener('focusin', () => announceToScreenReader(modal, message), { once: true });
  }

  checkDisabledValuesOnStart(): void {
    validateDisabledTime(this.core.options.clock);
  }

  destroy(): void {
    this.removeErrorHandler();
  }
}
