import { createEventWithCallback, isOverlappingRangeArray } from '../utils/config';
import { getInputValue } from '../utils/input';
import { checkDisabledHoursAndMinutes } from '../utils/time/disable';
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

      createEventWithCallback(
        this.timepicker._element,
        '',
        'timepicker:error',
        {
          error,
          currentHour,
          currentMin,
          currentType,
          currentLength,
        },
        this.timepicker._options.onError,
        this.timepicker,
      );

      console.error(`Invalid Time Format: ${error}`);
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
        throw new Error('clockType is required when using disabledTime.interval');
      }

      const intervals = Array.isArray(disabledTime.interval)
        ? disabledTime.interval
        : [disabledTime.interval];

      try {
        isOverlappingRangeArray(intervals, clockType);
      } catch (error) {
        throw new Error(`Invalid disabledTime.interval: ${(error as Error).message}`);
      }

      return;
    }

    const { hours, minutes } = disabledTime;

    const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
    const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;

    if (!isValidHours || !isValidMinutes) {
      throw new Error('You set wrong hours or minutes in disabled option');
    }
  }

  destroy() {
    this.removeErrorHandler();
  }
}
