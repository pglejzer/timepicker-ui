import { isDocument } from '../utils/node';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';

export default class EventManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleOpenOnClick(): void {
    const openElements = this.core.getOpenElement();
    if (!openElements) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.emitter.emit('show', {});
    };

    openElements.forEach((el) => {
      el.addEventListener('click', handler);
      this.cleanupHandlers.push(() => el.removeEventListener('click', handler));
    });
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

  handleCancelButton(): void {
    const cancelButton = this.core.getCancelButton();
    if (!cancelButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.emitter.emit('cancel', {});
    };

    cancelButton.addEventListener('click', handler);
    this.cleanupHandlers.push(() => cancelButton.removeEventListener('click', handler));
  }

  handleOkButton(): void {
    const okButton = this.core.getOkButton();
    if (!okButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      const activeTypeMode = this.core.getActiveTypeMode();

      this.emitter.emit('confirm', {
        hour: hour?.value,
        minutes: minutes?.value,
        type: activeTypeMode?.textContent || undefined,
      });
    };

    okButton.addEventListener('click', handler);
    this.cleanupHandlers.push(() => okButton.removeEventListener('click', handler));
  }

  handleBackdropClick(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const handler = (e: MouseEvent): void => {
      if (this.core.isDestroyed) return;
      if (e.target === modal) {
        this.emitter.emit('cancel', {});
      }
    };

    modal.addEventListener('click', handler);
    this.cleanupHandlers.push(() => modal.removeEventListener('click', handler));
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

  handleAmClick(): void {
    const AM = this.core.getAM();
    if (!AM) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      const PM = this.core.getPM();
      AM.classList.add('active');
      PM?.classList.remove('active');
      this.emitter.emit('select:am', {});
    };

    AM.addEventListener('click', handler);
    this.cleanupHandlers.push(() => AM.removeEventListener('click', handler));
  }

  handlePmClick(): void {
    const PM = this.core.getPM();
    if (!PM) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      const AM = this.core.getAM();
      PM.classList.add('active');
      AM?.classList.remove('active');
      this.emitter.emit('select:pm', {});
    };

    PM.addEventListener('click', handler);
    this.cleanupHandlers.push(() => PM.removeEventListener('click', handler));
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
    };

    hour.addEventListener('click', handler);
    this.cleanupHandlers.push(() => hour.removeEventListener('click', handler));

    if (this.core.options.ui.editable) {
      let previousValue = hour.value;
      const blurHandler = (): void => {
        if (this.core.isDestroyed) return;
        if (hour.value !== previousValue) {
          previousValue = hour.value;
          this.emitter.emit('animation:clock', {});
          this.emitter.emit('select:hour', { hour: hour.value });
        }
      };

      hour.addEventListener('blur', blurHandler);
      this.cleanupHandlers.push(() => hour.removeEventListener('blur', blurHandler));
    }
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
    };

    minutes.addEventListener('click', handler);
    this.cleanupHandlers.push(() => minutes.removeEventListener('click', handler));
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
            // Tryb 12h: 1-12, po 12 wraca do 1
            newValue = currentValue >= 12 ? 1 : currentValue + 1;
          } else {
            // Tryb 24h: 0-23, po 23 wraca do 0
            newValue = currentValue >= max ? 0 : currentValue + 1;
          }
        } else {
          if (is12h) {
            // Tryb 12h: po 1 wraca do 12
            newValue = currentValue <= 1 ? 12 : currentValue - 1;
          } else {
            // Tryb 24h: po 0 wraca do 23
            newValue = currentValue <= 0 ? max : currentValue - 1;
          }
        }

        hour.value = newValue.toString().padStart(2, '0');
        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:hour', { hour: hour.value });
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
        this.emitter.emit('animation:clock', {});
        this.emitter.emit('select:minute', { minutes: minutes.value });
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

  handleMoveHand(): void {
    if (isDocument() === false) {
      return;
    }

    const onDragStart = (e: MouseEvent | TouchEvent): void => {
      if (this.core.isDestroyed) return;
      e.preventDefault();
    };

    document.addEventListener('mousedown', onDragStart, false);
    document.addEventListener('touchstart', onDragStart, { passive: false });

    this.cleanupHandlers.push(() => {
      document.removeEventListener('mousedown', onDragStart);
      document.removeEventListener('touchstart', onDragStart);
    });
  }

  handleSwitchViewButton(): void {
    const switchButton = this.core.getKeyboardClockIcon();
    if (!switchButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.emitter.emit('switch:view', {});
    };

    switchButton.addEventListener('click', handler);
    this.cleanupHandlers.push(() => switchButton.removeEventListener('click', handler));
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}
