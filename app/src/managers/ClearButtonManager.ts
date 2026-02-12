import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { announceToScreenReader } from '../utils/accessibility';

export default class ClearButtonManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  init(): void {
    if (!this.core.options.ui.enableClearButton) return;

    const clearButton = this.getClearButton();
    if (!clearButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.handleClearClick();
    };

    clearButton.addEventListener('click', handler);
    this.cleanupHandlers.push(() => clearButton.removeEventListener('click', handler));

    this.setupInternalEventListeners();
  }

  private setupInternalEventListeners(): void {
    this.emitter.on('update', () => {
      this.updateClearButtonState();
      this.updateConfirmButtonState();
    });

    this.emitter.on('open', () => {
      this.updateClearButtonState();
    });

    this.emitter.on('select:hour', () => {
      this.updateClearButtonState();
    });

    this.emitter.on('select:minute', () => {
      this.updateClearButtonState();
    });
  }

  private handleClearClick(): void {
    const input = this.core.getInput();
    const previousValue = input?.value || null;

    this.clearTimeValue();
    this.resetClockToNeutral();
    this.disableConfirmButton();

    const modal = this.core.getModalElement();
    announceToScreenReader(modal, 'Time cleared');

    this.emitter.emit('clear', { previousValue });
    this.emitter.emit('update', {
      hour: undefined,
      minutes: undefined,
      type: undefined,
    });

    const { callbacks } = this.core.options;
    if (callbacks.onClear) {
      callbacks.onClear({ previousValue });
    }
  }

  private clearTimeValue(): void {
    const input = this.core.getInput();
    if (input) {
      input.value = '';
    }

    this.core.setDegreesHours(null);
    this.core.setDegreesMinutes(null);

    if (this.core.options.range?.enabled) {
      this.clearRangeValues();
    }

    if (this.core.options.timezone?.enabled) {
      this.clearTimezoneValue();
    }
  }

  private resetClockToNeutral(): void {
    const clockType = this.core.options.clock.type;
    const neutralHour = clockType === '12h' ? '12' : '12';
    const neutralMinutes = '00';
    const neutralType = clockType === '12h' ? 'PM' : undefined;

    const hourInput = this.core.getHour();
    const minuteInput = this.core.getMinutes();

    if (hourInput) {
      hourInput.value = neutralHour;
      hourInput.removeAttribute('aria-valuenow');
    }

    if (minuteInput) {
      minuteInput.value = neutralMinutes;
      minuteInput.removeAttribute('aria-valuenow');
    }

    const clockHand = this.core.getClockHand();
    if (clockHand) {
      const originalTransition = clockHand.style.transition;
      clockHand.style.transition = 'none';
      clockHand.style.transform = 'rotateZ(0deg)';

      void clockHand.offsetHeight;

      requestAnimationFrame(() => {
        clockHand.style.transition = originalTransition;
      });
    }

    this.removeActiveStates();

    if (hourInput) {
      hourInput.click();
    }

    if (clockType === '12h' && neutralType) {
      const amButton = this.core.getAM();
      const pmButton = this.core.getPM();

      amButton?.classList.remove('active');
      pmButton?.classList.remove('active');

      amButton?.setAttribute('aria-pressed', 'false');
      pmButton?.setAttribute('aria-pressed', 'false');

      pmButton?.classList.add('active');
      pmButton?.setAttribute('aria-pressed', 'true');
    }

    this.emitter.emit('animation:clock', {});
  }

  private removeActiveStates(): void {
    const allValueTips = this.core.getAllValueTips();
    allValueTips.forEach((tip) => {
      tip.classList.remove('active');
      tip.removeAttribute('aria-selected');
    });

    const hourInput = this.core.getHour();
    const minuteInput = this.core.getMinutes();

    hourInput?.removeAttribute('aria-valuenow');
    minuteInput?.removeAttribute('aria-valuenow');
  }

  private disableConfirmButton(): void {
    const okButton = this.core.getOkButton();
    if (!okButton) return;

    okButton.classList.add('disabled');
    okButton.setAttribute('aria-disabled', 'true');
  }

  private updateClearButtonState(): void {
    const clearButton = this.getClearButton();
    if (!clearButton) return;

    const input = this.core.getInput();
    const hasInputValue = input?.value && input.value.trim() !== '';

    const hourInput = this.core.getHour();
    const minuteInput = this.core.getMinutes();
    const activeTypeMode = this.core.getActiveTypeMode();

    const clockType = this.core.options.clock.type;
    const currentHour = hourInput?.value || '';
    const currentMinutes = minuteInput?.value || '';
    const currentType = activeTypeMode?.textContent || '';

    const isDefaultValue =
      clockType === '12h'
        ? currentHour === '12' && currentMinutes === '00' && currentType === 'PM'
        : currentHour === '12' && currentMinutes === '00';

    const hasChangedValue = !isDefaultValue;

    const shouldEnable = hasInputValue || hasChangedValue;

    clearButton.classList.toggle('disabled', !shouldEnable);
    clearButton.setAttribute('aria-disabled', String(!shouldEnable));
  }

  private updateConfirmButtonState(): void {
    const okButton = this.core.getOkButton();
    if (!okButton) return;

    const hourInput = this.core.getHour();
    const minuteInput = this.core.getMinutes();

    const hasHourValue = hourInput?.value && hourInput.value.trim() !== '';
    const hasMinuteValue = minuteInput?.value && minuteInput.value.trim() !== '';

    const hasSelection = hasHourValue && hasMinuteValue;

    if (hasSelection) {
      okButton.classList.remove('disabled');
      okButton.setAttribute('aria-disabled', 'false');
    }
  }

  private clearRangeValues(): void {
    const fromTab = this.getFromTab();
    const toTab = this.getToTab();
    const fromTime = this.getFromTimeDisplay();
    const toTime = this.getToTimeDisplay();

    if (fromTime) fromTime.textContent = '--:--';
    if (toTime) toTime.textContent = '--:--';

    fromTab?.classList.add('active');
    toTab?.classList.remove('active');

    fromTab?.setAttribute('aria-selected', 'true');
    toTab?.setAttribute('aria-selected', 'false');

    fromTab?.setAttribute('tabindex', '0');
    toTab?.setAttribute('tabindex', '-1');

    toTab?.classList.add('disabled');
    toTab?.setAttribute('aria-disabled', 'true');

    const hourInput = this.core.getHour();
    if (hourInput) {
      hourInput.focus();
    }

    this.emitter.emit('range:switch', {
      active: 'from',
      disabledTime: null,
    });
  }

  private clearTimezoneValue(): void {
    const dropdown = this.getTimezoneDropdown();
    const selected = this.getTimezoneSelected();

    if (selected) {
      const placeholder = selected.getAttribute('data-placeholder') || 'Timezone...';
      selected.textContent = placeholder;
    }

    dropdown?.setAttribute('aria-expanded', 'false');
  }

  private getClearButton(): HTMLButtonElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-clear-btn') || null;
  }

  private getFromTab(): HTMLButtonElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-range-from') || null;
  }

  private getToTab(): HTMLButtonElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-range-to') || null;
  }

  private getFromTimeDisplay(): HTMLElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-range-from-time') || null;
  }

  private getToTimeDisplay(): HTMLElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-range-to-time') || null;
  }

  private getTimezoneDropdown(): HTMLElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-timezone-dropdown') || null;
  }

  private getTimezoneSelected(): HTMLElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-timezone-selected') || null;
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
  }
}

