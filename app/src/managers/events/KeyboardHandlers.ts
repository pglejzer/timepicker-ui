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
      if (e.key === 'Enter' && !this.core.isDestroyed && !this.core.isOpen) {
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
      if (!this.core.isOpen) return;
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

    const SPIN_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

    if (hour) {
      const hourKeyHandler = (e: KeyboardEvent): void => {
        if (this.core.isDestroyed) return;
        if (!SPIN_KEYS.includes(e.key)) return;

        e.preventDefault();
        const currentValue = parseInt(hour.value) || 0;
        const max = parseInt(hour.getAttribute('max') || '23');
        const is12h = this.core.options.clock.type === '12h';
        const min = is12h ? 1 : 0;
        const pageStep = 3;

        const newValue = this.computeSpinValue(e.key, currentValue, min, max, pageStep);

        hour.value = newValue.toString().padStart(2, '0');
        hour.setAttribute('aria-valuenow', hour.value);
        hour.setAttribute('aria-valuetext', hour.value);

        const modal = this.core.getModalElement();
        const prefix = this.core.options.labels.announceHour ?? 'Hour';
        announceToScreenReader(modal, `${prefix}: ${hour.value}`);

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
        if (!SPIN_KEYS.includes(e.key)) return;

        e.preventDefault();
        const currentValue = parseInt(minutes.value) || 0;
        const max = 59;
        const min = 0;
        const pageStep = 5;

        const newValue = this.computeSpinValue(e.key, currentValue, min, max, pageStep);

        minutes.value = newValue.toString().padStart(2, '0');
        minutes.setAttribute('aria-valuenow', minutes.value);
        minutes.setAttribute('aria-valuetext', minutes.value);

        const modal = this.core.getModalElement();
        const prefix = this.core.options.labels.announceMinute ?? 'Minutes';
        announceToScreenReader(modal, `${prefix}: ${minutes.value}`);

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

  private computeSpinValue(
    key: string,
    currentValue: number,
    min: number,
    max: number,
    pageStep: number,
  ): number {
    switch (key) {
      case 'ArrowUp':
        return currentValue >= max ? min : currentValue + 1;
      case 'ArrowDown':
        return currentValue <= min ? max : currentValue - 1;
      case 'Home':
        return min;
      case 'End':
        return max;
      case 'PageUp':
        return Math.min(max, currentValue + pageStep);
      case 'PageDown':
        return Math.max(min, currentValue - pageStep);
      default:
        return currentValue;
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

      const candidates = wrapper.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const focusableElements: HTMLElement[] = [];
      candidates.forEach((el) => {
        if (el.getAttribute('aria-disabled') === 'true') return;
        if (el.hasAttribute('disabled')) return;
        if (el.hidden) return;
        if (el.getAttribute('aria-hidden') === 'true') return;
        if (el.offsetParent === null && el.getClientRects().length === 0) return;
        focusableElements.push(el);
      });

      if (focusableElements.length === 0) return;

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
