import { trackPointerModality } from '../../utils/accessibility';
import { runCleanups } from '../../utils/managerHelpers';
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

    let pressedInDialog = false;
    const onPointerDown = (e: Event): void => {
      pressedInDialog = e.target !== modal;
    };
    const onPointerUp = (e: Event): void => {
      pressedInDialog ||= e.target !== modal;
    };
    const handler = (e: Event): void => {
      if (!this.core.isDestroyed && e.target === modal && !pressedInDialog) {
        this.emitter.emit('cancel', {});
      }
    };

    modal.addEventListener('pointerdown', onPointerDown);
    modal.addEventListener('pointerup', onPointerUp);
    modal.addEventListener('click', handler);
    this.cleanupHandlers.push(() => {
      modal.removeEventListener('pointerdown', onPointerDown);
      modal.removeEventListener('pointerup', onPointerUp);
      modal.removeEventListener('click', handler);
    });
  }

  handlePointerModality(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    this.cleanupHandlers.push(trackPointerModality(modal));
  }

  detach(): void {
    runCleanups(this.cleanupHandlers);
  }

  destroy(): void {
    this.detach();
  }
}

