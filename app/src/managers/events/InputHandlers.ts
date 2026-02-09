import { clampHourValue, clampMinuteValue } from '../../utils/input/clamp';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';

export class InputHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleHourEvents(): void {
    const hour = this.core.getHour();
    if (!hour) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      hour.classList.add('active');
      const minutes = this.core.getMinutes();
      minutes?.classList.remove('active');
      this.emitter.emit('select:hour', { hour: hour.value });

      const activeTypeMode = this.core.getActiveTypeMode();
      this.emitter.emit('update', {
        hour: hour.value,
        minutes: minutes?.value,
        type: activeTypeMode?.textContent || undefined,
      });
    };

    hour.addEventListener('click', handler);
    this.cleanupHandlers.push(() => hour.removeEventListener('click', handler));

    let previousValue = hour.value;
    const blurHandler = (): void => {
      if (this.core.isDestroyed) return;

      if (hour.hasAttribute('readonly')) return;

      const is12h = this.core.options.clock.type === '12h';
      const clampedValue = clampHourValue(hour.value, is12h);
      hour.value = clampedValue;
      hour.setAttribute('aria-valuenow', clampedValue);

      if (hour.value !== previousValue) {
        previousValue = hour.value;
        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:hour', { hour: hour.value });

        const minutes = this.core.getMinutes();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hour.value,
          minutes: minutes?.value,
          type: activeTypeMode?.textContent || undefined,
        });
      }
    };

    hour.addEventListener('blur', blurHandler);
    this.cleanupHandlers.push(() => hour.removeEventListener('blur', blurHandler));
  }

  handleMinutesEvents(): void {
    const minutes = this.core.getMinutes();
    if (!minutes) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      minutes.classList.add('active');
      const hour = this.core.getHour();
      hour?.classList.remove('active');
      this.emitter.emit('select:minute', { minutes: minutes.value });

      const activeTypeMode = this.core.getActiveTypeMode();
      this.emitter.emit('update', {
        hour: hour?.value,
        minutes: minutes.value,
        type: activeTypeMode?.textContent || undefined,
      });
    };

    minutes.addEventListener('click', handler);
    this.cleanupHandlers.push(() => minutes.removeEventListener('click', handler));

    let previousValue = minutes.value;
    const blurHandler = (): void => {
      if (this.core.isDestroyed) return;

      if (minutes.hasAttribute('readonly')) return;

      const clampedValue = clampMinuteValue(minutes.value);
      minutes.value = clampedValue;
      minutes.setAttribute('aria-valuenow', clampedValue);

      if (minutes.value !== previousValue) {
        previousValue = minutes.value;
        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:minute', { minutes: minutes.value });

        const hour = this.core.getHour();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hour?.value,
          minutes: minutes.value,
          type: activeTypeMode?.textContent || undefined,
        });
      }
    };

    minutes.addEventListener('blur', blurHandler);
    this.cleanupHandlers.push(() => minutes.removeEventListener('blur', blurHandler));
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}
