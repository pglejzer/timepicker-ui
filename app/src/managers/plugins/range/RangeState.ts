import type { RangePart, RangeValue, RangeValidationResult, DisabledTimeConfig } from './types';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isValueComplete, calculateDuration } from './utils';

export class RangeState {
  private activePart: RangePart = 'from';
  private fromValue: RangeValue | null = null;
  private toValue: RangeValue | null = null;
  private previewValue: RangeValue | null = null;
  private readonly clockType: '12h' | '24h';
  private readonly minDuration: number | undefined;
  private readonly maxDuration: number | undefined;
  private readonly emitter: EventEmitter<TimepickerEventMap>;

  constructor(
    clockType: '12h' | '24h',
    minDuration: number | undefined,
    maxDuration: number | undefined,
    emitter: EventEmitter<TimepickerEventMap>,
  ) {
    this.clockType = clockType;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
    this.emitter = emitter;
  }

  getActivePart(): RangePart {
    return this.activePart;
  }

  getFromValue(): RangeValue | null {
    return this.fromValue;
  }

  getToValue(): RangeValue | null {
    return this.toValue;
  }

  getPreviewValue(): RangeValue | null {
    return this.previewValue;
  }

  setFromValue(value: RangeValue | null): void {
    this.fromValue = value;
  }

  setToValue(value: RangeValue | null): void {
    this.toValue = value;
  }

  setPreviewValue(value: RangeValue | null): void {
    this.previewValue = value;
  }

  isFromComplete(): boolean {
    return isValueComplete(this.fromValue, this.clockType);
  }

  isToComplete(): boolean {
    return isValueComplete(this.toValue, this.clockType);
  }

  canSwitchToEnd(): boolean {
    return this.isFromComplete();
  }

  canConfirm(): boolean {
    return this.isFromComplete() && this.isToComplete();
  }

  setActivePart(part: RangePart): boolean {
    if (part === 'to' && !this.canSwitchToEnd()) {
      return false;
    }

    const changed = this.activePart !== part;
    this.activePart = part;

    if (changed) {
      this.previewValue = null;
    }

    return changed;
  }

  getCurrentValue(): RangeValue | null {
    if (this.previewValue) {
      return this.previewValue;
    }
    return this.activePart === 'from' ? this.fromValue : this.toValue;
  }

  getSavedValue(): RangeValue | null {
    return this.activePart === 'from' ? this.fromValue : this.toValue;
  }

  commitPreview(): void {
    if (!this.previewValue) return;

    if (this.activePart === 'from') {
      this.fromValue = this.previewValue;
    } else {
      this.toValue = this.previewValue;
    }
    this.previewValue = null;
  }

  getDuration(): number {
    return calculateDuration(this.fromValue, this.toValue, this.clockType);
  }

  validate(): RangeValidationResult {
    if (!this.fromValue || !this.toValue) {
      return { valid: true, duration: 0 };
    }

    const duration = this.getDuration();
    let valid = true;

    if (this.minDuration !== undefined && duration < this.minDuration) {
      valid = false;
    }
    if (this.maxDuration !== undefined && duration > this.maxDuration) {
      valid = false;
    }

    this.emitter.emit('range:validation', {
      valid,
      duration,
      minDuration: this.minDuration,
      maxDuration: this.maxDuration,
    });

    return { valid, duration };
  }

  getDisabledTimeForEndPart(): DisabledTimeConfig | null {
    if (this.activePart === 'from') return null;
    if (!this.fromValue || !this.isFromComplete()) return null;

    const disabledHours: string[] = [];
    const disabledMinutes: string[] = [];

    const fromHour = parseInt(this.fromValue.hour, 10);
    const fromMinutes = parseInt(this.fromValue.minutes, 10);
    const fromType = this.fromValue.type;

    if (this.clockType === '24h') {
      for (let h = 0; h < fromHour; h++) {
        disabledHours.push(h.toString().padStart(2, '0'));
      }
      for (let m = 0; m < fromMinutes; m++) {
        disabledMinutes.push(m.toString().padStart(2, '0'));
      }
      return { hours: disabledHours, minutes: disabledMinutes };
    }

    for (let m = 0; m < fromMinutes; m++) {
      disabledMinutes.push(m.toString().padStart(2, '0'));
    }

    return {
      hours: disabledHours,
      minutes: disabledMinutes,
      fromType,
      fromHour,
    };
  }

  reset(): void {
    this.activePart = 'from';
    this.fromValue = null;
    this.toValue = null;
    this.previewValue = null;
  }
}

