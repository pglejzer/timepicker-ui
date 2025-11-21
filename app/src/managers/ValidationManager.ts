import { getInputValue } from '../utils/input';
import { checkDisabledHoursAndMinutes } from '../utils/time/disable';
import { TimepickerError, ERROR_CODES } from '../utils/errors';
import { isOverlappingRangeArray } from '../utils/config';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { isDocument } from '../utils/node';

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

    const { error, currentHour, currentMin, currentType, currentLength } = getInputValue(
      input,
      this.core.options.clock.type,
    );

    this.removeErrorHandler();

    if (error) {
      if (isDocument() === false) {
        return false;
      }

      const errorEl = document.createElement('div');
      errorEl.classList.add('tp-ui-invalid-text');
      errorEl.innerHTML = '<b>Invalid Time Format</b>';

      input.classList.add('tp-ui-invalid-format');

      if (!input.nextElementSibling?.classList.contains('tp-ui-invalid-text')) {
        input.after(errorEl);
      }

      const eventData = {
        error,
        rejectedHour: undefined,
        rejectedMinute: undefined,
        inputHour: currentHour,
        inputMinute: currentMin,
        inputType: currentType,
        inputLength: currentLength,
      };

      this.emitter.emit('error', eventData);

      return false;
    }

    return true;
  }

  removeErrorHandler(): void {
    const input = this.core.getInput();
    if (!input) return;

    input.classList.remove('tp-ui-invalid-format');

    const next = input.nextElementSibling;
    if (next?.classList.contains('tp-ui-invalid-text')) {
      next.remove();
    }
  }

  checkDisabledValuesOnStart(): void {
    if (!this.core.options.clock.disabledTime) return;

    const { disabledTime, type: clockType } = this.core.options.clock;

    if (disabledTime.interval) {
      if (!clockType) {
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

    const { hours, minutes } = disabledTime;

    const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
    const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;

    if (!isValidHours || !isValidMinutes) {
      throw new TimepickerError(
        'Invalid hours or minutes in disabledTime option',
        ERROR_CODES.INVALID_PARAMETER,
      );
    }
  }

  destroy(): void {
    this.removeErrorHandler();
  }
}

