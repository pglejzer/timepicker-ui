import { isDocument } from '../../utils/node';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';

export class ModalHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
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

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}

