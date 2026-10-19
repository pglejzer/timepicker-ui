import type { CoreState } from '../../../timepicker/CoreState';
import type { RangeState } from './RangeState';
import type { RangePart, RangeValue } from './types';
import { formatDisplayTime, formatRangePart, getTimePlaceholder } from './utils';
import { setActivePeriod, setSpinbuttonValue } from '../../../utils/accessibility';
import { activateField } from '../../events/timeFields';

interface ActivePartInputs {
  hourInput: HTMLInputElement | null;
  minutesInput: HTMLInputElement | null;
  secondsInput: HTMLInputElement | null;
}

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
    const isToAvailable = this.state.canSwitchToEnd() || this.state.getPendingFrom() !== null;

    fromBtn?.classList.toggle('active', isFromActive);
    toBtn?.classList.toggle('active', !isFromActive);
    toBtn?.classList.toggle('disabled', !isToAvailable);

    fromBtn?.setAttribute('aria-selected', String(isFromActive));
    toBtn?.setAttribute('aria-selected', String(!isFromActive));
    toBtn?.setAttribute('aria-disabled', String(!isToAvailable));

    fromBtn?.setAttribute('tabindex', isFromActive ? '0' : '-1');
    toBtn?.setAttribute('tabindex', isFromActive || !isToAvailable ? '-1' : '0');
  }

  updateTimeDisplay(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromTimeEl = modal.querySelector('.tp-ui-range-from-time');
    const toTimeEl = modal.querySelector('.tp-ui-range-to-time');

    const activePart = this.state.getActivePart();
    const previewValue = this.state.getPreviewValue();
    const displayOf = (part: RangePart, saved: RangeValue | null): RangeValue | null =>
      activePart === part && previewValue ? previewValue : saved;

    this.renderTime(fromTimeEl, displayOf('from', this.state.getFromValue()));
    this.renderTime(toTimeEl, displayOf('to', this.state.getToValue()));
  }

  private renderTime(element: Element | null, value: RangeValue | null): void {
    if (!element) return;

    const { showSeconds } = this.state;
    if (value) {
      element.textContent = formatDisplayTime(value, showSeconds);
      element.removeAttribute('aria-hidden');
    } else {
      element.textContent = getTimePlaceholder(showSeconds);
      element.setAttribute('aria-hidden', 'true');
    }
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

    const { showSeconds } = this.state;
    const from = formatRangePart(this.state.getFromValue(), showSeconds);
    const to = formatRangePart(this.state.getToValue(), showSeconds);

    input.value = `${from} - ${to}`;
  }

  syncClockToActivePart(): void {
    const { hourInput, minutesInput, secondsInput } = this.writeActivePartValues();

    [minutesInput, secondsInput].forEach((input) => {
      input?.blur();
      input?.classList.remove('active');
    });

    if (hourInput) {
      hourInput.click();
    }
  }

  showActivePartHours(): HTMLInputElement | null {
    const { hourInput } = this.writeActivePartValues();
    if (hourInput) {
      activateField(this.core, 'hour');
    }
    return hourInput;
  }

  private writeActivePartValues(): ActivePartInputs {
    const value = this.state.getSavedValue();
    const hourInput = this.core.getHour();
    const minutesInput = this.core.getMinutes();
    const secondsInput = this.state.showSeconds ? this.core.getSeconds() : null;

    setSpinbuttonValue(hourInput, value?.hour ?? '12');
    setSpinbuttonValue(minutesInput, value?.minutes ?? '00');
    setSpinbuttonValue(secondsInput, value?.seconds ?? '00');

    if (this.core.options.clock.type === '12h') {
      setActivePeriod(this.core.getAM(), this.core.getPM(), value?.type);
    }

    return { hourInput, minutesInput, secondsInput };
  }

  updateAll(): void {
    this.updateTabs();
    this.updateTimeDisplay();
    this.updateOkButton();
  }
}
