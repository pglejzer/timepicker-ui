import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { RangeMinuteCommitEventData, ConfirmEventData } from '../types/types';

type RangePart = 'from' | 'to';

interface RangeValue {
  hour: string;
  minutes: string;
  type?: string;
}

export default class RangeManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private activePart: RangePart = 'from';
  private fromValue: RangeValue | null = null;
  private toValue: RangeValue | null = null;
  private previewValue: RangeValue | null = null;
  private cleanupHandlers: Array<() => void> = [];
  private boundHandleMinuteCommit: (data: RangeMinuteCommitEventData) => void;
  private boundHandleConfirm: (data: ConfirmEventData) => void;
  private boundHandleUpdate: () => void;
  private boundHandleAmPm: () => void;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.boundHandleMinuteCommit = this.handleMinuteCommit.bind(this);
    this.boundHandleConfirm = this.handleConfirm.bind(this);
    this.boundHandleUpdate = this.handleUpdate.bind(this);
    this.boundHandleAmPm = this.handleAmPm.bind(this);
  }

  private get isEnabled(): boolean {
    return this.core.options.range?.enabled === true;
  }

  private isFromComplete(): boolean {
    if (!this.fromValue) return false;
    if (this.core.options.clock.type === '12h') {
      return !!(this.fromValue.hour && this.fromValue.minutes && this.fromValue.type);
    }
    return !!(this.fromValue.hour && this.fromValue.minutes);
  }

  getActivePart(): RangePart {
    return this.activePart;
  }

  setActivePart(part: RangePart): void {
    if (!this.isEnabled) return;
    if (part === 'to' && !this.isFromComplete()) return;

    const changed = this.activePart !== part;
    this.activePart = part;

    if (changed) {
      this.emitter.emit('range:switch', { active: part });
    }

    this.syncClockToActivePart();
    this.updateUI();
  }

  private syncClockToActivePart(): void {
    this.previewValue = null;
    const value = this.activePart === 'from' ? this.fromValue : this.toValue;

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

    if (hourInput) {
      hourInput.click();
    }
  }

  getFromValue(): RangeValue | null {
    return this.fromValue;
  }

  getToValue(): RangeValue | null {
    return this.toValue;
  }

  private timeToMinutes(value: RangeValue | null): number {
    if (!value) return 0;
    let hours = parseInt(value.hour, 10);
    const minutes = parseInt(value.minutes, 10);

    if (this.core.options.clock.type === '12h' && value.type) {
      if (value.type === 'PM' && hours !== 12) hours += 12;
      if (value.type === 'AM' && hours === 12) hours = 0;
    }

    return hours * 60 + minutes;
  }

  getDuration(): number {
    if (!this.fromValue || !this.toValue) return 0;

    const fromMinutes = this.timeToMinutes(this.fromValue);
    let toMinutes = this.timeToMinutes(this.toValue);

    if (toMinutes <= fromMinutes) {
      toMinutes += 24 * 60;
    }

    return toMinutes - fromMinutes;
  }

  validateRange(): { valid: boolean; duration: number } {
    if (!this.isEnabled) return { valid: true, duration: 0 };
    if (!this.fromValue || !this.toValue) return { valid: true, duration: 0 };

    const duration = this.getDuration();
    const { minDuration, maxDuration } = this.core.options.range ?? {};

    let valid = true;
    if (minDuration !== undefined && duration < minDuration) valid = false;
    if (maxDuration !== undefined && duration > maxDuration) valid = false;

    this.emitter.emit('range:validation', { valid, duration, minDuration, maxDuration });

    return { valid, duration };
  }

  canConfirm(): boolean {
    if (!this.isEnabled) return true;

    const isToComplete = (): boolean => {
      if (!this.toValue) return false;
      if (this.core.options.clock.type === '12h') {
        return !!(this.toValue.hour && this.toValue.minutes && this.toValue.type);
      }
      return !!(this.toValue.hour && this.toValue.minutes);
    };

    return this.isFromComplete() && isToComplete();
  }

  getFormattedRange(): { from: string; to: string } | null {
    if (!this.fromValue || !this.toValue) return null;

    const formatTime = (v: RangeValue): string => {
      const time = `${v.hour.padStart(2, '0')}:${v.minutes.padStart(2, '0')}`;
      return v.type ? `${time} ${v.type}` : time;
    };

    return {
      from: formatTime(this.fromValue),
      to: formatTime(this.toValue),
    };
  }

  init(): void {
    if (!this.isEnabled) return;

    const input = this.core.getInput();
    const inputValue = input?.value || '';

    if (inputValue && inputValue.includes(' - ')) {
      const parts = inputValue.split(' - ').map((p) => p.trim());
      if (parts.length === 2 && parts[0] !== '--:--' && parts[1] !== '--:--') {
        this.fromValue = this.parseTime(parts[0]);
        this.toValue = this.parseTime(parts[1]);
      } else {
        this.fromValue = null;
        this.toValue = null;
      }
    } else {
      this.fromValue = null;
      this.toValue = null;
    }

    this.activePart = 'from';
    this.previewValue = null;

    this.bindEvents();
    this.updateUI();
  }

  private parseTime(str: string): RangeValue | null {
    if (!str || str === '--:--') return null;
    const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      return { hour: match12[1], minutes: match12[2], type: match12[3].toUpperCase() };
    }
    const match24 = str.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      return { hour: match24[1], minutes: match24[2] };
    }
    return null;
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
    const currentValue = this.activePart === 'from' ? this.fromValue : this.toValue;
    const hasMinutesSelected = currentValue?.minutes && currentValue.minutes !== '--';
    const minutes = hasMinutesSelected ? (minutesInput?.value ?? '--') : '--';
    const type = this.core.options.clock.type === '12h' ? activeTypeMode?.textContent : undefined;

    this.previewValue = { hour, minutes, type };
    this.updateUI();
  }

  private handleMinuteCommit(data: RangeMinuteCommitEventData): void {
    if (!this.isEnabled) return;

    const value: RangeValue = { hour: data.hour, minutes: data.minutes, type: data.type };

    if (this.activePart === 'from') {
      this.fromValue = value;
      this.previewValue = null;
      if (this.isFromComplete()) {
        this.activePart = 'to';
        this.previewValue = null;
        this.emitter.emit('range:switch', { active: 'to' });
        this.syncClockToActivePart();
      }
    } else {
      this.toValue = value;
      this.previewValue = null;
    }

    this.validateRange();
    this.updateUI();
  }

  private handleAmPm(): void {
    if (!this.isEnabled) return;
    if (this.core.options.clock.type !== '12h') return;

    const activeTypeMode = this.core.getActiveTypeMode();
    const type = activeTypeMode?.textContent;
    if (!type) return;

    if (this.activePart === 'from' && this.fromValue) {
      this.fromValue = { ...this.fromValue, type };
      if (this.isFromComplete()) {
        this.activePart = 'to';
        this.previewValue = null;
        this.emitter.emit('range:switch', { active: 'to' });
        this.syncClockToActivePart();
      }
    } else if (this.activePart === 'to' && this.toValue) {
      this.toValue = { ...this.toValue, type };
    }

    this.validateRange();
    this.updateUI();
  }

  private handleConfirm(_data: ConfirmEventData): void {
    if (!this.isEnabled) return;

    if (this.previewValue) {
      if (this.activePart === 'from') {
        this.fromValue = this.previewValue;
      } else {
        this.toValue = this.previewValue;
      }
      this.previewValue = null;
    }

    const from = this.fromValue ? this.formatDisplayTime(this.fromValue) : '--:--';
    const to = this.toValue ? this.formatDisplayTime(this.toValue) : '--:--';
    const duration = this.getDuration();

    this.emitter.emit('range:confirm', { from, to, duration });
  }

  private updateUI(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const fromBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-from');
    const toBtn = modal.querySelector('.tp-ui-range-tab.tp-ui-range-to');
    const isFromActive = this.activePart === 'from';
    const isFromCompleteNow = this.isFromComplete();

    fromBtn?.classList.toggle('active', isFromActive);
    toBtn?.classList.toggle('active', !isFromActive);
    toBtn?.classList.toggle('disabled', !isFromCompleteNow);
    fromBtn?.setAttribute('aria-selected', String(isFromActive));
    toBtn?.setAttribute('aria-selected', String(!isFromActive));
    toBtn?.setAttribute('aria-disabled', String(!isFromCompleteNow));
    fromBtn?.setAttribute('tabindex', isFromActive ? '0' : '-1');
    toBtn?.setAttribute('tabindex', isFromActive || !isFromCompleteNow ? '-1' : '0');

    const fromTimeEl = modal.querySelector('.tp-ui-range-from-time');
    const toTimeEl = modal.querySelector('.tp-ui-range-to-time');

    const fromDisplay =
      this.activePart === 'from' && this.previewValue
        ? this.formatDisplayTime(this.previewValue)
        : this.fromValue
          ? this.formatDisplayTime(this.fromValue)
          : '--:--';

    const toDisplay =
      this.activePart === 'to' && this.previewValue
        ? this.formatDisplayTime(this.previewValue)
        : this.toValue
          ? this.formatDisplayTime(this.toValue)
          : '--:--';

    if (fromTimeEl) fromTimeEl.textContent = fromDisplay;
    if (toTimeEl) toTimeEl.textContent = toDisplay;

    this.updateOkButtonState();
    this.updateInputValue();
  }

  private formatDisplayTime(value: RangeValue): string {
    const mins = value.minutes === '--' ? '--' : value.minutes.padStart(2, '0');
    const time = `${value.hour}:${mins}`;
    return value.type ? `${time} ${value.type}` : time;
  }

  private updateOkButtonState(): void {
    const okBtn = this.core.getOkButton();
    if (!okBtn) return;

    const canConfirm = this.canConfirm();
    okBtn.classList.toggle('disabled', !canConfirm);
    okBtn.setAttribute('aria-disabled', String(!canConfirm));
  }

  private updateInputValue(): void {
    const input = this.core.getInput();
    if (!input) return;

    const from = this.fromValue ? this.formatDisplayTime(this.fromValue) : '--:--';
    const to = this.toValue ? this.formatDisplayTime(this.toValue) : '--:--';
    input.value = `${from} - ${to}`;
  }

  reset(): void {
    this.activePart = 'from';
    this.fromValue = null;
    this.toValue = null;
    this.previewValue = null;
  }

  destroy(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
    this.reset();
  }
}

