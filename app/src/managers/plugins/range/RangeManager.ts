import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { RangeMinuteCommitEventData } from '../../../types/types';
import type { RangePart, RangeValue, DisabledTimeConfig, FormattedRange } from './types';
import { RangeState } from './RangeState';
import { RangeUI } from './RangeUI';
import { parseRangeInput, formatDisplayTime } from './utils';
import { bindEmitter } from '../../../utils/managerHelpers';

export default class RangeManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly state: RangeState;
  private readonly ui: RangeUI;
  private cleanupHandlers: Array<() => void> = [];
  private isSyncingAmPm = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;

    const { range, clock } = core.options;
    this.state = new RangeState(clock.type as '12h' | '24h', range?.minDuration, range?.maxDuration, emitter);
    this.ui = new RangeUI(core, this.state);
  }

  private get isEnabled(): boolean {
    return this.core.options.range?.enabled === true;
  }

  init(): void {
    if (!this.isEnabled) return;

    const input = this.core.getInput();
    const inputValue = input?.value || '';
    const { from, to } = parseRangeInput(inputValue);

    this.state.setFromValue(from);
    this.state.setToValue(to);
    this.state.setActivePart('from');
    this.state.setPreviewValue(null);

    this.bindEvents();
    this.ui.syncClockToActivePart();
    this.emitAmPmSyncEvent();
    this.ui.updateAll();
  }

  getActivePart(): RangePart {
    return this.state.getActivePart();
  }

  setActivePart(part: RangePart): void {
    if (!this.isEnabled) return;

    const changed = this.state.setActivePart(part);

    if (changed) {
      this.emitter.emit('range:switch', {
        active: part,
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
    }

    this.ui.syncClockToActivePart();
    this.emitAmPmSyncEvent();
    this.ui.updateAll();
  }

  getFromValue(): RangeValue | null {
    return this.state.getFromValue();
  }

  getToValue(): RangeValue | null {
    return this.state.getToValue();
  }

  getDisabledTimeForEndPart(): DisabledTimeConfig | null {
    if (!this.isEnabled) return null;
    return this.state.getDisabledTimeForEndPart();
  }

  getDuration(): number {
    return this.state.getDuration();
  }

  validateRange(): { valid: boolean; duration: number } {
    if (!this.isEnabled) return { valid: true, duration: 0 };
    return this.state.validate();
  }

  canConfirm(): boolean {
    if (!this.isEnabled) return true;
    return this.state.canConfirm();
  }

  getFormattedRange(): FormattedRange | null {
    const from = this.state.getFromValue();
    const to = this.state.getToValue();

    if (!from || !to) return null;

    return {
      from: formatDisplayTime(from),
      to: formatDisplayTime(to),
    };
  }

  private bindEvents(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromBtn = modal.querySelector<HTMLElement>('.tp-ui-range-tab.tp-ui-range-from');
    const toBtn = modal.querySelector<HTMLElement>('.tp-ui-range-tab.tp-ui-range-to');

    if (fromBtn) {
      const handler = (): void => this.activatePart('from', fromBtn);
      fromBtn.addEventListener('click', handler);
      this.cleanupHandlers.push(() => fromBtn.removeEventListener('click', handler));
    }

    if (toBtn) {
      const handler = (): void => this.activatePart('to', toBtn);
      toBtn.addEventListener('click', handler);
      this.cleanupHandlers.push(() => toBtn.removeEventListener('click', handler));
    }

    this.bindTabKeyboard(fromBtn, toBtn);

    bindEmitter(this.emitter, this.cleanupHandlers, 'update', () => this.handleUpdate());
    bindEmitter(this.emitter, this.cleanupHandlers, 'range:minute:commit', (d) => this.handleMinuteCommit(d));
    bindEmitter(this.emitter, this.cleanupHandlers, 'confirm', () => this.handleConfirm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:am', () => this.handleAmPm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:pm', () => this.handleAmPm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => this.handleClear());
  }

  private isTabDisabled(btn: HTMLElement | null): boolean {
    return !btn || btn.getAttribute('aria-disabled') === 'true' || btn.classList.contains('disabled');
  }

  private activatePart(part: RangePart, btn: HTMLElement | null): void {
    if (this.isTabDisabled(btn)) return;
    this.setActivePart(part);
  }

  private bindTabKeyboard(fromBtn: HTMLElement | null, toBtn: HTMLElement | null): void {
    const tabs = [fromBtn, toBtn].filter((t): t is HTMLElement => t !== null);
    if (tabs.length === 0) return;

    tabs.forEach((tab, index) => {
      const part: RangePart = index === 0 ? 'from' : 'to';

      const handler = (e: KeyboardEvent): void => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowLeft': {
            e.preventDefault();
            const targetIndex = e.key === 'ArrowRight' ? index + 1 : index - 1;
            const wrapped = (targetIndex + tabs.length) % tabs.length;
            const target = tabs[wrapped];
            if (!this.isTabDisabled(target)) {
              target.focus();
            }
            break;
          }
          case 'Home':
            e.preventDefault();
            tabs[0].focus();
            break;
          case 'End':
            e.preventDefault();
            tabs[tabs.length - 1].focus();
            break;
          case 'Enter':
          case ' ':
          case 'Spacebar':
            e.preventDefault();
            this.activatePart(part, tab);
            break;
        }
      };

      tab.addEventListener('keydown', handler);
      this.cleanupHandlers.push(() => tab.removeEventListener('keydown', handler));
    });
  }

  private handleClear(): void {
    if (!this.isEnabled) return;

    this.state.setFromValue(null);
    this.state.setToValue(null);
    this.state.setPreviewValue(null);
    this.state.resetActivePart();
  }

  private handleUpdate(): void {
    if (!this.isEnabled) return;

    const hourInput = this.core.getHour();
    const minutesInput = this.core.getMinutes();
    const activeTypeMode = this.core.getActiveTypeMode();

    const hour = hourInput?.value ?? '12';
    const currentValue = this.state.getSavedValue();
    const hasMinutesSelected = currentValue?.minutes && currentValue.minutes !== '--';
    const minutes = hasMinutesSelected ? (minutesInput?.value ?? '--') : '--';
    const type =
      this.core.options.clock.type === '12h' ? (activeTypeMode?.textContent ?? undefined) : undefined;

    this.state.setPreviewValue({ hour, minutes, type });
    this.ui.updateAll();
  }

  private handleMinuteCommit(data: RangeMinuteCommitEventData): void {
    if (!this.isEnabled) return;

    const value: RangeValue = { hour: data.hour, minutes: data.minutes, type: data.type ?? undefined };
    const activePart = this.state.getActivePart();

    if (activePart === 'from') {
      this.state.setFromValue(value);
      this.state.setPreviewValue(null);

      if (this.state.isFromComplete()) {
        this.state.setActivePart('to');
        this.emitter.emit('range:switch', {
          active: 'to',
          disabledTime: this.state.getDisabledTimeForEndPart(),
        });
        this.ui.syncClockToActivePart();
        this.emitAmPmSyncEvent();
      }
    } else {
      this.state.setToValue(value);
      this.state.setPreviewValue(null);
    }

    this.state.validate();
    this.ui.updateAll();
  }

  private handleAmPm(): void {
    if (!this.isEnabled) return;
    if (this.isSyncingAmPm) return;
    if (this.core.options.clock.type !== '12h') return;

    const activeTypeMode = this.core.getActiveTypeMode();
    const type = activeTypeMode?.textContent;
    if (!type) return;

    const activePart = this.state.getActivePart();

    if (activePart === 'from') {
      const from = this.state.getFromValue();
      if (from) {
        this.state.setFromValue({ ...from, type });

        if (this.state.isFromComplete()) {
          this.state.setActivePart('to');
          this.state.setPreviewValue(null);
          this.emitter.emit('range:switch', {
            active: 'to',
            disabledTime: this.state.getDisabledTimeForEndPart(),
          });
          this.ui.syncClockToActivePart();
          this.emitAmPmSyncEvent();
        }
      }
    } else {
      const to = this.state.getToValue();
      if (to) {
        this.state.setToValue({ ...to, type });
      }
      this.emitter.emit('range:switch', {
        active: 'to',
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
    }

    this.state.validate();
    this.ui.updateAll();
  }

  private emitAmPmSyncEvent(): void {
    if (this.core.options.clock.type !== '12h') return;

    const savedValue = this.state.getSavedValue();
    if (!savedValue?.type) return;

    this.isSyncingAmPm = true;
    try {
      if (savedValue.type === 'AM') {
        this.emitter.emit('select:am', {});
      } else if (savedValue.type === 'PM') {
        this.emitter.emit('select:pm', {});
      }
    } finally {
      this.isSyncingAmPm = false;
    }
  }

  private handleConfirm(): void {
    if (!this.isEnabled) return;

    this.state.commitPreview();

    const from = this.state.getFromValue();
    const to = this.state.getToValue();

    const fromStr = from ? formatDisplayTime(from) : '--:--';
    const toStr = to ? formatDisplayTime(to) : '--:--';
    const duration = this.state.getDuration();

    this.ui.updateInputValue();
    this.emitter.emit('range:confirm', { from: fromStr, to: toStr, duration });
  }

  reset(): void {
    this.state.reset();
  }

  destroy(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
    this.reset();
  }
}
