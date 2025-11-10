import type { ITimepickerUI } from '../../types/ITimepickerUI';
import { getInputValue } from '../../utils/input';
import { createDisabledTime } from '../../utils/time/disable';
import { createEventWithCallback } from '../../utils/config';
import { selectorActive } from '../../utils/variables';

export class InitializationManager {
  constructor(private timepicker: ITimepickerUI) {}

  private isCurrentTimeEnabled(optionKey: 'preventClockType' | 'updateInput'): boolean {
    const currentTime = this.timepicker._options?.currentTime;
    if (typeof currentTime === 'boolean') return currentTime;
    return !!currentTime?.[optionKey];
  }

  preventClockTypeByCurrentTime() {
    if (!this.isCurrentTimeEnabled('preventClockType')) return;

    const { currentTime, clockType } = this.timepicker._options;
    const { type } = getInputValue(this.timepicker.input as HTMLInputElement, clockType, currentTime, true);
    this.timepicker._options.clockType = type ? '12h' : '24h';
  }

  updateInputValueWithCurrentTimeOnStart() {
    if (!this.isCurrentTimeEnabled('updateInput')) return;

    const { hour, minutes, type } = getInputValue(
      this.timepicker.input as HTMLInputElement,
      this.timepicker._options.clockType,
      this.timepicker._options.currentTime,
    );

    this.timepicker.input.value = type ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
  }

  checkMobileOption() {
    this.timepicker._isMobileView = !!this.timepicker._options.mobile;
    if (this.timepicker._options.mobile) this.timepicker._options.editable = true;
  }

  getDisableTime() {
    const disabledTimeResult = createDisabledTime(this.timepicker._options);
    this.timepicker._disabledTime = disabledTimeResult ? disabledTimeResult : null;
  }

  getInputValueOnOpenAndSet(): void {
    const value = getInputValue(
      this.timepicker.input as HTMLInputElement,
      this.timepicker._options.clockType,
      this.timepicker._options.currentTime,
    );

    if (value === undefined) {
      this.timepicker.hour.value = '12';
      this.timepicker.minutes.value = '00';

      const eventData = {
        hour: this.timepicker.hour.value,
        minutes: this.timepicker.minutes.value,
        type: this.timepicker.activeTypeMode?.dataset.type,
        degreesHours: this.timepicker._degreesHours,
        degreesMinutes: this.timepicker._degreesMinutes,
      };

      createEventWithCallback(
        this.timepicker._element,
        'timepicker:open',
        eventData,
        this.timepicker._options.onOpen,
      );

      this.timepicker.emit?.('open', eventData);

      if (this.timepicker._options.clockType !== '24h') {
        this.timepicker.AM.classList.add(selectorActive);
      }
      return;
    }

    let [hour, minutes, type] = this.timepicker.input.value.split(':').join(' ').split(' ');
    if (this.timepicker.input.value.length === 0) {
      hour = value.hour as string;
      minutes = value.minutes as string;
      type = value.type as string;
    }

    this.timepicker.hour.value = hour;
    this.timepicker.minutes.value = minutes;

    const typeMode = this.timepicker.modalElement?.querySelector(`[data-type='${type}']`) as HTMLElement;
    if (this.timepicker._options.clockType !== '24h' && typeMode) {
      typeMode.classList.add(selectorActive);
    }

    const eventData = {
      ...value,
      type: this.timepicker.activeTypeMode?.dataset.type,
      degreesHours: this.timepicker._degreesHours,
      degreesMinutes: this.timepicker._degreesMinutes,
    };

    createEventWithCallback(
      this.timepicker._element,
      'timepicker:open',
      eventData,
      this.timepicker._options.onOpen,
    );

    this.timepicker.emit?.('open', eventData);
  }
}
