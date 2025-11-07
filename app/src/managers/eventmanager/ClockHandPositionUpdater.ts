import {
  hasClass,
  createEventWithCallback,
  getClickTouchPosition,
  getIncrementTimes,
} from '../../utils/config';
import { getInputValue } from '../../utils/input';
import { checkedDisabledValuesInterval } from '../../utils/time/disable';
import { selectorActive } from '../../utils/variables';
import { announceToScreenReader } from '../../utils/accessibility';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class ClockHandPositionUpdater {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  updateHandPosition = (event: MouseEvent | TouchEvent) => {
    const { target: t, type } = event;
    const target = t as Element;
    const { incrementMinutes, incrementHours } = this.timepicker._options;

    if (!getClickTouchPosition(event as TouchEvent, this.timepicker.clockFace)) return;

    const obj = getClickTouchPosition(event as TouchEvent, this.timepicker.clockFace);
    const clockFaceRadius = this.timepicker.clockFace.offsetWidth / 2;
    const rtangens = obj && Math.atan2(obj.y - clockFaceRadius, obj.x - clockFaceRadius);

    if (this.timepicker.minutesTips !== null) {
      this.timepicker.minutes.classList.add(selectorActive);
      let deg =
        rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementMinutes ?? 1, 6);

      if (deg === undefined) return;

      let minute: number;

      if (deg < 0) {
        minute = Math.round(360 + deg / 6) % 60;
        deg = 360 + Math.round(deg / 6) * 6;
      } else {
        minute = Math.round(deg / 6) % 60;
        deg = Math.round(deg / 6) * 6;
      }

      if (!this.timepicker?._disabledTime?.value?.isInterval) {
        const disabledMinutes = this.timepicker._disabledTime?.value?.minutes;
        if (disabledMinutes && Array.isArray(disabledMinutes)) {
          if (disabledMinutes.includes(minute <= 9 ? `0${minute}` : `${minute}`)) {
            return;
          }
        }
      } else {
        const minuteStr = minute <= 9 ? `0${minute}` : `${minute}`;
        const hourStr = this.timepicker.hour.value;
        const typeStr = this.timepicker.activeTypeMode?.textContent || '';

        const isDisabled = !checkedDisabledValuesInterval(
          hourStr,
          minuteStr,
          typeStr,
          this.timepicker._disabledTime.value.intervals,
          this.timepicker._options.clockType,
        );

        if (isDisabled) {
          return;
        }
      }

      this.timepicker.minutes.value = minute >= 10 ? `${minute}` : `0${minute}`;

      this.timepicker.domBatcher.schedule(() => {
        this.timepicker.minutes.setAttribute('aria-valuenow', this.timepicker.minutes.value);
        this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;
      });

      this.timepicker._degreesMinutes = deg;

      if (this.timepicker.clockManager) {
        this.timepicker.clockManager.toggleClassActiveToValueTips(this.timepicker.minutes.value);
        this.timepicker.clockManager.removeBgColorToCirleWithMinutesTips();
        this.timepicker.clockManager.setBgColorToCircleWithMinutesTips();
      }

      announceToScreenReader(this.timepicker.modalElement, `Minute ${this.timepicker.minutes.value}`);

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
          eventType: type as 'click' | 'change',
          type: this.timepicker.activeTypeMode?.dataset.type,
        },
        this.timepicker._options.onUpdate,
        this.timepicker,
      );
    }

    const touches = (event as TouchEvent).touches;
    const myLocation = touches ? touches[0] : undefined;
    const realTarget =
      touches && myLocation
        ? (document.elementFromPoint(myLocation.clientX, myLocation.clientY) as HTMLDivElement)
        : null;

    if (this.timepicker.hourTips !== null) {
      this.timepicker.hour?.classList.add(selectorActive);

      const is24hMode = this.timepicker._options.clockType === '24h';
      let isInnerCircle = false;

      if (is24hMode) {
        const clockFaceRadius = this.timepicker.clockFace.offsetWidth / 2;
        const distanceFromCenter = obj
          ? Math.sqrt(Math.pow(obj.x - clockFaceRadius, 2) + Math.pow(obj.y - clockFaceRadius, 2))
          : 0;
        const innerRadius = clockFaceRadius * 0.6;
        isInnerCircle = distanceFromCenter < innerRadius;
      }

      if (
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled') &&
        (!is24hMode || !isInnerCircle) &&
        (hasClass(realTarget || target, 'timepicker-ui-value-tips') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper') ||
          hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper-24h'))
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours ?? 1, 30);

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

        if (!this.timepicker._disabledTime?.value?.isInterval) {
          const disabledHours = this.timepicker._disabledTime?.value?.hours;
          if (disabledHours && Array.isArray(disabledHours)) {
            if (disabledHours.includes(hour.toString())) {
              return;
            }
          }
        } else {
          const hourStr = hour > 9 ? `${hour}` : `0${hour}`;
          const typeStr = this.timepicker.activeTypeMode?.textContent || '';

          let allMinutesDisabled = true;
          for (let m = 0; m < 60; m++) {
            const minuteStr = m <= 9 ? `0${m}` : `${m}`;
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

        this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.timepicker.hour.value = hour > 9 ? `${hour}` : `0${hour}`;
        this.timepicker.hour.setAttribute('aria-valuenow', this.timepicker.hour.value);

        if (this.timepicker.clockManager) {
          this.timepicker.clockManager.removeCircleClockClasses24h();
          this.timepicker.clockManager.toggleClassActiveToValueTips(hour);
        }

        announceToScreenReader(this.timepicker.modalElement, `Hour ${this.timepicker.hour.value}`);
      }

      if (
        is24hMode &&
        !hasClass(realTarget || target, 'timepicker-ui-tips-disabled') &&
        isInnerCircle &&
        (hasClass(realTarget || target, 'timepicker-ui-value-tips-24h') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper-24h') ||
          hasClass(realTarget || target, 'timepicker-ui-value-tips') ||
          hasClass(realTarget || target, 'timepicker-ui-tips-wrapper'))
      ) {
        let deg =
          rtangens && getIncrementTimes(Math.trunc((rtangens * 180) / Math.PI) + 90, incrementHours ?? 1, 30);

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

        if (!this.timepicker._disabledTime?.value?.isInterval) {
          const disabledHours = this.timepicker._disabledTime?.value?.hours;
          if (disabledHours && Array.isArray(disabledHours)) {
            if (disabledHours.includes(hour.toString())) {
              return;
            }
          }
        } else {
          const hourStr = typeof hour === 'number' ? (hour <= 9 ? `0${hour}` : `${hour}`) : hour;

          let allMinutesDisabled = true;
          for (let m = 0; m < 60; m++) {
            const minuteStr = m <= 9 ? `0${m}` : `${m}`;
            const isEnabled = checkedDisabledValuesInterval(
              hourStr,
              minuteStr,
              '',
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

        if (this.timepicker.clockManager) {
          this.timepicker.clockManager.setCircleClockClasses24h();
        }

        this.timepicker.clockHand.style.transform = `rotateZ(${deg}deg)`;
        this.timepicker.hour.value = `${hour}`;
        this.timepicker.hour.setAttribute('aria-valuenow', this.timepicker.hour.value);

        if (this.timepicker.clockManager) {
          this.timepicker.clockManager.toggleClassActiveToValueTips(hour);
        }

        announceToScreenReader(this.timepicker.modalElement, `Hour ${this.timepicker.hour.value}`);
      }

      createEventWithCallback(
        this.timepicker._element,
        '',
        'timepicker:update',
        {
          ...getInputValue(
            this.timepicker.input as unknown as HTMLInputElement,
            this.timepicker._options.clockType,
          ),
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
          eventType: type as 'click' | 'change',
          type: this.timepicker.activeTypeMode?.dataset.type,
        },
        this.timepicker._options.onUpdate,
        this.timepicker,
      );
    }
  };
}
