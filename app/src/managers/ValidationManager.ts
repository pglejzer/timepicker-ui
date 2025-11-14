import { createEventWithCallback, isOverlappingRangeArray } from '../utils/config';
import { getInputValue } from '../utils/input';
import { checkDisabledHoursAndMinutes } from '../utils/time/disable';
import { TimepickerError, ERROR_CODES } from '../utils/errors';
import type { ITimepickerUI } from '../types/ITimepickerUI.d';

export default class ValidationManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  setErrorHandler() {
    const input = this.timepicker.input as HTMLInputElement | null;
    if (!input) return;

    const { error, currentHour, currentMin, currentType, currentLength } = getInputValue(
      input,
      this.timepicker._options.clockType,
    );

    this.removeErrorHandler();

    if (error) {
      const errorEl = document.createElement('div');
      errorEl.classList.add('timepicker-ui-invalid-text');
      errorEl.innerHTML = '<b>Invalid Time Format</b>';

      input.classList.add('timepicker-ui-invalid-format');

      if (!input.nextElementSibling?.classList.contains('timepicker-ui-invalid-text')) {
        input.after(errorEl);
      }

      const eventData = {
        error,
        currentHour,
        currentMin,
        currentType,
        currentLength,
      };

      createEventWithCallback(
        this.timepicker._element,
        'timepicker:error',
        eventData,
        this.timepicker._options.onError,
      );

      this.timepicker.emit?.('error', eventData);

      return false;
    }

    return true;
  }

  /** @internal */
  removeErrorHandler() {
    const input = this.timepicker.input as HTMLInputElement | null;
    if (!input) return;

    input.classList.remove('timepicker-ui-invalid-format');

    const next = input.nextElementSibling;
    if (next?.classList.contains('timepicker-ui-invalid-text')) {
      next.remove();
    }
  }

  /** @internal */
  checkDisabledValuesOnStart() {
    if (!this.timepicker._options.disabledTime) return;

    const { disabledTime, clockType } = this.timepicker._options;

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

  destroy() {
    this.removeErrorHandler();
  }
}
