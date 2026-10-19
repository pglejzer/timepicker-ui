import type { RangePart, RangeValue, RangeValidationResult, DisabledTimeConfig } from './types';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isValueComplete, isPlaceholder, calculateDuration, calculateDurationSeconds } from './utils';
import { pad, SECONDS_PER_MINUTE } from '../../../utils/time/parse';

const valuesBelow = (limit: number): string[] => Array.from({ length: limit }, (_, index) => pad(index));

export class RangeState {
  private activePart: RangePart = 'from';
  private fromValue: RangeValue | null = null;
  private toValue: RangeValue | null = null;
  private previewValue: RangeValue | null = null;
  private readonly clockType: '12h' | '24h';
  private readonly minDuration: number | undefined;
  private readonly maxDuration: number | undefined;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly showSeconds: boolean;
  readonly linked: boolean;
  readonly chosenFields = new Set<keyof RangeValue>();

  constructor(
    clockType: '12h' | '24h',
    minDuration: number | undefined,
    maxDuration: number | undefined,
    emitter: EventEmitter<TimepickerEventMap>,
    showSeconds = false,
    linked = true,
  ) {
    this.clockType = clockType;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
    this.emitter = emitter;
    this.showSeconds = showSeconds;
    this.linked = linked;
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
    return !this.linked || this.isFromComplete();
  }

  getCompletePreview(part: RangePart): RangeValue | null {
    const preview = this.previewValue;
    if (!preview || this.activePart !== part) return null;

    const hasPlaceholder = [preview.minutes, preview.seconds ?? ''].some(isPlaceholder);
    return isValueComplete(preview, this.clockType) && !hasPlaceholder ? preview : null;
  }

  getPendingFrom(): RangeValue | null {
    return this.isFromComplete() ? null : this.getCompletePreview('from');
  }

  canConfirm(): boolean {
    const preview = this.chosenFields.size > 0 ? this.getCompletePreview('to') : null;
    const committed = this.isFromComplete() && this.isToComplete() ? this.toValue : null;
    if (!this.linked) {
      return this.isFromComplete() && (preview ?? committed) !== null;
    }
    const durationSeconds = calculateDurationSeconds(this.fromValue, preview ?? committed, this.clockType);
    return durationSeconds > 0 && this.isWithinLimits(durationSeconds);
  }

  private isWithinLimits(seconds: number): boolean {
    const belowMin = this.minDuration !== undefined && seconds < this.minDuration * SECONDS_PER_MINUTE;
    const aboveMax = this.maxDuration !== undefined && seconds > this.maxDuration * SECONDS_PER_MINUTE;
    return !belowMin && !aboveMax;
  }

  setActivePart(part: RangePart): boolean {
    this.chosenFields.clear();
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

  getDurationSeconds(): number {
    return calculateDurationSeconds(this.fromValue, this.toValue, this.clockType);
  }

  getDuration(): number {
    return calculateDuration(this.fromValue, this.toValue, this.clockType);
  }

  validate(): RangeValidationResult {
    if (!this.fromValue || !this.toValue) {
      return { valid: true, duration: 0 };
    }

    const duration = this.getDuration();
    const durationSeconds = this.getDurationSeconds();
    const valid = !this.linked || this.isWithinLimits(durationSeconds);

    const result: RangeValidationResult = this.showSeconds
      ? { valid, duration, durationSeconds }
      : { valid, duration };

    this.emitter.emit('range:validation', {
      ...result,
      minDuration: this.minDuration,
      maxDuration: this.maxDuration,
    });

    return result;
  }

  getDisabledTimeForEndPart(): DisabledTimeConfig | null {
    if (!this.linked || this.activePart === 'from') return null;
    if (!this.fromValue || !this.isFromComplete()) return null;

    const fromHour = parseInt(this.fromValue.hour, 10);
    const fromMinute = parseInt(this.fromValue.minutes, 10);
    const config: DisabledTimeConfig = { hours: [], minutes: valuesBelow(fromMinute), fromHour };

    if (this.clockType === '24h') {
      config.hours = valuesBelow(fromHour);
    } else {
      config.fromType = this.fromValue.type;
    }

    if (this.showSeconds) {
      config.seconds = valuesBelow(parseInt(this.fromValue.seconds ?? '0', 10));
      config.fromMinute = fromMinute;
    }

    return config;
  }

  reset(): void {
    this.activePart = 'from';
    this.fromValue = null;
    this.toValue = null;
    this.previewValue = null;
    this.chosenFields.clear();
  }
}
