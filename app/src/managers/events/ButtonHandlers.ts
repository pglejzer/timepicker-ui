import {
  announceToScreenReader,
  setActivePeriod,
  bindActivate,
  setElementDisabled,
} from '../../utils/accessibility';
import { bindEmitter, requestOpen, runCleanups } from '../../utils/managerHelpers';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import type { ConfirmEventData } from '../../types/types';
import { buildUpdatePayload, isTimeDisabled } from './timeFields';

export class ButtonHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];
  private persistentCleanups: Array<() => void> = [];
  private okBlocked = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleOpenOnClick(): void {
    const openElements = this.core.getOpenElement();
    if (!openElements) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      requestOpen(this.emitter);
    };

    openElements.forEach((el) => {
      this.persistentCleanups.push(bindActivate(el as HTMLElement, handler));
    });
  }

  handleCancelButton(): void {
    const cancelButton = this.core.getCancelButton();
    if (!cancelButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.emitter.emit('cancel', {});
    };

    this.cleanupHandlers.push(bindActivate(cancelButton as HTMLElement, handler));
  }

  handleOkButton(): void {
    const okButton = this.core.getOkButton();
    if (!okButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      if (okButton.getAttribute('aria-disabled') === 'true') return;

      if (this.core.getHour() && this.core.getMinutes()) {
        this.emitter.emit('confirm', buildUpdatePayload(this.core));
        return;
      }

      const modal = this.core.getModalElement();
      if (modal) {
        this.emitter.emit('confirm', this.readWheelCenter(modal));
      }
    };

    this.cleanupHandlers.push(bindActivate(okButton as HTMLElement, handler));
    this.blockOkOnDisabledTime(okButton);
  }

  private blockOkOnDisabledTime(okButton: HTMLElement): void {
    if (this.core.options.range?.enabled) return;

    const sync = (): void => {
      const blocked = isTimeDisabled(this.core);
      if (!blocked && !this.okBlocked) return;
      this.okBlocked = blocked;
      setElementDisabled(okButton, blocked);
    };

    sync();
    bindEmitter(this.emitter, this.cleanupHandlers, 'update', ({ hour }) => {
      if (hour) sync();
    });
  }

  private readWheelCenter(modal: HTMLElement): ConfirmEventData {
    const center = (column: string): string | undefined => {
      const item = modal.querySelector(`.tp-ui-wheel-${column} .tp-ui-wheel-item.is-center`);
      return item?.getAttribute('data-value') ?? undefined;
    };

    const selection: ConfirmEventData = {
      hour: center('hours'),
      minutes: center('minutes'),
      type: center('ampm'),
    };

    if (this.core.options.clock.showSeconds) {
      selection.seconds = center('seconds');
    }

    return selection;
  }

  handleAmClick(): void {
    const AM = this.core.getAM();
    if (!AM) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      setActivePeriod(AM, this.core.getPM(), 'AM');

      const modal = this.core.getModalElement();
      announceToScreenReader(modal, this.core.options.labels.announceAmSelected!);

      this.emitter.emit('select:am', {});
      this.emitter.emit('update', { ...buildUpdatePayload(this.core), type: 'AM' });
    };

    this.cleanupHandlers.push(bindActivate(AM, handler));
  }

  handlePmClick(): void {
    const PM = this.core.getPM();
    if (!PM) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      setActivePeriod(this.core.getAM(), PM, 'PM');

      const modal = this.core.getModalElement();
      announceToScreenReader(modal, this.core.options.labels.announcePmSelected!);

      this.emitter.emit('select:pm', {});
      this.emitter.emit('update', { ...buildUpdatePayload(this.core), type: 'PM' });
    };

    this.cleanupHandlers.push(bindActivate(PM, handler));
  }

  handleSwitchViewButton(): void {
    const switchButton = this.core.getKeyboardClockIcon();
    if (!switchButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.emitter.emit('switch:view', {});
    };

    this.cleanupHandlers.push(bindActivate(switchButton, handler));
  }

  detach(): void {
    runCleanups(this.cleanupHandlers);
  }

  destroy(): void {
    this.detach();
    runCleanups(this.persistentCleanups);
  }
}
