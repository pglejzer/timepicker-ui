import { createEventWithCallback } from '../../utils/config';
import { selectorActive } from '../../utils/variables';
import type { ITimepickerUI } from '../../types/ITimepickerUI';
import { sanitizeTimeInput } from '../../utils/validation';

export default class InputHandlers {
  private timepicker: ITimepickerUI;
  private cleanupHandlers: Array<() => void>;
  private hourEventHandlers = new Map<string, EventListener>();
  private minuteEventHandlers = new Map<string, EventListener>();

  constructor(timepicker: ITimepickerUI, cleanupHandlers: Array<() => void>) {
    this.timepicker = timepicker;
    this.cleanupHandlers = cleanupHandlers;
  }

  handleClasses24h = (ev: Event, element?: HTMLInputElement, shouldClick = false) => {
    const target = ev.target as HTMLInputElement;
    const relatedTarget = (ev as FocusEvent).relatedTarget as HTMLElement | null;

    if (this.timepicker.hourTips) {
      if (this.timepicker._options.clockType === '24h') {
        if (Number(target.textContent) > 12 || Number(target.textContent) === 0) {
          if (this.timepicker.clockManager) {
            this.timepicker.clockManager.setCircleClockClasses24h();
          }
        } else {
          if (this.timepicker.clockManager) {
            this.timepicker.clockManager.removeCircleClockClasses24h();
          }
        }

        if (!this.timepicker._options.mobile) {
          this.timepicker.tipsWrapperFor24h?.classList.remove('none');
        }
      }
    }

    if (!target || !element) return;

    element.value = sanitizeTimeInput((target.value as string).replace(/\D+/g, ''));

    if (shouldClick && relatedTarget) {
      const isGoingToAMPM =
        relatedTarget.classList.contains('timepicker-ui-am') ||
        relatedTarget.classList.contains('timepicker-ui-pm');
      if (!isGoingToAMPM) {
        element.click();
      }
    } else if (shouldClick) {
      element.click();
    }
  };

  handleHourEvents = () => {
    this.hourEventHandlers.forEach((handler, eventType) => {
      this.timepicker.hour?.removeEventListener(eventType, handler);
    });
    this.hourEventHandlers.clear();

    this.timepicker._inputEvents.forEach((el: string) => {
      const handler = (ev: Event) => {
        const target = ev.target as HTMLInputElement;

        if (this.timepicker.clockFace !== null && this.timepicker.animationManager) {
          this.timepicker.animationManager.handleAnimationSwitchTipsMode();
        }

        if (this.timepicker._options.clockType === '24h' && this.timepicker.clockFace !== null) {
          if (Number(this.timepicker.hour.value) > 12 || this.timepicker.hour.value === '00') {
            if (this.timepicker.clockManager) {
              this.timepicker.clockManager.setCircleClockClasses24h();
            }
          } else {
            if (this.timepicker.clockManager) {
              this.timepicker.clockManager.removeCircleClockClasses24h();
            }
          }

          if (!this.timepicker._options.mobile) {
            this.timepicker.tipsWrapperFor24h?.classList.remove('none');
          }
        }

        if (this.timepicker.clockManager) {
          this.timepicker.clockManager.setHoursToClock(target.value);
        }
        this.timepicker.minutes.classList.remove(selectorActive);
        this.timepicker.hour.classList.add(selectorActive);

        const eventData = {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        };

        createEventWithCallback(
          this.timepicker._element,
          'timepicker:select-hour',
          eventData,
          this.timepicker._options.onSelectHour,
        );

        this.timepicker.emit?.('select:hour', eventData);

        if (this.timepicker.clockFace !== null) this.timepicker.circle.classList.remove('small-circle');
      };

      this.timepicker.hour?.addEventListener(el, handler);
      this.hourEventHandlers.set(el, handler);
    });

    const blurHandler = (e: Event) => this.handleClasses24h(e, this.timepicker.hour, true);
    const focusHandler = (e: Event) => this.handleClasses24h(e, this.timepicker.hour, false);

    this.timepicker.hour?.addEventListener('blur', blurHandler);
    this.timepicker.hour?.addEventListener('focus', focusHandler);

    this.hourEventHandlers.set('blur', blurHandler);
    this.hourEventHandlers.set('focus', focusHandler);
  };

  handleMinutesEvents = () => {
    this.minuteEventHandlers.forEach((handler, eventType) => {
      this.timepicker.minutes?.removeEventListener(eventType, handler);
    });
    this.minuteEventHandlers.clear();

    this.timepicker._inputEvents.forEach((el) => {
      const handler = (ev: Event) => {
        const target = ev.target as HTMLInputElement;

        if (this.timepicker.clockFace !== null) {
          if (this.timepicker.animationManager) {
            this.timepicker.animationManager.handleAnimationSwitchTipsMode();
          }
          if (this.timepicker.clockManager) {
            this.timepicker.clockManager.setMinutesToClock(target.value);
          }
        }

        if (this.timepicker._options.clockType === '24h') {
          if (this.timepicker.clockManager) {
            this.timepicker.clockManager.removeCircleClockClasses24h();
          }

          if (!this.timepicker._options.mobile) {
            this.timepicker.tipsWrapperFor24h?.classList.add('none');
          }
        }

        this.timepicker.hour.classList.remove(selectorActive);
        this.timepicker.minutes.classList.add(selectorActive);

        const eventData = {
          hour: this.timepicker.hour.value,
          minutes: this.timepicker.minutes.value,
          type: this.timepicker.activeTypeMode?.dataset.type,
          degreesHours: this.timepicker._degreesHours,
          degreesMinutes: this.timepicker._degreesMinutes,
        };

        createEventWithCallback(
          this.timepicker._element,
          'timepicker:select-minute',
          eventData,
          this.timepicker._options.onSelectMinute,
        );

        this.timepicker.emit?.('select:minute', eventData);
      };

      this.timepicker.minutes.addEventListener(el, handler);
      this.minuteEventHandlers.set(el, handler);
    });

    const blurHandler = (e: Event) => this.handleClasses24h(e, this.timepicker.minutes, true);
    const focusHandler = (e: Event) => this.handleClasses24h(e, this.timepicker.minutes, false);

    this.timepicker.minutes?.addEventListener('blur', blurHandler);
    this.timepicker.minutes?.addEventListener('focus', focusHandler);

    this.minuteEventHandlers.set('blur', blurHandler);
    this.minuteEventHandlers.set('focus', focusHandler);
  };

  destroy(): void {
    this.hourEventHandlers.forEach((handler, eventType) => {
      this.timepicker.hour?.removeEventListener(eventType, handler);
    });
    this.hourEventHandlers.clear();

    this.minuteEventHandlers.forEach((handler, eventType) => {
      this.timepicker.minutes?.removeEventListener(eventType, handler);
    });
    this.minuteEventHandlers.clear();
  }
}
