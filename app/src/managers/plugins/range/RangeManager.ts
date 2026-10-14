import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { RangeConfirmEventData, RangeMinuteCommitEventData } from '../../../types/types';
import type {
  RangePart,
  RangeValue,
  DisabledTimeConfig,
  FormattedRange,
  RangeValidationResult,
} from './types';
import { RangeState } from './RangeState';
import { RangeUI } from './RangeUI';
import {
  parseRangeInput,
  formatDisplayTime,
  formatRangePart,
  isPlaceholder,
  PART_PLACEHOLDER,
} from './utils';
import { bindEmitter } from '../../../utils/managerHelpers';

export default class RangeManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private state!: RangeState;
  private ui!: RangeUI;
  private cleanupHandlers: Array<() => void> = [];
  private isSyncingAmPm = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.createState();
  }

  private get isEnabled(): boolean {
    return this.core.options.range?.enabled === true;
  }

  private createState(): void {
    const { range, clock } = this.core.options;
    this.state = new RangeState(
      clock.type as '12h' | '24h',
      range?.minDuration,
      range?.maxDuration,
      this.emitter,
      clock.showSeconds === true,
    );
    this.ui = new RangeUI(this.core, this.state);
  }

  init(): void {
    this.releaseHandlers();
    if (!this.isEnabled) return;

    this.createState();
    const { from, to } = parseRangeInput(this.core.getInput()?.value || '', this.state.showSeconds);
    this.state.setFromValue(from);
    this.state.setToValue(to);

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

  validateRange(): RangeValidationResult {
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

    const { showSeconds } = this.state;
    return {
      from: formatDisplayTime(from, showSeconds),
      to: formatDisplayTime(to, showSeconds),
    };
  }

  private bindEvents(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromBtn = modal.querySelector<HTMLElement>('.tp-ui-range-tab.tp-ui-range-from');
    const toBtn = modal.querySelector<HTMLElement>('.tp-ui-range-tab.tp-ui-range-to');

    this.listen(fromBtn, 'click', () => this.activatePart('from', fromBtn));
    this.listen(toBtn, 'click', () => this.activatePart('to', toBtn));
    this.bindTabKeyboard(fromBtn, toBtn);
    this.bindFieldChoice('hour', this.core.getHour());
    this.bindFieldChoice('minutes', this.core.getMinutes());
    this.bindFieldChoice('seconds', this.state.showSeconds ? this.core.getSeconds() : null);

    bindEmitter(this.emitter, this.cleanupHandlers, 'update', (data) => this.handleUpdate(data?.hour));
    bindEmitter(this.emitter, this.cleanupHandlers, 'range:minute:commit', (d) => this.handleMinuteCommit(d));
    bindEmitter(this.emitter, this.cleanupHandlers, 'confirm', () => this.handleConfirm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:am', () => this.handleAmPm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:pm', () => this.handleAmPm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => this.handleClear());
  }

  private listen<K extends keyof HTMLElementEventMap>(
    el: HTMLElement | null,
    type: K,
    handler: (e: HTMLElementEventMap[K]) => void,
  ): void {
    if (!el) return;
    el.addEventListener(type, handler);
    this.cleanupHandlers.push(() => el.removeEventListener(type, handler));
  }

  private bindFieldChoice(field: keyof RangeValue, input: HTMLInputElement | null): void {
    this.listen(input, 'keydown', () => this.state.chosenFields.add(field));
    this.listen(input, 'blur', () => {
      if (this.state.chosenFields.has(field)) {
        this.handleUpdate(this.state.getPreviewValue()?.hour);
      }
    });
  }

  private isTabDisabled(btn: HTMLElement | null): boolean {
    return !btn || btn.getAttribute('aria-disabled') === 'true' || btn.classList.contains('disabled');
  }

  private activatePart(part: RangePart, btn: HTMLElement | null): void {
    if (!this.core.isOpen || this.isTabDisabled(btn)) return;

    const pendingFrom = part === 'to' ? this.state.getPendingFrom() : null;
    if (pendingFrom) {
      this.handleMinuteCommit(pendingFrom);
    } else {
      this.setActivePart(part);
    }
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
            e.preventDefault();
            this.activatePart(part, tab);
            break;
        }
      };

      this.listen(tab, 'keydown', handler);
    });
  }

  private handleClear(): void {
    if (!this.isEnabled) return;

    this.reset();
    this.emitter.emit('range:switch', { active: 'from', disabledTime: null });
    this.ui.updateAll();
    this.focusHour();
  }

  private focusHour(): void {
    this.core.getHour()?.focus();
  }

  private handleUpdate(hour: string | undefined): void {
    if (!this.isEnabled) return;

    this.state.setPreviewValue(hour === undefined ? null : this.buildPreview(hour));
    this.ui.updateAll();
  }

  private buildPreview(hour: string): RangeValue {
    const minutes = this.state.getSavedValue()?.minutes;
    const hasMinutesSelected = !!minutes && !isPlaceholder(minutes);
    const readField = (field: keyof RangeValue, input: HTMLInputElement | null): string =>
      ((hasMinutesSelected || this.state.chosenFields.has(field)) && input?.value) || PART_PLACEHOLDER;

    return {
      hour,
      minutes: readField('minutes', this.core.getMinutes()),
      seconds: this.state.showSeconds ? readField('seconds', this.core.getSeconds()) : undefined,
      type: this.core.options.clock.type === '12h' ? this.core.getActiveType() : undefined,
    };
  }

  private handleMinuteCommit(data: RangeMinuteCommitEventData): void {
    if (!this.isEnabled) return;

    const value: RangeValue = {
      hour: data.hour,
      minutes: data.minutes,
      seconds: data.seconds,
      type: data.type ?? undefined,
    };
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
        this.focusHour();
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

    const type = this.core.getActiveType();
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

    const { showSeconds } = this.state;
    const payload: RangeConfirmEventData = {
      from: formatRangePart(this.state.getFromValue(), showSeconds),
      to: formatRangePart(this.state.getToValue(), showSeconds),
      duration: this.state.getDuration(),
    };
    if (showSeconds) {
      payload.durationSeconds = this.state.getDurationSeconds();
    }

    this.ui.updateInputValue();
    this.emitter.emit('range:confirm', payload);
  }

  reset(): void {
    this.state.reset();
  }

  destroy(): void {
    this.releaseHandlers();
    this.reset();
  }

  private releaseHandlers(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
  }
}
