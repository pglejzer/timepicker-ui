import { createEventWithCallback } from '../../utils/config';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class InlineHandlers {
  private timepicker: ITimepickerUI;
  private cleanupHandlers: Array<() => void>;

  constructor(timepicker: ITimepickerUI, cleanupHandlers: Array<() => void>) {
    this.timepicker = timepicker;
    this.cleanupHandlers = cleanupHandlers;
  }

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
            '',
            'timepicker:confirm',
            {
              hour: currentHour,
              minutes: currentMinutes,
              type: currentType,
              degreesHours: this.timepicker._degreesHours,
              degreesMinutes: this.timepicker._degreesMinutes,
            },
            this.timepicker._options.onConfirm,
            this.timepicker,
          );
        }
      }
    };

    const events = ['input', 'change'];

    events.forEach((eventType) => {
      const hourHandler = () => setTimeout(updateInput, 50);
      const minutesHandler = () => setTimeout(updateInput, 50);

      this.timepicker.hour?.addEventListener(eventType, hourHandler);
      this.timepicker.minutes?.addEventListener(eventType, minutesHandler);

      this.cleanupHandlers.push(() => {
        this.timepicker.hour?.removeEventListener(eventType, hourHandler);
        this.timepicker.minutes?.removeEventListener(eventType, minutesHandler);
      });
    });

    if (this.timepicker._options.clockType !== '24h') {
      this.timepicker._clickTouchEvents.forEach((eventType: string) => {
        const amHandler = () => setTimeout(updateInput, 50);
        const pmHandler = () => setTimeout(updateInput, 50);

        this.timepicker.AM?.addEventListener(eventType, amHandler);
        this.timepicker.PM?.addEventListener(eventType, pmHandler);

        this.cleanupHandlers.push(() => {
          this.timepicker.AM?.removeEventListener(eventType, amHandler);
          this.timepicker.PM?.removeEventListener(eventType, pmHandler);
        });
      });
    }

    const clockFaceHandler = () => setTimeout(updateInput, 100);
    this.timepicker.clockFace?.addEventListener('click', clockFaceHandler);
    this.cleanupHandlers.push(() => {
      this.timepicker.clockFace?.removeEventListener('click', clockFaceHandler);
    });
  };
}

