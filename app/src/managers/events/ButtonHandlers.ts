import { announceToScreenReader, updateAriaPressed } from '../../utils/accessibility';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';

export class ButtonHandlers {
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

  handleAmClick(): void {
    const AM = this.core.getAM();
    if (!AM) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      const PM = this.core.getPM();
      AM.classList.add('active');
      PM?.classList.remove('active');

      updateAriaPressed(AM, true);
      updateAriaPressed(PM, false);

      const modal = this.core.getModalElement();
      announceToScreenReader(modal, 'AM selected');

      this.emitter.emit('select:am', {});

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      this.emitter.emit('update', {
        hour: hour?.value,
        minutes: minutes?.value,
        type: 'AM',
      });
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

      updateAriaPressed(PM, true);
      updateAriaPressed(AM, false);

      const modal = this.core.getModalElement();
      announceToScreenReader(modal, 'PM selected');

      this.emitter.emit('select:pm', {});

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      this.emitter.emit('update', {
        hour: hour?.value,
        minutes: minutes?.value,
        type: 'PM',
      });
    };

    PM.addEventListener('click', handler);
    this.cleanupHandlers.push(() => PM.removeEventListener('click', handler));
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

