import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { RangeMinuteCommitEventData, ConfirmEventData } from '../../../types/types';
import type { RangePart, RangeValue, DisabledTimeConfig, FormattedRange } from './types';
import { RangeState } from './RangeState';
import { RangeUI } from './RangeUI';
import { parseRangeInput, formatDisplayTime } from './utils';

export default class RangeManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly state: RangeState;
  private readonly ui: RangeUI;
  private cleanupHandlers: Array<() => void> = [];

  private boundHandleMinuteCommit: (data: RangeMinuteCommitEventData) => void;
  private boundHandleConfirm: (data: ConfirmEventData) => void;
  private boundHandleUpdate: () => void;
  private boundHandleAmPm: () => void;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;

    const { range, clock } = core.options;
    this.state = new RangeState(clock.type as '12h' | '24h', range?.minDuration, range?.maxDuration, emitter);
    this.ui = new RangeUI(core, this.state);

    this.boundHandleMinuteCommit = this.handleMinuteCommit.bind(this);
    this.boundHandleConfirm = this.handleConfirm.bind(this);
    this.boundHandleUpdate = this.handleUpdate.bind(this);
    this.boundHandleAmPm = this.handleAmPm.bind(this);
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

    const fromBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-from');
    const toBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-to');

    if (fromBtn) {
      const handler = (): void => this.setActivePart('from');
      fromBtn.addEventListener('click', handler);
      this.cleanupHandlers.push(() => fromBtn.removeEventListener('click', handler));
    }

    if (toBtn) {
      const handler = (): void => this.setActivePart('to');
      toBtn.addEventListener('click', handler);
      this.cleanupHandlers.push(() => toBtn.removeEventListener('click', handler));
    }

    this.emitter.on('update', this.boundHandleUpdate);
    this.cleanupHandlers.push(() => this.emitter.off('update', this.boundHandleUpdate));

    this.emitter.on('range:minute:commit', this.boundHandleMinuteCommit);
    this.cleanupHandlers.push(() => this.emitter.off('range:minute:commit', this.boundHandleMinuteCommit));

    this.emitter.on('confirm', this.boundHandleConfirm);
    this.cleanupHandlers.push(() => this.emitter.off('confirm', this.boundHandleConfirm));

    this.emitter.on('select:am', this.boundHandleAmPm);
    this.cleanupHandlers.push(() => this.emitter.off('select:am', this.boundHandleAmPm));

    this.emitter.on('select:pm', this.boundHandleAmPm);
    this.cleanupHandlers.push(() => this.emitter.off('select:pm', this.boundHandleAmPm));
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

  private handleConfirm(_data: ConfirmEventData): void {
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
