import { createEventWithCallback } from '../../utils/config';
import ClockFaceManager from '../ClockFaceManager';
import { selectorActive } from '../../utils/variables';
import { announceToScreenReader, updateAriaPressed } from '../../utils/accessibility';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class TypeModeHandlers {
  private timepicker: ITimepickerUI;
  private cleanupHandlers: Array<() => void>;

  constructor(timepicker: ITimepickerUI, cleanupHandlers: Array<() => void>) {
    this.timepicker = timepicker;
    this.cleanupHandlers = cleanupHandlers;
  }

  handleAmClick = () => {
    this.timepicker._clickTouchEvents.forEach((e: string) => {
      const handler = (ev: Event) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.timepicker.PM.classList.remove(selectorActive);

        updateAriaPressed(target as HTMLElement, true);
        updateAriaPressed(this.timepicker.PM, false);

        announceToScreenReader(this.timepicker.modalElement, 'AM selected');

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          setTimeout(() => {
            const initClockFace = this.timepicker.clockFacePool.acquire({
              clockFace: this.timepicker.clockFace,
              tipsWrapper: this.timepicker.tipsWrapper,
              disabledTime: this.timepicker._disabledTime?.value,
              clockType: this.timepicker._options.clockType,
              activeTypeMode: 'AM',
            });
            initClockFace.updateDisable(this.timepicker.hour.value, 'AM');
            this.timepicker.clockFacePool.release(initClockFace);
          }, 300);
        }

        createEventWithCallback(
          this.timepicker._element,
          '',
          'timepicker:select-am',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectAM,
          this.timepicker,
        );
      };

      this.timepicker.AM.addEventListener(e, handler);
      this.cleanupHandlers.push(() => {
        this.timepicker.AM?.removeEventListener(e, handler);
      });
    });
  };

  handlePmClick = () => {
    this.timepicker._clickTouchEvents.forEach((el: string) => {
      const handler = (ev: Event) => {
        const target = ev.target as Element;

        target.classList.add(selectorActive);
        this.timepicker.AM.classList.remove(selectorActive);

        updateAriaPressed(target as HTMLElement, true);
        updateAriaPressed(this.timepicker.AM, false);

        announceToScreenReader(this.timepicker.modalElement, 'PM selected');

        if (this.timepicker._options.clockType === '12h' && this.timepicker._options.disabledTime?.interval) {
          setTimeout(() => {
            const initClockFace = this.timepicker.clockFacePool.acquire({
              clockFace: this.timepicker.clockFace,
              tipsWrapper: this.timepicker.tipsWrapper,
              disabledTime: this.timepicker._disabledTime?.value,
              clockType: this.timepicker._options.clockType,
              activeTypeMode: 'PM',
            });
            initClockFace.updateDisable(this.timepicker.hour.value, 'PM');
            this.timepicker.clockFacePool.release(initClockFace);
          }, 300);
        }

        createEventWithCallback(
          this.timepicker._element,
          '',
          'timepicker:select-pm',
          {
            hour: this.timepicker.hour.value,
            minutes: this.timepicker.minutes.value,
            type: this.timepicker.activeTypeMode?.dataset.type,
            degreesHours: this.timepicker._degreesHours,
            degreesMinutes: this.timepicker._degreesMinutes,
          },
          this.timepicker._options.onSelectPM,
          this.timepicker,
        );
      };

      this.timepicker.PM.addEventListener(el, handler);
      this.cleanupHandlers.push(() => {
        this.timepicker.PM?.removeEventListener(el, handler);
      });
    });
  };
}

