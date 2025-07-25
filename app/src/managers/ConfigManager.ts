import { debounce } from '../utils/debounce';
import { getInputValue, handleValueAndCheck } from '../utils/input';
import { createDisabledTime } from '../utils/time/disable';
import { createEventWithCallback } from '../utils/config';
import { selectorActive } from '../utils/variables';
import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class ConfigManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  preventClockTypeByCurrentTime = () => {
    if (
      (typeof this.timepicker._options?.currentTime !== 'boolean' &&
        this.timepicker._options?.currentTime?.preventClockType) ||
      (typeof this.timepicker._options?.currentTime === 'boolean' && this.timepicker._options?.currentTime)
    ) {
      const { currentTime, clockType } = this.timepicker._options;
      const { type } = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        clockType,
        currentTime,
        true,
      );

      this.timepicker._options.clockType = type ? '12h' : '24h';
    }
  };

  /** @internal */
  updateInputValueWithCurrentTimeOnStart = () => {
    if (
      (typeof this.timepicker._options?.currentTime !== 'boolean' &&
        this.timepicker._options?.currentTime?.updateInput) ||
      (typeof this.timepicker._options?.currentTime === 'boolean' && this.timepicker._options?.currentTime)
    ) {
      const { hour, minutes, type } = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
        this.timepicker._options.currentTime,
      );

      this.timepicker.input.value = type ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
    }
  };

  /** @internal */
  checkMobileOption() {
    this.timepicker._isMobileView = !!this.timepicker._options.mobile;

    if (this.timepicker._options.mobile) {
      this.timepicker._options.editable = true;
    }
  }

  /** @internal */
  getDisableTime() {
    this.timepicker._disabledTime = createDisabledTime(this.timepicker._options);
  }

  /** @internal */
  getInputValueOnOpenAndSet = (): void => {
    const value = getInputValue(
      this.timepicker.input as unknown as HTMLInputElement,
      this.timepicker._options.clockType,
      this.timepicker._options.currentTime,
    );

    if (value === undefined) {
      this.timepicker.hour.value = '12';
      this.timepicker.minutes.value = '00';

      createEventWithCallback(
        this.timepicker._element,
        'show',
        'timepicker:open',
        {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        },
        this.timepicker._options.onOpen,
      );

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

    createEventWithCallback(
      this.timepicker._element,
      'show',
      'timepicker:open',
      {
        ...value,
        type: this.timepicker.activeTypeMode?.dataset.type,
        degreesHours: this.timepicker._degreesHours,
        degreesMinutes: this.timepicker._degreesMinutes,
      },
      this.timepicker._options.onOpen,
    );
  };

  /** @internal */
  handlerViewChange = () =>
    debounce(() => {
      const { clockType } = this.timepicker._options;

      if (!this.timepicker.modalElement?.classList.contains('mobile')) {
        this.timepicker.close()();

        this.timepicker._isMobileView = true;
        this.timepicker._options.mobile = true;

        const beforeHourContent = this.timepicker.hour.value;
        const beforeMinutesContent = this.timepicker.minutes.value;
        const beforeTypeModeContent = this.timepicker.activeTypeMode?.dataset.type;

        setTimeout(() => {
          this.timepicker.destroy();
          this.timepicker.update({
            options: { mobile: true },
          });
          setTimeout(() => {
            this.timepicker.open();

            this.timepicker.hour.value = beforeHourContent;
            this.timepicker.minutes.value = beforeMinutesContent;

            if (this.timepicker._options.clockType === '12h') {
              const toAddType = beforeTypeModeContent === 'PM' ? 'PM' : 'AM';
              const toRemoveType = beforeTypeModeContent === 'PM' ? 'AM' : 'PM';

              this.timepicker[toAddType].classList.add(selectorActive);
              this.timepicker[toRemoveType].classList.remove(selectorActive);
            }
          }, 300);
        }, 300);
      } else {
        const validHours = handleValueAndCheck(this.timepicker.hour.value, 'hour', clockType);
        const validMinutes = handleValueAndCheck(this.timepicker.minutes.value, 'minutes', clockType);

        if (validHours === false || validMinutes === false) {
          if (!validMinutes) {
            this.timepicker.minutes.classList.add('invalid-value');
          }

          if (!validHours) {
            this.timepicker.hour?.classList.add('invalid-value');
          }

          return;
        }

        if (validHours === true && validMinutes === true) {
          if (validMinutes) {
            this.timepicker.minutes.classList.remove('invalid-value');
          }

          if (validHours) {
            this.timepicker.hour?.classList.remove('invalid-value');
          }
        }

        this.timepicker.close()();

        this.timepicker._isMobileView = false;
        this.timepicker._options.mobile = false;

        const beforeHourContent = this.timepicker.hour.value;
        const beforeMinutesContent = this.timepicker.minutes.value;
        const beforeTypeModeContent = this.timepicker.activeTypeMode?.dataset.type;

        setTimeout(() => {
          this.timepicker.destroy();
          this.timepicker.update({
            options: { mobile: false },
          });
          setTimeout(() => {
            this.timepicker.open();

            this.timepicker.hour.value = beforeHourContent;
            this.timepicker.minutes.value = beforeMinutesContent;

            if (this.timepicker._options.clockType === '12h') {
              const toAddType = beforeTypeModeContent === 'PM' ? 'PM' : 'AM';
              const toRemoveType = beforeTypeModeContent === 'PM' ? 'AM' : 'PM';

              this.timepicker[toAddType].classList.add(selectorActive);
              this.timepicker[toRemoveType].classList.remove(selectorActive);
            }

            this.timepicker.clockManager.setTransformToCircleWithSwitchesHour(this.timepicker.hour.value);
            this.timepicker.clockManager.toggleClassActiveToValueTips(this.timepicker.hour.value);

            if (Number(this.timepicker.hour.value) > 12 || Number(this.timepicker.hour.value) === 0) {
              this.timepicker.clockManager.setCircleClockClasses24h();
            } else {
              this.timepicker.clockManager.removeCircleClockClasses24h();
            }
          }, 300);
        }, 300);
      }
    }, this.timepicker._options.delayHandler || 300);

  /** @internal */
  getInputValue = getInputValue;
}
