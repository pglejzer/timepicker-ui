import { createEventWithCallback } from '../../utils/config';
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

        this.timepicker.clockManager?.updateAmPm();

        const eventData = {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        };

        createEventWithCallback(
          this.timepicker._element,
          'timepicker:select-am',
          eventData,
          this.timepicker._options.onSelectAM,
        );

        this.timepicker.emit?.('select:am', eventData);
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

        this.timepicker.clockManager?.updateAmPm();

        const eventData = {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        };

        createEventWithCallback(
          this.timepicker._element,
          'timepicker:select-pm',
          eventData,
          this.timepicker._options.onSelectPM,
        );

        this.timepicker.emit?.('select:pm', eventData);
      };

      this.timepicker.PM.addEventListener(el, handler);
      this.cleanupHandlers.push(() => {
        this.timepicker.PM?.removeEventListener(el, handler);
      });
    });
  };
}
