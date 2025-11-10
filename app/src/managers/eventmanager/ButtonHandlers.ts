import { hasClass, createEventWithCallback } from '../../utils/config';
import { getInputValue, handleValueAndCheck } from '../../utils/input';
import { checkDisabledHoursAndMinutes, checkedDisabledValuesInterval } from '../../utils/time/disable';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class ButtonHandlers {
  private timepicker: ITimepickerUI;
  private cleanupHandlers: Array<() => void>;

  constructor(timepicker: ITimepickerUI, cleanupHandlers: Array<() => void>) {
    this.timepicker = timepicker;
    this.cleanupHandlers = cleanupHandlers;
  }

  handleCancelButton = () => {
    const handler = () => {
      const value = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
      );

      const eventData = {
        ...value,
        hourNotAccepted: this.timepicker.hour.value,
        minutesNotAccepted: this.timepicker.minutes.value,
        type: this.timepicker.activeTypeMode?.dataset.type,
        degreesHours: this.timepicker._degreesHours,
        degreesMinutes: this.timepicker._degreesMinutes,
      };

      createEventWithCallback(
        this.timepicker._element,
        'timepicker:cancel',
        eventData,
        this.timepicker._options.onCancel,
      );

      this.timepicker.emit?.('cancel', eventData);

      this.timepicker.close()();
    };

    this.timepicker.cancelButton.addEventListener('click', handler);
    this.cleanupHandlers.push(() => {
      this.timepicker.cancelButton?.removeEventListener('click', handler);
    });
  };

  handleOkButton = () => {
    const handler = () => {
      const { clockType, disabledTime } = this.timepicker._options;

      const validHours = handleValueAndCheck(this.timepicker.hour.value, 'hour', clockType);
      const validMinutes = handleValueAndCheck(this.timepicker.minutes.value, 'minutes', clockType);
      let checkDisable: undefined | boolean;
      const validHoursDisabled = checkDisabledHoursAndMinutes(
        this.timepicker.hour.value as string,
        'hour',
        clockType,
        disabledTime?.hours,
      );

      const validMinutesDisabled = checkDisabledHoursAndMinutes(
        this.timepicker.minutes.value as string,
        'minutes',
        clockType,
        disabledTime?.minutes,
      );

      if (disabledTime?.interval) {
        checkDisable = checkedDisabledValuesInterval(
          this.timepicker.hour.value,
          this.timepicker.minutes.value,
          this.timepicker.activeTypeMode?.textContent || '',
          disabledTime.interval,
          clockType,
        );
      }

      if (
        checkDisable === false ||
        validHours === false ||
        validMinutes === false ||
        validHoursDisabled === false ||
        validMinutesDisabled === false
      ) {
        if (checkDisable === false || !validMinutes || !validMinutesDisabled) {
          this.timepicker.minutes.classList.add('invalid-value');
        }

        if (checkDisable === false || !validHours || !validHoursDisabled) {
          this.timepicker.hour.classList.add('invalid-value');
        }

        return;
      }

      this.timepicker.input.value = `${this.timepicker.hour.value}:${this.timepicker.minutes.value} ${
        this.timepicker._options.clockType === '24h' ? '' : this.timepicker.activeTypeMode?.dataset.type
      }`.trimEnd();

      const eventData = {
        hour: this.timepicker.hour.value,
        minutes: this.timepicker.minutes.value,
        type: this.timepicker.activeTypeMode?.dataset.type,
        degreesHours: this.timepicker._degreesHours,
        degreesMinutes: this.timepicker._degreesMinutes,
      };

      createEventWithCallback(
        this.timepicker._element,
        'timepicker:confirm',
        eventData,
        this.timepicker._options.onConfirm,
      );

      this.timepicker.emit?.('confirm', eventData);

      this.timepicker.close()();
    };

    this.timepicker.okButton?.addEventListener('click', handler);
    this.cleanupHandlers.push(() => {
      this.timepicker.okButton?.removeEventListener('click', handler);
    });
  };

  handleBackdropClick = () => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as Element as HTMLElement;

      if (!hasClass(target, 'timepicker-ui-modal')) return;

      const value = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
      );

      const eventData = {
        ...value,
        hourNotAccepted: this.timepicker.hour.value,
        minutesNotAccepted: this.timepicker.minutes.value,
        type: this.timepicker.activeTypeMode?.dataset.type,
        degreesHours: this.timepicker._degreesHours,
        degreesMinutes: this.timepicker._degreesMinutes,
      };

      createEventWithCallback(
        this.timepicker._element,
        'timepicker:cancel',
        eventData,
        this.timepicker._options.onCancel,
      );

      this.timepicker.emit?.('cancel', eventData);

      this.timepicker.close()();
    };

    this.timepicker.modalElement?.addEventListener('click', handler);
    this.cleanupHandlers.push(() => {
      this.timepicker.modalElement?.removeEventListener('click', handler);
    });
  };
}
