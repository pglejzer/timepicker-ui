import { getInputValue } from '../utils/input';
import { checkDisabledHoursAndMinutes } from '../utils/time/disable';
import { TimepickerError, ERROR_CODES } from '../utils/errors';
import { isOverlappingRangeArray } from '../utils/config';
import { getClockType } from '../utils/options/predicates';
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
    const { isTimeDisabled } = this.core.options.clock;
    if (isTimeDisabled && typeof isTimeDisabled !== 'function') {
      throw new TimepickerError('clock.isTimeDisabled must be a function', ERROR_CODES.INVALID_PARAMETER);
    }

    if (!this.core.options.clock.disabledTime) return;

    const { disabledTime, type } = this.core.options.clock;
    const clockType = getClockType(this.core.options);

    if (disabledTime.interval) {
      if (!type) {
        throw new TimepickerError(
          'clockType is required when using disabledTime.interval',
          ERROR_CODES.INVALID_PARAMETER,
        );
      }

      const intervals = Array.isArray(disabledTime.interval)
        ? disabledTime.interval
        : [disabledTime.interval];

      try {
        isOverlappingRangeArray(intervals, clockType);
      } catch (error) {
        throw new TimepickerError(
          `Invalid disabledTime.interval: ${(error as Error).message}`,
          ERROR_CODES.INVALID_PARAMETER,
        );
      }

      return;
    }

    const { hours, minutes, seconds } = disabledTime;

    const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
    const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;
    const isValidSeconds = seconds ? checkDisabledHoursAndMinutes(seconds, 'minutes', clockType) : true;

    if (!isValidHours || !isValidMinutes) {
      throw new TimepickerError(
        'Invalid hours or minutes in disabledTime option',
        ERROR_CODES.INVALID_PARAMETER,
      );
    }

    if (!isValidSeconds) {
      throw new TimepickerError('Invalid seconds in disabledTime option', ERROR_CODES.INVALID_PARAMETER);
    }
  }

  destroy(): void {
    this.removeErrorHandler();
  }
}

