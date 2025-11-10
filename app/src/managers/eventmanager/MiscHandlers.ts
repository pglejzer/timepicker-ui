import { hasClass, createEventWithCallback, getClickTouchPosition, getBrowser } from '../../utils/config';
import { getInputValue, handleValueAndCheck } from '../../utils/input';
import { selectorActive } from '../../utils/variables';
import { checkedDisabledValuesInterval } from '../../utils/time/disable';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class MiscHandlers {
  private timepicker: ITimepickerUI;
  private cleanupHandlers: Array<() => void>;

  constructor(timepicker: ITimepickerUI, cleanupHandlers: Array<() => void>) {
    this.timepicker = timepicker;
    this.cleanupHandlers = cleanupHandlers;
  }

  handleOpenOnClick = () => {
    this.timepicker.openElement.forEach((openEl: Element) => {
      const handler = () => this.timepicker._eventsBundle();
      openEl?.addEventListener('click', handler);
      this.cleanupHandlers.push(() => {
        openEl?.removeEventListener('click', handler);
      });
    });
  };

  handleOpenOnEnterFocus = () => {
    const handler = ({ target, key }: KeyboardEvent) => {
      if ((target as HTMLInputElement).disabled) return;

      if (key === 'Enter') {
        this.timepicker.open();
      }
    };

    this.timepicker.input.addEventListener('keydown', handler);
    this.cleanupHandlers.push(() => {
      this.timepicker.input.removeEventListener('keydown', handler);
    });
  };

  handleClickOnHourMobile = () => {
    document.addEventListener('mousedown', this.timepicker._eventsClickMobileHandler);
    document.addEventListener('touchstart', this.timepicker._eventsClickMobileHandler);

    this.cleanupHandlers.push(() => {
      document.removeEventListener('mousedown', this.timepicker._eventsClickMobileHandler);
      document.removeEventListener('touchstart', this.timepicker._eventsClickMobileHandler);
    });
  };

  handlerClickHourMinutes = async (event: Event): Promise<void> => {
    if (!this.timepicker.modalElement) return;
    const { clockType, editable } = this.timepicker._options;

    const target = event.target as HTMLDivElement;
    const validHours = handleValueAndCheck(this.timepicker.hour.value, 'hour', clockType);
    const validMinutes = handleValueAndCheck(this.timepicker.minutes.value, 'minutes', clockType);

    if (!editable) return;

    if (!hasClass(target, 'timepicker-ui-hour') && !hasClass(target, 'timepicker-ui-minutes')) {
      if (validHours === true && validMinutes === true) {
        if (validMinutes) this.timepicker.minutes.classList.remove('invalid-value');
        if (validHours) this.timepicker.hour?.classList.remove('invalid-value');
      }
    } else if (validHours === false || validMinutes === false) {
      if (!validMinutes) this.timepicker.minutes.classList.add('invalid-value');
      if (!validHours) this.timepicker.hour?.classList.add('invalid-value');
    }
  };

  handleIconChangeView = async (): Promise<void> => {
    if (this.timepicker._options.enableSwitchIcon && this.timepicker.configManager) {
      const handler = (e: Event) => {
        e.preventDefault();
        if (this.timepicker.configManager) {
          this.timepicker.configManager.toggleMobileClockFace();
        }
      };

      this.timepicker.keyboardClockIcon?.addEventListener('click', handler);
      this.timepicker.keyboardClockIcon?.addEventListener('touchstart', handler, { passive: false });

      this.cleanupHandlers.push(() => {
        this.timepicker.keyboardClockIcon?.removeEventListener('click', handler);
        this.timepicker.keyboardClockIcon?.removeEventListener('touchstart', handler);
      });
    }
  };

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.timepicker.modalElement) {
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
    }
  };

  handleEscClick = () => {
    document.addEventListener('keydown', this.handleKeyPress);
    this.cleanupHandlers.push(() => {
      document.removeEventListener('keydown', this.handleKeyPress);
    });
  };

  focusTrapHandler = () => {
    setTimeout(() => {
      const focusableEls = this.timepicker.wrapper?.querySelectorAll('div[tabindex="0"]:not([disabled])');
      const focusableInputs = this.timepicker.wrapper?.querySelectorAll(
        'input[tabindex="0"]:not([disabled])',
      );

      if (!focusableEls || focusableEls.length <= 0 || focusableInputs.length <= 0) return;

      const allFcousablElements = [...focusableInputs, ...focusableEls];
      const firstFocusableEl = allFcousablElements[0] as HTMLDivElement;
      const lastFocusableEl = allFcousablElements[allFcousablElements.length - 1] as HTMLDivElement;

      this.timepicker.wrapper.focus();

      const keydownHandler = (event: KeyboardEvent) => {
        const { key, shiftKey, target: t } = event;
        const target = t as HTMLDivElement;

        if (key === 'Tab') {
          if (shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
              event.preventDefault();
            }
          } else if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            event.preventDefault();
          }
        }

        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
          const isClockNumber =
            hasClass(target, 'timepicker-ui-value-tips') || hasClass(target, 'timepicker-ui-value-tips-24h');
          const isHourInput = hasClass(target, 'timepicker-ui-hour');
          const isMinuteInput = hasClass(target, 'timepicker-ui-minutes');

          if (isClockNumber) {
            const parent = target.parentElement;
            const isMinuteClock = hasClass(parent, 'timepicker-ui-minutes-time');
            const isHourClock =
              hasClass(parent, 'timepicker-ui-hour-time-12') ||
              hasClass(parent, 'timepicker-ui-hour-time-24');

            if (isMinuteClock) {
              const currentValue = parseInt(this.timepicker.minutes.value || '0');
              let newValue = currentValue;

              if (key === 'ArrowUp' || key === 'ArrowRight') {
                newValue = currentValue >= 59 ? 0 : currentValue + 1;
              } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
                newValue = currentValue <= 0 ? 59 : currentValue - 1;
              }

              const minuteStr = newValue < 10 ? `0${newValue}` : `${newValue}`;
              const hourStr = this.timepicker.hour.value;
              const typeStr = this.timepicker.activeTypeMode?.textContent || '';

              if (
                this.timepicker._disabledTime?.value?.isInterval &&
                this.timepicker._disabledTime?.value?.intervals
              ) {
                const isEnabled = checkedDisabledValuesInterval(
                  hourStr,
                  minuteStr,
                  typeStr,
                  this.timepicker._disabledTime.value.intervals,
                  this.timepicker._options.clockType,
                );

                if (!isEnabled) {
                  return;
                }
              }

              this.timepicker.minutes.value = minuteStr;
              this.timepicker.minutes.setAttribute('aria-valuenow', this.timepicker.minutes.value);

              if (this.timepicker.clockManager) {
                this.timepicker.clockManager.setTransformToCircleWithSwitchesMinutes(
                  this.timepicker.minutes.value,
                );
                this.timepicker.clockManager.toggleClassActiveToValueTips(newValue);
              }
            } else if (isHourClock) {
              const currentValue = parseInt(this.timepicker.hour.value || '0');
              const is24h = this.timepicker._options.clockType === '24h';
              const max = is24h ? 23 : 12;
              const min = is24h ? 0 : 1;
              let newValue = currentValue;

              if (key === 'ArrowUp' || key === 'ArrowRight') {
                newValue = currentValue >= max ? min : currentValue + 1;
              } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
                newValue = currentValue <= min ? max : currentValue - 1;
              }

              const hourStr = newValue < 10 ? `0${newValue}` : `${newValue}`;
              const typeStr = this.timepicker.activeTypeMode?.textContent || '';

              if (
                this.timepicker._disabledTime?.value?.isInterval &&
                this.timepicker._disabledTime?.value?.intervals
              ) {
                let allMinutesDisabled = true;
                for (let m = 0; m < 60; m++) {
                  const minuteStr = m.toString().padStart(2, '0');
                  const isEnabled = checkedDisabledValuesInterval(
                    hourStr,
                    minuteStr,
                    typeStr,
                    this.timepicker._disabledTime.value.intervals,
                    this.timepicker._options.clockType,
                  );
                  if (isEnabled) {
                    allMinutesDisabled = false;
                    break;
                  }
                }

                if (allMinutesDisabled) {
                  return;
                }
              }

              this.timepicker.hour.value = hourStr;
              this.timepicker.hour.setAttribute('aria-valuenow', this.timepicker.hour.value);

              if (this.timepicker.clockManager) {
                this.timepicker.clockManager.setTransformToCircleWithSwitchesHour(this.timepicker.hour.value);
                this.timepicker.clockManager.toggleClassActiveToValueTips(newValue);
              }
            }
          }

          if (isHourInput || isMinuteInput) {
            const currentValue = parseInt((target as HTMLInputElement).value) || 0;
            const isHour = isHourInput;
            const max = isHour ? (this.timepicker._options.clockType === '12h' ? 12 : 23) : 59;
            const min = isHour && this.timepicker._options.clockType === '12h' ? 1 : 0;
            let newValue = currentValue;

            if (key === 'ArrowUp') {
              newValue = currentValue >= max ? min : currentValue + 1;
            } else if (key === 'ArrowDown') {
              newValue = currentValue <= min ? max : currentValue - 1;
            }

            (target as HTMLInputElement).value = newValue < 10 ? `0${newValue}` : `${newValue}`;
            target.setAttribute('aria-valuenow', (target as HTMLInputElement).value);
          }
        }

        if (key === 'a' || key === 'A') {
          if (
            this.timepicker.AM &&
            !hasClass(target, 'timepicker-ui-hour') &&
            !hasClass(target, 'timepicker-ui-minutes')
          ) {
            this.timepicker.AM.click();
          }
        }

        if (key === 'p' || key === 'P') {
          if (
            this.timepicker.PM &&
            !hasClass(target, 'timepicker-ui-hour') &&
            !hasClass(target, 'timepicker-ui-minutes')
          ) {
            this.timepicker.PM.click();
          }
        }

        if (key === 'Enter') {
          if (hasClass(target, 'timepicker-ui-minutes')) {
            this.timepicker.minutes.click();
          }

          if (hasClass(target, 'timepicker-ui-hour')) {
            this.timepicker.hour.click();
          }

          if (hasClass(target, 'timepicker-ui-am')) {
            this.timepicker.AM.click();
          }

          if (hasClass(target, 'timepicker-ui-pm')) {
            this.timepicker.PM.click();
          }

          if (hasClass(target, 'timepicker-ui-ok-btn')) {
            this.timepicker.okButton.click();
          }

          if (hasClass(target, 'timepicker-ui-cancel-btn')) {
            this.timepicker.cancelButton.click();
          }

          if (hasClass(target, 'timepicker-ui-keyboard-icon-wrapper')) {
            this.timepicker.keyboardClockIcon.click();
          }
        }
      };

      this.timepicker.wrapper.addEventListener('keydown', keydownHandler);
      this.cleanupHandlers.push(() => {
        this.timepicker.wrapper?.removeEventListener('keydown', keydownHandler);
      });
    }, 100);
  };
}
