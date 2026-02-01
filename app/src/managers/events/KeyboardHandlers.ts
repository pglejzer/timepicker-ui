import { isDocument } from '../../utils/node';
import { announceToScreenReader } from '../../utils/accessibility';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';

export class KeyboardHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleOpenOnEnterFocus(): void {
    const input = this.core.getInput();
    if (!input) return;

    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' && !this.core.isDestroyed) {
        this.emitter.emit('show', {});
      }
    };

    input.addEventListener('keydown', handler);
    this.cleanupHandlers.push(() => input.removeEventListener('keydown', handler));
  }

  handleEscClick(): void {
    if (isDocument() === false) {
      return;
    }

    const handler = (e: KeyboardEvent): void => {
      if (this.core.isDestroyed) return;
      if (e.key === 'Escape') {
        this.emitter.emit('cancel', {});
      }
    };

    document.addEventListener('keydown', handler);
    this.cleanupHandlers.push(() => document.removeEventListener('keydown', handler));
  }

  handleKeyboardInput(): void {
    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();

    if (hour) {
      const hourKeyHandler = (e: KeyboardEvent): void => {
        if (this.core.isDestroyed) return;
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

        e.preventDefault();
        const currentValue = parseInt(hour.value) || 0;
        const max = parseInt(hour.getAttribute('max') || '23');
        const min = parseInt(hour.getAttribute('min') || '0');
        const is12h = this.core.options.clock.type === '12h';

        let newValue: number;
        if (e.key === 'ArrowUp') {
          if (is12h) {
            newValue = currentValue >= 12 ? 1 : currentValue + 1;
          } else {
            newValue = currentValue >= max ? 0 : currentValue + 1;
          }
        } else {
          if (is12h) {
            newValue = currentValue <= 1 ? 12 : currentValue - 1;
          } else {
            newValue = currentValue <= 0 ? max : currentValue - 1;
          }
        }

        hour.value = newValue.toString().padStart(2, '0');
        hour.setAttribute('aria-valuenow', hour.value);

        const modal = this.core.getModalElement();
        announceToScreenReader(modal, `Hour: ${hour.value}`);

        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:hour', { hour: hour.value });

        const mins = this.core.getMinutes();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hour.value,
          minutes: mins?.value,
          type: activeTypeMode?.textContent || undefined,
        });
      };

      hour.addEventListener('keydown', hourKeyHandler);
      this.cleanupHandlers.push(() => hour.removeEventListener('keydown', hourKeyHandler));
    }

    if (minutes) {
      const minutesKeyHandler = (e: KeyboardEvent): void => {
        if (this.core.isDestroyed) return;
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

        e.preventDefault();
        const currentValue = parseInt(minutes.value) || 0;
        const max = 59;
        const min = 0;

        let newValue: number;
        if (e.key === 'ArrowUp') {
          newValue = currentValue >= max ? min : currentValue + 1;
        } else {
          newValue = currentValue <= min ? max : currentValue - 1;
        }

        minutes.value = newValue.toString().padStart(2, '0');
        minutes.setAttribute('aria-valuenow', minutes.value);

        const modal = this.core.getModalElement();
        announceToScreenReader(modal, `Minutes: ${minutes.value}`);

        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:minute', { minutes: minutes.value });

        const hr = this.core.getHour();
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('update', {
          hour: hr?.value,
          minutes: minutes.value,
          type: activeTypeMode?.textContent || undefined,
        });
      };

      minutes.addEventListener('keydown', minutesKeyHandler);
      this.cleanupHandlers.push(() => minutes.removeEventListener('keydown', minutesKeyHandler));
    }
  }

  focusTrapHandler(): void {
    if (isDocument() === false) {
      return;
    }

    const wrapper = this.core.getWrapper();
    if (!wrapper) return;

    const handler = (e: KeyboardEvent): void => {
      if (this.core.isDestroyed) return;
      if (e.key !== 'Tab') return;

      const focusableElements = wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    };

    wrapper.addEventListener('keydown', handler);
    this.cleanupHandlers.push(() => wrapper.removeEventListener('keydown', handler));
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}

