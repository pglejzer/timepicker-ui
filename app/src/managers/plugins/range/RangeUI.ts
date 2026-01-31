import type { CoreState } from '../../../timepicker/CoreState';
import type { RangeState } from './RangeState';
import { formatDisplayTime } from './utils';

export class RangeUI {
  private readonly core: CoreState;
  private readonly state: RangeState;

  constructor(core: CoreState, state: RangeState) {
    this.core = core;
    this.state = state;
  }

  updateTabs(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-from');
    const toBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-to');

    const isFromActive = this.state.getActivePart() === 'from';
    const isFromComplete = this.state.isFromComplete();

    fromBtn?.classList.toggle('active', isFromActive);
    toBtn?.classList.toggle('active', !isFromActive);
    toBtn?.classList.toggle('disabled', !isFromComplete);

    fromBtn?.setAttribute('aria-selected', String(isFromActive));
    toBtn?.setAttribute('aria-selected', String(!isFromActive));
    toBtn?.setAttribute('aria-disabled', String(!isFromComplete));

    fromBtn?.setAttribute('tabindex', isFromActive ? '0' : '-1');
    toBtn?.setAttribute('tabindex', isFromActive || !isFromComplete ? '-1' : '0');
  }

  updateTimeDisplay(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromTimeEl = modal.querySelector('.tp-ui-range-from-time');
    const toTimeEl = modal.querySelector('.tp-ui-range-to-time');

    const activePart = this.state.getActivePart();
    const previewValue = this.state.getPreviewValue();
    const fromValue = this.state.getFromValue();
    const toValue = this.state.getToValue();

    const fromDisplay =
      activePart === 'from' && previewValue
        ? formatDisplayTime(previewValue)
        : fromValue
          ? formatDisplayTime(fromValue)
          : '--:--';

    const toDisplay =
      activePart === 'to' && previewValue
        ? formatDisplayTime(previewValue)
        : toValue
          ? formatDisplayTime(toValue)
          : '--:--';

    if (fromTimeEl) fromTimeEl.textContent = fromDisplay;
    if (toTimeEl) toTimeEl.textContent = toDisplay;
  }

  updateOkButton(): void {
    const okBtn = this.core.getOkButton();
    if (!okBtn) return;

    const canConfirm = this.state.canConfirm();
    okBtn.classList.toggle('disabled', !canConfirm);
    okBtn.setAttribute('aria-disabled', String(!canConfirm));
  }

  updateInputValue(): void {
    const input = this.core.getInput();
    if (!input) return;

    const fromValue = this.state.getFromValue();
    const toValue = this.state.getToValue();

    const from = fromValue ? formatDisplayTime(fromValue) : '--:--';
    const to = toValue ? formatDisplayTime(toValue) : '--:--';

    input.value = `${from} - ${to}`;
  }

  syncClockToActivePart(): void {
    const value = this.state.getSavedValue();
    const hourInput = this.core.getHour();
    const minutesInput = this.core.getMinutes();

    if (hourInput) {
      hourInput.value = value?.hour ?? '12';
    }
    if (minutesInput) {
      minutesInput.value = value?.minutes ?? '00';
    }

    if (this.core.options.clock.type === '12h') {
      const am = this.core.getAM();
      const pm = this.core.getPM();

      if (value?.type === 'AM') {
        am?.classList.add('active');
        pm?.classList.remove('active');
      } else if (value?.type === 'PM') {
        pm?.classList.add('active');
        am?.classList.remove('active');
      } else {
        am?.classList.remove('active');
        pm?.classList.remove('active');
      }
    }

    if (minutesInput) {
      minutesInput.blur();
      minutesInput.classList.remove('active');
    }

    if (hourInput) {
      hourInput.click();
    }
  }

  updateAll(): void {
    this.updateTabs();
    this.updateTimeDisplay();
    this.updateOkButton();
    this.updateInputValue();
  }
}

