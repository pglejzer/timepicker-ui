import { announceToScreenReader, updateAriaPressed, bindActivate } from '../../utils/accessibility';
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
      this.cleanupHandlers.push(bindActivate(el as HTMLElement, handler));
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

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();

      if (hour && minutes) {
        const activeTypeMode = this.core.getActiveTypeMode();
        this.emitter.emit('confirm', {
          hour: hour.value,
          minutes: minutes.value,
          type: activeTypeMode?.textContent || undefined,
        });
        return;
      }

      const modal = this.core.getModalElement();
      if (modal) {
        const centerHour = modal.querySelector<HTMLDivElement>(
          '.tp-ui-wheel-hours .tp-ui-wheel-item.is-center',
        );
        const centerMinute = modal.querySelector<HTMLDivElement>(
          '.tp-ui-wheel-minutes .tp-ui-wheel-item.is-center',
        );
        const centerAmpm = modal.querySelector<HTMLDivElement>(
          '.tp-ui-wheel-ampm .tp-ui-wheel-item.is-center',
        );

        this.emitter.emit('confirm', {
          hour: centerHour?.getAttribute('data-value') ?? undefined,
          minutes: centerMinute?.getAttribute('data-value') ?? undefined,
          type: centerAmpm?.getAttribute('data-value') ?? undefined,
        });
      }
    };

    this.cleanupHandlers.push(bindActivate(okButton as HTMLElement, handler));
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
      announceToScreenReader(modal, this.core.options.labels.announceAmSelected ?? 'AM selected');

      this.emitter.emit('select:am', {});

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      this.emitter.emit('update', {
        hour: hour?.value,
        minutes: minutes?.value,
        type: 'AM',
      });
    };

    this.cleanupHandlers.push(bindActivate(AM, handler));
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
      announceToScreenReader(modal, this.core.options.labels.announcePmSelected ?? 'PM selected');

      this.emitter.emit('select:pm', {});

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      this.emitter.emit('update', {
        hour: hour?.value,
        minutes: minutes?.value,
        type: 'PM',
      });
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

    this.cleanupHandlers.push(bindActivate(switchButton as HTMLElement, handler));
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}
