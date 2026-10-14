import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import {
  announceToScreenReader,
  bindActivate,
  setActivePeriod,
  setClass,
  setElementDisabled,
  setSpinbuttonValue,
} from '../utils/accessibility';
import { bindEmitter, runCleanups } from '../utils/managerHelpers';
import { TIME_FIELDS, TIME_FIELD_NAMES, getTimeInput, type TimeField } from './events/timeFields';

const NEUTRAL_VALUES: Readonly<Record<TimeField, string>> = { hour: '12', minutes: '00', seconds: '00' };

export default class ClearButtonManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];
  private wasCleared = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  init(): void {
    if (!this.core.options.ui.clearButton) return;

    const clearButton = this.getClearButton();
    if (!clearButton) return;

    const handler = (): void => {
      if (this.core.isDestroyed) return;
      this.handleClearClick();
    };

    this.cleanupHandlers.push(bindActivate(clearButton, handler));

    this.setupInternalEventListeners();
    this.updateClearButtonState();
  }

  private setupInternalEventListeners(): void {
    const refresh = (): void => this.updateClearButtonState();
    bindEmitter(this.emitter, this.cleanupHandlers, 'update', refresh);
    bindEmitter(this.emitter, this.cleanupHandlers, 'open', refresh);
    TIME_FIELD_NAMES.forEach((field) => {
      bindEmitter(this.emitter, this.cleanupHandlers, TIME_FIELDS[field].event, () => {
        refresh();
        this.reenableConfirmIfCleared();
      });
    });
  }

  private handleClearClick(): void {
    const input = this.core.getInput();
    const previousValue = input?.value || null;

    this.clearTimeValue();
    this.resetClockToNeutral();
    setElementDisabled(this.core.getOkButton(), true);
    this.wasCleared = true;

    const modal = this.core.getModalElement();
    announceToScreenReader(modal, this.core.options.labels.announceCleared!);

    this.emitter.emit('clear', { previousValue });
    this.emitter.emit('update', {
      hour: undefined,
      minutes: undefined,
      type: undefined,
    });
  }

  private clearTimeValue(): void {
    const shouldClearInput = this.core.options.clearBehavior?.clearInput !== false;
    const input = this.core.getInput();
    if (input && shouldClearInput) {
      input.value = '';
    }

    this.core.setDegreesHours(null);
    this.core.setDegreesMinutes(null);
    this.core.setDegreesSeconds(null);
  }

  private resetClockToNeutral(): void {
    const clockType = this.core.options.clock.type;
    const neutralType = clockType === '12h' ? 'PM' : undefined;

    TIME_FIELD_NAMES.forEach((field) => {
      setSpinbuttonValue(getTimeInput(this.core, field), NEUTRAL_VALUES[field]);
    });

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
    this.core.getHour()?.click();

    if (neutralType) {
      setActivePeriod(this.core.getAM(), this.core.getPM(), neutralType);
    }

    this.emitter.emit('animation:clock', {});
  }

  private removeActiveStates(): void {
    this.core.getAllValueTips().forEach((tip) => setClass(tip, 'active', false));
  }

  private updateClearButtonState(): void {
    const clearButton = this.getClearButton();
    if (!clearButton) return;

    const input = this.core.getInput();
    const hasInputValue = !!input?.value.trim();

    const clockType = this.core.options.clock.type;
    const currentHour = this.core.getHour()?.value || '';
    const currentMinutes = this.core.getMinutes()?.value || '';
    const currentSeconds = this.core.getSeconds()?.value || '';
    const currentType = this.core.getActiveType() ?? '';

    const hasSelection = currentHour !== '' || currentMinutes !== '' || currentSeconds !== '';
    const isDefaultValue =
      currentHour === NEUTRAL_VALUES.hour &&
      currentMinutes === NEUTRAL_VALUES.minutes &&
      (currentSeconds === '' || currentSeconds === NEUTRAL_VALUES.seconds) &&
      (clockType !== '12h' || currentType === 'PM');

    const hasChangedValue = hasSelection && !isDefaultValue;

    const shouldEnable = hasInputValue || hasChangedValue;

    setElementDisabled(clearButton, !shouldEnable);
  }

  private reenableConfirmIfCleared(): void {
    if (!this.wasCleared) return;

    const okButton = this.core.getOkButton();
    if (!okButton) return;

    setElementDisabled(okButton, false);
    this.wasCleared = false;
  }

  private getClearButton(): HTMLButtonElement | null {
    const modal = this.core.getModalElement();
    return modal?.querySelector('.tp-ui-clear-btn') || null;
  }

  detach(): void {
    runCleanups(this.cleanupHandlers);
  }

  destroy(): void {
    this.detach();
  }
}
