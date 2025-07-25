import { createEventWithCallback } from '../utils/config';
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
    const { error, currentHour, currentMin, currentType, currentLength } = getInputValue(
      this.timepicker.input as unknown as HTMLInputElement,
      this.timepicker._options.clockType,
    );

    if (error) {
      const newEl = document.createElement('div');
      this.timepicker.input?.classList.add('timepicker-ui-invalid-format');
      newEl.classList.add('timepicker-ui-invalid-text');
      newEl.innerHTML = '<b>Invalid Time Format</b>';

      if (
        this.timepicker.input?.parentElement &&
        this.timepicker.input?.parentElement.querySelector('.timepicker-ui-invalid-text') === null
      ) {
        this.timepicker.input?.after(newEl);
      }

      createEventWithCallback(
        this.timepicker._element,
        'geterror',
        'timepicker:error',
        {
          error,
          currentHour,
          currentMin,
          currentType,
          currentLength,
        },
        this.timepicker._options.onError,
      );

      throw new Error(`Invalid Time Format: ${error}`);
    }

    // eslint-disable-next-line no-useless-return
    return;
  }

  /** @internal */
  removeErrorHandler() {
    this.timepicker.input?.classList.remove('timepicker-ui-invalid-format');
    const divToRemove = this.timepicker._element?.querySelector(
      '.timepicker-ui-invalid-text',
    ) as HTMLDivElement;
    if (divToRemove) {
      divToRemove.remove();
    }
  }

  /** @internal */
  checkDisabledValuesOnStart() {
    if (!this.timepicker._options.disabledTime || this.timepicker._options.disabledTime.interval) return;

    const {
      disabledTime: { hours, minutes },
      clockType,
    } = this.timepicker._options;

    const isValidHours = hours ? checkDisabledHoursAndMinutes(hours, 'hour', clockType) : true;
    const isValidMinutes = minutes ? checkDisabledHoursAndMinutes(minutes, 'minutes', clockType) : true;

    if (!isValidHours || !isValidMinutes) {
      throw new Error('You set wrong hours or minutes in disabled option');
    }
  }
}
