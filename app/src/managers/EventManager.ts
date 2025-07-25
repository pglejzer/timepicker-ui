import {
  hasClass,
  createEventWithCallback,
  getClickTouchPosition,
  getIncrementTimes,
  getBrowser,
} from '../utils/config';
import { getInputValue, handleValueAndCheck } from '../utils/input';
import { checkDisabledHoursAndMinutes, checkedDisabledValuesInterval } from '../utils/time/disable';
import { selectorActive, allEvents } from '../utils/variables';
import { getNumberOfHours12, getNumberOfMinutes } from '../utils/template';
import ClockFaceManager from './ClockFaceManager';
import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class EventManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  handleOpenOnClick = () => {
    this.timepicker.openElement.forEach((openEl: HTMLElement) =>
      openEl?.addEventListener('click', () => this.timepicker._eventsBundle()),
    );
  };

  /** @internal */
  handleOpenOnEnterFocus = () => {
    this.timepicker.input.addEventListener('keydown', ({ target, key }: KeyboardEvent) => {
      if ((target as HTMLInputElement).disabled) return;

      if (key === 'Enter') {
        this.timepicker.open();
      }
    });
  };

  /** @internal */
  handleCancelButton = () => {
    this.timepicker.cancelButton.addEventListener('click', () => {
      const value = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
      );

      createEventWithCallback(
        this.timepicker._element,
        'cancel',
        'timepicker:cancel',
        {
          ...value,
          hourNotAccepted: this.timepicker.hour.value,
          minutesNotAccepted: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        },
        this.timepicker._options.onCancel,
      );

      this.timepicker.close()();
    });
  };

  /** @internal */
  handleOkButton = () => {
    this.timepicker.okButton?.addEventListener('click', () => {
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
          this.timepicker.activeTypeMode?.textContent,
          disabledTime.interval,
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

      createEventWithCallback(
        this.timepicker._element,
        'accept',
        'timepicker:confirm',
        {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        },
        this.timepicker._options.onConfirm,
      );

      this.timepicker.close()();
    });
  };

  /** @internal */
  handleBackdropClick = () => {
    this.timepicker.modalElement?.addEventListener('click', (ev: MouseEvent) => {
      const target = ev.target as Element as HTMLElement;

      if (!hasClass(target, 'timepicker-ui-modal')) return;

      const value = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
      );

      createEventWithCallback(
        this.timepicker._element,
        'cancel',
        'timepicker:cancel',
        {
          ...value,
          hourNotAccepted: this.timepicker.hour.value,
          minutesNotAccepted: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        },
        this.timepicker._options.onCancel,
      );

      this.timepicker.close()();
    });
  };

  /** @internal */
  getDestructuringObj(isAmPm?: boolean) {
    const {
      endMinutes,
      removedEndHour,
      removedStartedHour,
      startMinutes,
      pmHours,
      amHours,
      removedAmHour,
      removedPmHour,
    } = this.timepicker._disabledTime.value;

    if (isAmPm) {
      return {
        minutesToUpdate: {
          actualHour: this.timepicker.hour.value,
          pmHours,
          amHours,
          activeMode: this.timepicker.activeTypeMode?.textContent,
          startMinutes,
          endMinutes,
          removedAmHour,
          removedPmHour,
        },
      };
    }

    return {
      minutesToUpdate: {
        endMinutes,
        removedEndHour,
        removedStartedHour,
        actualHour: this.timepicker.hour.value,
        startMinutes,
      },
    };
  }

  /** @internal */
  handleAmClick = () => {
    this.timepicker._clickTouchEvents.forEach((e: string) => {
      this.timepicker.AM.addEventListener(e, (ev: Event) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.timepicker.PM.classList.remove(selectorActive);

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          const initClockFace = new ClockFaceManager({
            clockFace: this.timepicker.clockFace,
            tipsWrapper: this.timepicker.tipsWrapper,
            array: hasClass(this.timepicker.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (
            this.timepicker._disabledTime?.value.startType === this.timepicker._disabledTime?.value.endType
          ) {
            setTimeout(() => {
              if (
                this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
              ) {
                initClockFace.updateDisable({
                  hoursToUpdate: this.timepicker._disabledTime?.value?.rangeArrHour,
                  ...this.getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this.getDestructuringObj(true),
              });
            }, 300);
          }

          initClockFace.updateDisable();
        }

        createEventWithCallback(
          this.timepicker._element,
          'selectamtypemode',
          'timepicker:select-am',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectAM,
        );
      });
    });
  };

  /** @internal */
  handlePmClick = () => {
    this.timepicker._clickTouchEvents.forEach((el: string) => {
      this.timepicker.PM.addEventListener(el, (ev: Event) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.timepicker.AM.classList.remove(selectorActive);

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          const initClockFace = new ClockFaceManager({
            clockFace: this.timepicker.clockFace,
            tipsWrapper: this.timepicker.tipsWrapper,
            array: hasClass(this.timepicker.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (
            this.timepicker._disabledTime?.value.startType === this.timepicker._disabledTime?.value.endType
          ) {
            setTimeout(() => {
              if (
                this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
              ) {
                initClockFace.updateDisable({
                  hoursToUpdate: this.timepicker._disabledTime?.value?.rangeArrHour,
                  ...this.getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this.getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createEventWithCallback(
          this.timepicker._element,
          'selectpmtypemode',
          'timepicker:select-pm',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectPM,
        );
      });
    });
  };

  /** @internal */
  handleClasses24h = (ev: any, element?: HTMLInputElement) => {
    const target = ev.target as HTMLInputElement;

    if (this.timepicker.hourTips) {
      if (this.timepicker._options.clockType === '24h') {
        if (Number(target.textContent) > 12 || Number(target.textContent) === 0) {
          this.timepicker.clockManager.setCircleClockClasses24h();
        } else {
          this.timepicker.clockManager.removeCircleClockClasses24h();
        }

        if (!this.timepicker._options.mobile) {
          this.timepicker.tipsWrapperFor24h?.classList.remove('timepicker-ui-tips-wrapper-24h-disabled');
        }
      }
    }

    if (!target || !element) return;

    element.value = (target.value as string).replace(/\D+/g, '');
    element.click();
  };

  /** @internal */
  handleHourEvents = () => {
    this.timepicker._inputEvents.forEach((el: string) => {
      this.timepicker.hour?.addEventListener(el, (ev: Event) => {
        const target = ev.target as HTMLInputElement;

        if (this.timepicker.clockFace !== null) {
          this.timepicker.animationManager.handleAnimationSwitchTipsMode();
        }

        if (this.timepicker._options.clockType === '24h' && this.timepicker.clockFace !== null) {
          if (Number(this.timepicker.hour.value) > 12 || this.timepicker.hour.value === '00') {
            this.timepicker.clockManager.setCircleClockClasses24h();
          } else {
            this.timepicker.clockManager.removeCircleClockClasses24h();
          }

          if (!this.timepicker._options.mobile) {
            this.timepicker.tipsWrapperFor24h?.classList.remove('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        this.timepicker.clockManager.setHoursToClock(target.value);
        this.timepicker.minutes.classList.remove(selectorActive);
        this.timepicker.hour.classList.add(selectorActive);

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          const initClockFace = new ClockFaceManager({
            clockFace: this.timepicker.clockFace,
            tipsWrapper: this.timepicker.tipsWrapper,
            array: hasClass(this.timepicker.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (
            this.timepicker._disabledTime?.value.startType === this.timepicker._disabledTime?.value.endType
          ) {
            setTimeout(() => {
              if (
                this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
              ) {
                initClockFace.updateDisable({
                  hoursToUpdate: this.timepicker._disabledTime?.value?.rangeArrHour,
                  ...this.getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this.getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createEventWithCallback(
          this.timepicker._element,
          'selecthourmode',
          'timepicker:select-hour',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectHour,
        );

        if (this.timepicker.clockFace !== null) this.timepicker.circle.classList.remove('small-circle');
      });
    });

    this.timepicker.hour?.addEventListener('blur', (e: Event) =>
      this.handleClasses24h(e, this.timepicker.hour),
    );
    this.timepicker.hour?.addEventListener('focus', (e: Event) =>
      this.handleClasses24h(e, this.timepicker.hour),
    );
  };

  /** @internal */
  handleMinutesEvents = () => {
    this.timepicker._inputEvents.forEach((el) => {
      this.timepicker.minutes.addEventListener(el, (ev: Event) => {
        const target = ev.target as HTMLInputElement;

        if (this.timepicker.clockFace !== null) {
          this.timepicker.animationManager.handleAnimationSwitchTipsMode();
          this.timepicker.clockManager.setMinutesToClock(target.value);
        }

        if (this.timepicker._options.clockType === '24h') {
          this.timepicker.clockManager.removeCircleClockClasses24h();

          if (!this.timepicker._options.mobile) {
            this.timepicker.tipsWrapperFor24h?.classList.add('timepicker-ui-tips-wrapper-24h-disabled');
          }
        }

        this.timepicker.hour.classList.remove(selectorActive);
        this.timepicker.minutes.classList.add(selectorActive);

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          const initClockFace = new ClockFaceManager({
            clockFace: this.timepicker.clockFace,
            tipsWrapper: this.timepicker.tipsWrapper,
            array: hasClass(this.timepicker.hour, selectorActive) ? getNumberOfHours12 : getNumberOfMinutes,
          });

          if (
            this.timepicker._disabledTime?.value.startType === this.timepicker._disabledTime?.value.endType
          ) {
            setTimeout(() => {
              if (
                this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
              ) {
                initClockFace.updateDisable({
                  hoursToUpdate: this.timepicker._disabledTime?.value?.rangeArrHour,
                  ...this.getDestructuringObj(),
                });
              } else {
                initClockFace.clean();
              }
            }, 300);
          } else {
            setTimeout(() => {
              initClockFace.updateDisable({
                ...this.getDestructuringObj(true),
              });
            }, 300);
          }
        }

        createEventWithCallback(
          this.timepicker._element,
          'selectminutemode',
          'timepicker:select-minute',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectMinute,
        );
      });
    });

    this.timepicker.minutes?.addEventListener('blur', (e: Event) =>
      this.handleClasses24h(e, this.timepicker.minutes),
    );
    this.timepicker.minutes?.addEventListener('focus', (e: Event) =>
      this.handleClasses24h(e, this.timepicker.minutes),
    );
  };

  /** @internal */
  handleEventToMoveHand = (event: TouchEvent) => {
    // eslint-disable-next-line no-unused-vars
    const { target: t, type, touches } = event;
    const target = t as Element;

    const { incrementMinutes, incrementHours, switchToMinutesAfterSelectHour } = this.timepicker._options;

    if (!getClickTouchPosition(event, this.timepicker.clockFace)) return;

    const obj = getClickTouchPosition(event, this.timepicker.clockFace);

    const clockFaceRadius = this.timepicker.clockFace.offsetWidth / 2;

    const rtangens = obj && Math.atan2(obj.y - clockFaceRadius, obj.x - clockFaceRadius);

    if (type === 'mouseup' || type === 'touchend') {
      this.timepicker._isTouchMouseMove = false;

      if (
        switchToMinutesAfterSelectHour &&
        (hasClass(target, 'timepicker-ui-value-tips') ||
          hasClass(target, 'timepicker-ui-value-tips-24h') ||
          hasClass(target, 'timepicker-ui-tips-wrapper'))
      ) {
        this.timepicker.minutes.click();
      }

      return;
    }

    if (type === 'mousedown' || type === 'mousemove' || type === 'touchmove' || type === 'touchstart') {
      if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
        if (
          (hasClass(target, 'timepicker-ui-clock-face') ||
            hasClass(target, 'timepicker-ui-circle-hand') ||
            hasClass(target, 'timepicker-ui-hour-time-12') ||
            hasClass(target, 'timepicker-ui-minutes-time') ||
            hasClass(target, 'timepicker-ui-clock-hand') ||
            hasClass(target, 'timepicker-ui-value-tips') ||
            hasClass(target, 'timepicker-ui-value-tips-24h') ||
            hasClass(target, 'timepicker-ui-tips-wrapper') ||
            hasClass(target, 'timepicker-ui-tips-wrapper-24h')) &&
          !hasClass(target, 'timepicker-ui-tips-disabled')
        ) {
          event.preventDefault();
          this.timepicker._isTouchMouseMove = true;
        } else {
          this.timepicker._isTouchMouseMove = false;
        }
      }
    }

    if (!this.timepicker._isTouchMouseMove) return;

    if (this.timepicker.minutesTips !== null) {
      this.timepicker.minutes.classList.add(selectorActive);
      let deg =
        rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementMinutes, 6);

      if (deg === undefined) return;

      let minute: number;

      if (deg < 0) {
        minute = Math.round(360 + deg / 6) % 60;
        deg = 360 + Math.round(deg / 6) * 6;
      } else {
        minute = Math.round(deg / 6) % 60;
        deg = Math.round(deg / 6) * 6;
      }

      if (!this.timepicker._disabledTime?.value.isInterval) {
        if (
          this.timepicker._disabledTime?.value?.minutes?.includes(minute <= 9 ? `0${minute}` : `${minute}`)
        ) {
          return;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.timepicker._disabledTime?.value.endType === this.timepicker._disabledTime?.value.startType) {
          if (
            this.timepicker._disabledTime?.value?.endMinutes?.includes(
              minute <= 9 ? `0${minute}` : `${minute}`,
            ) &&
            this.timepicker.hour.value === this.timepicker._disabledTime?.value?.removedEndHour &&
            this.timepicker._disabledTime?.value.endType === this.timepicker.activeTypeMode?.textContent
          ) {
            return;
          }

          if (
            this.timepicker._disabledTime?.value?.startMinutes?.includes(
              minute <= 9 ? `0${minute}` : `${minute}`,
            ) &&
            this.timepicker.hour.value === this.timepicker._disabledTime?.value?.removedStartedHour &&
            this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
          ) {
            return;
          }
        } else {
          if (this.timepicker.activeTypeMode?.textContent === this.timepicker._disabledTime?.value.endType) {
            if (
              (this.timepicker._disabledTime?.value?.endMinutes?.includes(
                minute <= 9 ? `0${minute}` : `${minute}`,
              ) &&
                this.timepicker._disabledTime?.value.removedPmHour === this.timepicker.hour.value) ||
              this.timepicker._disabledTime?.value.pmHours
                .map(Number)
                .includes(Number(this.timepicker.hour.value))
            ) {
              return;
            }
          }
          if (
            this.timepicker.activeTypeMode?.textContent === this.timepicker._disabledTime?.value.startType
          ) {
            if (
              (this.timepicker._disabledTime?.value?.startMinutes?.includes(
                minute <= 9 ? `0${minute}` : `${minute}`,
              ) &&
                this.timepicker._disabledTime?.value.removedAmHour === this.timepicker.hour.value) ||
              this.timepicker._disabledTime?.value.amHours
                .map(Number)
                .includes(Number(this.timepicker.hour.value))
            ) {
              return;
            }
          }
        }
      }

      this.timepicker.minutes.value = minute >= 10 ? `${minute}` : `0${minute}`;
      this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;

      this.timepicker._degreesMinutes = deg;

      this.timepicker.clockManager.toggleClassActiveToValueTips(this.timepicker.minutes.value);
      this.timepicker.clockManager.removeBgColorToCirleWithMinutesTips();
      this.timepicker.clockManager.setBgColorToCircleWithMinutesTips();

      createEventWithCallback(
        this.timepicker._element,
        'update',
        'timepicker:update',
        {
          ...getInputValue(
            this.timepicker.input as unknown as HTMLInputElement,
            this.timepicker._options.clockType,
          ),
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
          eventType: type,
          type: this.timepicker.activeTypeMode?.dataset.type,
        },
        this.timepicker._options.onUpdate,
      );
    }

    const myLocation = touches ? touches[0] : undefined;
    const realTarget =
      touches && myLocation
        ? (document.elementFromPoint(myLocation.clientX, myLocation.clientY) as HTMLDivElement)
        : null;

    if (this.timepicker.hourTips !== null) {
      this.timepicker.hour?.classList.add(selectorActive);
      if (
        !hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') &&
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled') &&
        (hasClass(realTarget || target, 'timepicker-ui-value-tips') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper'))
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this.timepicker._degreesHours = deg as number;

        if (deg === undefined) return;

        let hour: number;

        if (deg < 0) {
          hour = Math.round(360 + deg / 30) % 12;
          deg = 360 + deg;
        } else {
          hour = Math.round(deg / 30) % 12;
          if (hour === 0 || hour > 12) hour = 12;
        }

        const isInterval = this.timepicker._disabledTime?.value.isInterval ? 'rangeArrHour' : 'hours';

        if (
          this.timepicker._disabledTime?.value.endType === this.timepicker._disabledTime?.value?.startType
        ) {
          if (typeof this.timepicker._disabledTime?.value?.endType === 'string') {
            if (
              this.timepicker._disabledTime?.value?.endType === this.timepicker.activeTypeMode?.textContent &&
              this.timepicker._disabledTime?.value?.startType === this.timepicker.activeTypeMode?.textContent
            ) {
              if (this.timepicker._disabledTime?.value[isInterval]?.includes(hour.toString())) {
                return;
              }
            }
          } else if (this.timepicker._disabledTime?.value[isInterval]?.includes(hour.toString())) {
            return;
          }
        } else {
          if (
            this.timepicker._disabledTime?.value.startType === this.timepicker.activeTypeMode?.textContent
          ) {
            if (this.timepicker._disabledTime?.value.amHours.includes(hour.toString())) {
              return;
            }
          }

          if (this.timepicker._disabledTime?.value.endType === this.timepicker.activeTypeMode?.textContent) {
            if (this.timepicker._disabledTime?.value.pmHours.includes(hour.toString())) {
              return;
            }
          }
        }

        this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.timepicker.hour.value = hour > 9 ? `${hour}` : `0${hour}`;

        this.timepicker.clockManager.removeCircleClockClasses24h();
        this.timepicker.clockManager.toggleClassActiveToValueTips(hour);
      }

      if (
        (hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper-24h')) &&
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled')
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours, 30);

        this.timepicker._degreesHours = deg as number;

        let hour: number | string;

        if (deg === undefined) return;

        if (deg < 0) {
          hour = Math.round(360 + deg / 30) % 24;
          deg = 360 + deg;
        } else {
          hour = Math.round(deg / 30) + 12;

          if (hour === 12) {
            hour = '00';
          }
        }

        const isInterval = this.timepicker._disabledTime?.value.isInterval ? 'rangeArrHour' : 'hours';

        if (this.timepicker._disabledTime?.value[isInterval]?.includes(hour.toString())) {
          return;
        }

        this.timepicker.clockManager.setCircleClockClasses24h();

        this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.timepicker.hour.value = `${hour}`;

        this.timepicker.clockManager.toggleClassActiveToValueTips(hour);
      }

      createEventWithCallback(
        this.timepicker._element,
        'update',
        'timepicker:update',
        {
          ...getInputValue(
            this.timepicker.input as unknown as HTMLInputElement,
            this.timepicker._options.clockType,
          ),
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
          eventType: type,
          type: this.timepicker.activeTypeMode?.dataset.type,
        },
        this.timepicker._options.onUpdate,
      );
    }
  };

  /** @internal */
  handleMoveHand = () => {
    if (this.timepicker._options.mobile || this.timepicker._isMobileView) return;

    allEvents.split(' ').forEach((event) => {
      if (event === 'touchstart' || event === 'touchmove' || event === 'touchend') {
        document.addEventListener(event, this.timepicker._mutliEventsMoveHandler, {
          passive: false,
        });
      } else {
        document.addEventListener(event, this.timepicker._mutliEventsMoveHandler, false);
      }
    });
  };

  /** @internal */
  handleClickOnHourMobile = () => {
    document.addEventListener('mousedown', this.timepicker._eventsClickMobileHandler);
    document.addEventListener('touchstart', this.timepicker._eventsClickMobileHandler);
  };

  /** @internal */
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

  /** @internal */
  handleIconChangeView = async (): Promise<void> => {
    if (this.timepicker._options.enableSwitchIcon) {
      if (getBrowser()) {
        this.timepicker.keyboardClockIcon.addEventListener(
          'touchstart',
          this.timepicker.configManager.handlerViewChange(),
        );
      } else {
        this.timepicker.keyboardClockIcon.addEventListener(
          'click',
          this.timepicker.configManager.handlerViewChange(),
        );
      }
    }
  };

  /** @internal */
  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.timepicker.modalElement) {
      const value = getInputValue(
        this.timepicker.input as unknown as HTMLInputElement,
        this.timepicker._options.clockType,
      );

      createEventWithCallback(
        this.timepicker._element,
        'cancel',
        'timepicker:cancel',
        {
          ...value,
          hourNotAccepted: this.timepicker.hour.value,
          minutesNotAccepted: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        },
        this.timepicker._options.onCancel,
      );

      this.timepicker.close()();
    }
  };

  /** @internal */
  handleEscClick = () => {
    document.addEventListener('keydown', this.handleKeyPress);
  };

  /** @internal */
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

      this.timepicker.wrapper.addEventListener('keydown', ({ key, shiftKey, target: t }: KeyboardEvent) => {
        const target = t as HTMLDivElement;

        if (key === 'Tab') {
          if (shiftKey) {
            if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
            }
          } else if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
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
      });
    }, 100);
  };

  /**
   * @description Handle real-time input updates for inline mode
   */
  /** @internal */
  handleInlineAutoUpdate = () => {
    if (!this.timepicker._options.inline?.enabled || this.timepicker._options.inline.autoUpdate === false) {
      return;
    }

    const updateInput = () => {
      const currentHour = this.timepicker.hour?.value;
      const currentMinutes = this.timepicker.minutes?.value;
      const currentType = this.timepicker.activeTypeMode?.textContent;

      if (currentHour && currentMinutes) {
        let timeString = '';
        if (this.timepicker._options.clockType === '24h') {
          const hour = currentHour.padStart(2, '0');
          const minutes = currentMinutes.padStart(2, '0');
          timeString = `${hour}:${minutes}`;
        } else {
          const hour = currentHour;
          const minutes = currentMinutes.padStart(2, '0');
          const type = currentType || 'AM';
          timeString = `${hour}:${minutes} ${type}`;
        }

        if (this.timepicker.input) {
          this.timepicker.input.value = timeString;

          const changeEvent = new Event('change', { bubbles: true });
          this.timepicker.input.dispatchEvent(changeEvent);

          createEventWithCallback(
            this.timepicker._element,
            'accept',
            'timepicker:confirm',
            {
              hour: currentHour,
              minutes: currentMinutes,
              type: currentType,
              degreesHours: this.timepicker._degreesHours,
              degreesMinutes: this.timepicker._degreesMinutes,
            },
            this.timepicker._options.onConfirm,
          );
        }
      }
    };

    const events = ['input', 'change'];

    events.forEach((eventType) => {
      this.timepicker.hour?.addEventListener(eventType, () => {
        setTimeout(updateInput, 50);
      });

      this.timepicker.minutes?.addEventListener(eventType, () => {
        setTimeout(updateInput, 50);
      });
    });

    if (this.timepicker._options.clockType !== '24h') {
      this.timepicker._clickTouchEvents.forEach((eventType: string) => {
        this.timepicker.AM?.addEventListener(eventType, () => {
          setTimeout(updateInput, 50);
        });

        this.timepicker.PM?.addEventListener(eventType, () => {
          setTimeout(updateInput, 50);
        });
      });
    }

    this.timepicker.clockFace?.addEventListener('click', () => {
      setTimeout(updateInput, 100);
    });
  };
}
