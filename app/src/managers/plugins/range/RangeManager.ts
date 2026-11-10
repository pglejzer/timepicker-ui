import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type {
  ConfirmEventData,
  RangeConfirmEventData,
  RangeMinuteCommitEventData,
  UpdateEventData,
} from '../../../types/types';
import type { RangeCaptionInput } from '../../../types/options';
import type { PluginTimeView } from '../../../core/PluginRegistry';
import type {
  RangePart,
  RangeValue,
  DisabledTimeConfig,
  FormattedRange,
  RangeValidationResult,
} from './types';
import { RangeState } from './RangeState';
import { RangeUI } from './RangeUI';
import { RangeWheelView } from './RangeWheelView';
import {
  parseRangeInput,
  formatDisplayTime,
  formatRangePart,
  isPlaceholder,
  isSameValue,
  isValueComplete,
  PART_PLACEHOLDER,
} from './utils';
import { bindEmitter } from '../../../utils/managerHelpers';
import { sanitizeTimeInput } from '../../../utils/validation';
import { resolveTimeFor } from '../../../timepicker/SetValue';
import { buildUpdatePayload, emitSelect } from '../../events/timeFields';

interface PendingRange {
  from: string | null;
  to: string | null;
  inputValue: string;
}

interface ParsedRange {
  from: RangeValue | null;
  to: RangeValue | null;
}

interface RangeSnapshot {
  from: RangeValue | null;
  to: RangeValue | null;
  clockType: '12h' | '24h';
  showSeconds: boolean;
}

interface OpenRangeSync {
  returnedToFrom: boolean;
  shownChanged: boolean;
  fromChanged: boolean;
}

type CaptionField = keyof RangeCaptionInput;

const CAPTION_PARTS: ReadonlyArray<CaptionField> = ['from', 'to'];

export default class RangeManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private state!: RangeState;
  private ui!: RangeUI;
  private cleanupHandlers: Array<() => void> = [];
  private isSyncingAmPm = false;
  private isBound = false;
  private pendingRange: PendingRange | null = null;
  private pendingPart: RangePart | null = null;
  private captions: Record<RangePart, string | null> = { from: null, to: null };
  private readonly wheelView: RangeWheelView;

  private readonly handleWheelUpdate = (data: UpdateEventData): void => {
    if (!this.isBound || !this.wheelView.isActive()) return;
    this.handleViewUpdate(data);
  };

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.wheelView = new RangeWheelView(core);
    this.createState();
    this.emitter.on('update', this.handleWheelUpdate);
  }

  setTimeView(view: PluginTimeView): void {
    this.wheelView.setView(view);
  }

  private get isEnabled(): boolean {
    return this.core.options.range?.enabled === true;
  }

  private get isLive(): boolean {
    return this.isBound && this.core.isOpen;
  }

  private createState(): void {
    const { range, clock } = this.core.options;
    this.state = new RangeState(
      clock.type as '12h' | '24h',
      range?.minDuration,
      range?.maxDuration,
      this.emitter,
      clock.showSeconds === true,
      range?.linked !== false,
    );
    this.ui = new RangeUI(this.core, this.state);
  }

  init(): void {
    const keepsRange = this.core.isRerendering && this.isBound && this.isEnabled;
    const snapshot = keepsRange ? this.takeSnapshot() : null;
    const carriedPart: RangePart = this.core.isRerendering ? this.state.getActivePart() : 'from';
    this.releaseHandlers();
    if (!this.isEnabled) return;

    this.createState();
    const { from, to } = snapshot ? this.restoreSnapshot(snapshot) : this.readInitialRange();
    this.state.setFromValue(from);
    this.state.setToValue(to);

    this.bindEvents();
    this.isBound = true;
    this.restoreActivePart(carriedPart);
    this.showActivePart();
    this.ui.updateAll();
    this.ui.renderCaptions(this.captions);
  }

  private takeSnapshot(): RangeSnapshot {
    this.commitActivePreview();
    return {
      from: this.state.getFromValue(),
      to: this.state.getToValue(),
      clockType: this.state.clockType,
      showSeconds: this.state.showSeconds,
    };
  }

  private restoreSnapshot(snapshot: RangeSnapshot): ParsedRange {
    const { clockType, showSeconds } = this.state;
    if (snapshot.clockType === clockType && snapshot.showSeconds === showSeconds) {
      return { from: this.copyValue(snapshot.from), to: this.copyValue(snapshot.to) };
    }

    const convert = (value: RangeValue | null): RangeValue | null =>
      value && isValueComplete(value, snapshot.clockType)
        ? this.parseEnd(formatRangePart(value, snapshot.showSeconds))
        : null;
    return { from: convert(snapshot.from), to: convert(snapshot.to) };
  }

  private readInitialRange(): ParsedRange {
    const inputValue = this.core.getInput()?.value || '';
    const pending = this.pendingRange;

    if (pending && pending.inputValue === inputValue) {
      return { from: this.parseEnd(pending.from), to: this.parseEnd(pending.to) };
    }

    this.pendingRange = null;
    return parseRangeInput(inputValue, this.state.showSeconds);
  }

  private restoreActivePart(carriedPart: RangePart): void {
    const part = this.pendingPart ?? carriedPart;
    this.pendingPart = null;
    if (part !== 'to') return;

    if (this.state.setActivePart('to')) {
      this.emitter.emit('range:switch', {
        active: 'to',
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
      return;
    }

    if (carriedPart === 'to') {
      this.emitter.emit('range:switch', { active: 'from', disabledTime: null });
    }
  }

  private showActivePart(): void {
    if (this.wheelView.isActive()) {
      this.wheelView.show(this.state, this.ui);
      return;
    }

    this.ui.syncClockToActivePart();
    this.emitAmPmSyncEvent();
  }

  getActivePart(): RangePart {
    return this.state.getActivePart();
  }

  setActivePart(part: RangePart, options: { focus?: boolean } = {}): boolean {
    if (!this.isEnabled) return false;

    if (options.focus === false && !this.isLive) {
      this.state.setActivePart(part);
      const applied = this.state.getActivePart() === part;
      this.pendingPart = applied ? part : null;
      return applied;
    }

    this.commitActivePreview();
    const changed = this.state.setActivePart(part);

    if (changed) {
      this.emitter.emit('range:switch', {
        active: part,
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
    }

    if (this.wheelView.isActive()) {
      if (changed) this.wheelView.show(this.state, this.ui);
    } else if (options.focus === false) {
      if (changed) {
        this.syncClockWithoutFocus();
        this.emitAmPmSyncEvent();
      }
    } else {
      this.ui.syncClockToActivePart();
      this.emitAmPmSyncEvent();
    }
    this.ui.updateAll();

    return this.state.getActivePart() === part;
  }

  setRange(from: string | null | undefined, to: string | null | undefined, updateInput: boolean): boolean {
    if (!this.isEnabled || (from === undefined && to === undefined)) return false;

    const fromValue = this.resolveEnd(from, this.state.getFromValue());
    const toValue = this.resolveEnd(to, this.state.getToValue());
    if (fromValue === undefined || toValue === undefined) return false;

    const fromBefore = this.state.getFromValue();
    const shownBefore = this.state.getSavedValue();
    const wasToActive = this.state.getActivePart() === 'to';

    this.state.setFromValue(fromValue);
    this.state.setToValue(toValue);

    const returnedToFrom = wasToActive && !this.state.canSwitchToEnd();
    if (returnedToFrom) {
      this.state.setActivePart('from');
      this.pendingPart = null;
    }

    const shownChanged = returnedToFrom || !isSameValue(shownBefore, this.state.getSavedValue());
    if (shownChanged) {
      this.state.setPreviewValue(null);
      this.state.chosenFields.clear();
    }

    if (updateInput) {
      this.ui.updateInputValue();
    }

    const { showSeconds } = this.state;
    this.pendingRange = {
      from: fromValue && formatDisplayTime(fromValue, showSeconds),
      to: toValue && formatDisplayTime(toValue, showSeconds),
      inputValue: this.core.getInput()?.value || '',
    };

    if (this.isLive) {
      this.syncOpenRange({ returnedToFrom, shownChanged, fromChanged: !isSameValue(fromBefore, fromValue) });
    }

    this.state.validate();
    this.ui.updateAll();
    return true;
  }

  private resolveEnd(text: unknown, current: RangeValue | null): RangeValue | null | undefined {
    if (text === undefined) return current;
    if (text === null || text === '') return null;
    return this.parseEnd(text) ?? undefined;
  }

  getRange(): ParsedRange {
    return {
      from: this.state.isFromComplete() ? this.copyValue(this.state.getFromValue()) : null,
      to: this.state.isToComplete() ? this.copyValue(this.state.getToValue()) : null,
    };
  }

  private copyValue(value: RangeValue | null): RangeValue | null {
    return value ? { ...value } : null;
  }

  private parseEnd(text: unknown): RangeValue | null {
    if (typeof text !== 'string' || !text.trim()) return null;

    const resolved = resolveTimeFor(this.core, sanitizeTimeInput(text.trim()));
    if (!resolved) return null;

    const { hour, minutes, seconds, type } = resolved.parsed;
    const value: RangeValue = { hour, minutes };
    if (this.core.options.clock.showSeconds === true) {
      value.seconds = seconds ?? '00';
    }
    if (this.core.options.clock.type === '12h') {
      value.type = type;
    }
    return value;
  }

  private syncOpenRange({ returnedToFrom, shownChanged, fromChanged }: OpenRangeSync): void {
    if (returnedToFrom) {
      this.emitter.emit('range:switch', { active: 'from', disabledTime: null });
    } else if (fromChanged) {
      const disabledTime = this.state.getDisabledTimeForEndPart();
      if (this.state.getActivePart() === 'to' && disabledTime) {
        this.emitter.emit('range:switch', { active: 'to', disabledTime });
      }
    }

    if (!shownChanged) return;

    if (this.wheelView.isActive()) {
      this.wheelView.show(this.state, this.ui, false);
      return;
    }

    this.syncClockWithoutFocus();
    this.emitAmPmSyncEvent();
  }

  private syncClockWithoutFocus(): void {
    const hourInput = this.ui.showActivePartHours();
    if (!hourInput) return;

    emitSelect(this.emitter, 'hour', hourInput.value);
    this.emitter.emit(
      'update',
      this.state.getSavedValue()
        ? buildUpdatePayload(this.core)
        : { hour: undefined, minutes: undefined, type: undefined },
    );
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

    bindEmitter(this.emitter, this.cleanupHandlers, 'confirm', (data) => this.handleConfirm(data));
    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => this.handleClear());

    if (this.wheelView.isActive()) {
      this.emitter.on('update', this.handleWheelUpdate);
      return;
    }

    this.bindFieldChoice('hour', this.core.getHour());
    this.bindFieldChoice('minutes', this.core.getMinutes());
    this.bindFieldChoice('seconds', this.state.showSeconds ? this.core.getSeconds() : null);
    bindEmitter(this.emitter, this.cleanupHandlers, 'update', (data) => this.handleUpdate(data?.hour));
    bindEmitter(this.emitter, this.cleanupHandlers, 'input:commit', ({ field }) =>
      this.handleFieldCommit(field),
    );
    bindEmitter(this.emitter, this.cleanupHandlers, 'range:minute:commit', (d) => this.handleMinuteCommit(d));
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:am', () => this.handleAmPm());
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:pm', () => this.handleAmPm());
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
  }

  private isTabDisabled(btn: HTMLElement | null): boolean {
    return !btn || btn.getAttribute('aria-disabled') === 'true' || btn.classList.contains('disabled');
  }

  private activatePart(part: RangePart, btn: HTMLElement | null): void {
    if (!this.core.isOpen || this.isTabDisabled(btn)) return;

    const pendingFrom = part === 'to' ? this.state.getPendingFrom() : null;
    if (pendingFrom) {
      this.handleMinuteCommit(pendingFrom, false);
      return;
    }

    this.commitActivePreview();
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
    if (!this.isLive) return;

    const isApiChange = this.core.isApiChange;
    if (!isApiChange) this.emitChange('from');

    this.emitter.emit('range:switch', { active: 'from', disabledTime: null });
    this.ui.updateAll();

    if (isApiChange) return;

    if (this.wheelView.isActive()) {
      this.focusFromTab();
    } else {
      this.focusHour();
    }
  }

  private focusFromTab(): void {
    this.core.getModalElement()?.querySelector<HTMLElement>('.tp-ui-range-tab.tp-ui-range-from')?.focus();
  }

  private focusHour(): void {
    this.core.getHour()?.focus();
  }

  private handleViewUpdate(data: UpdateEventData | undefined): void {
    if (!this.isEnabled) return;

    const part = this.state.getActivePart();
    const before = this.getRange()[part];
    if (!this.wheelView.applyUpdate(this.state, data)) return;

    this.emitUserChangeIfChanged(part, before);
    this.state.validate();
    this.ui.updateAll();
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

  private handleMinuteCommit(data: RangeMinuteCommitEventData, focusHourAfterSwitch = true): void {
    if (!this.isEnabled) return;

    const value: RangeValue = {
      hour: data.hour,
      minutes: data.minutes,
      seconds: data.seconds,
      type: data.type ?? undefined,
    };
    const activePart = this.state.getActivePart();
    const before = this.getRange()[activePart];

    this.writePart(activePart, value);
    this.state.setPreviewValue(null);
    this.emitUserChangeIfChanged(activePart, before);

    if (activePart === 'from' && this.state.isFromComplete()) {
      this.state.setActivePart('to');
      this.emitter.emit('range:switch', {
        active: 'to',
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
      this.ui.syncClockToActivePart();
      this.emitAmPmSyncEvent();
      if (focusHourAfterSwitch) this.focusHour();
    }

    this.state.validate();
    this.ui.updateAll();
  }

  private handleAmPm(): void {
    if (!this.isEnabled || this.isSyncingAmPm) return;
    if (this.core.options.clock.type !== '12h') return;

    const type = this.core.getActiveType();
    if (!type) return;

    const part = this.state.getActivePart();
    const before = this.getRange()[part];
    const wasFromComplete = this.state.isFromComplete();

    const saved = this.state.getSavedValue();
    if (saved) {
      this.writePart(part, { ...saved, type });
    }
    const preview = this.state.getPreviewValue();
    if (preview) {
      this.state.setPreviewValue({ ...preview, type });
    }
    this.emitUserChangeIfChanged(part, before);

    if (part === 'from' && !wasFromComplete && this.state.isFromComplete()) {
      this.state.setActivePart('to');
      this.emitter.emit('range:switch', {
        active: 'to',
        disabledTime: this.state.getDisabledTimeForEndPart(),
      });
      this.ui.syncClockToActivePart();
      this.emitAmPmSyncEvent();
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

  private handleConfirm(data?: ConfirmEventData): void {
    if (!this.isEnabled || !this.state.canConfirm()) return;

    const part = this.state.getActivePart();
    const before = this.getRange()[part];
    this.state.commitPreview();
    this.pendingRange = null;
    this.emitUserChangeIfChanged(part, before);

    const { showSeconds } = this.state;
    const payload: RangeConfirmEventData = {
      from: formatRangePart(this.state.getFromValue(), showSeconds),
      to: formatRangePart(this.state.getToValue(), showSeconds),
      duration: this.state.getDuration(),
    };
    if (showSeconds) {
      payload.durationSeconds = this.state.getDurationSeconds();
    }
    if (data?.autoCommit) {
      payload.autoCommit = true;
    }

    this.ui.updateInputValue();
    this.emitter.emit('range:confirm', payload);
  }

  private emitChange(part: RangePart): void {
    const { from, to } = this.getRange();
    this.emitter.emit('range:change', { part, from, to });
  }

  private emitIfChanged(part: RangePart, before: RangeValue | null): void {
    if (!isSameValue(before, this.getRange()[part])) {
      this.emitChange(part);
    }
  }

  private emitUserChangeIfChanged(part: RangePart, before: RangeValue | null): void {
    if (!this.core.isApiChange) {
      this.emitIfChanged(part, before);
    }
  }

  private writePart(part: RangePart, value: RangeValue | null): void {
    if (part === 'from') {
      this.state.setFromValue(value);
    } else {
      this.state.setToValue(value);
    }
  }

  private commitActivePreview(): void {
    if (!this.isLive) return;

    const part = this.state.getActivePart();
    const preview = this.state.getCompletePreview(part);
    if (!preview || isSameValue(preview, this.state.getSavedValue())) return;

    const before = this.getRange()[part];
    this.state.commitPreview();
    this.emitIfChanged(part, before);
    this.state.validate();
    this.ui.updateAll();
  }

  private handleFieldCommit(field: keyof RangeValue): void {
    if (!this.isEnabled || !this.state.chosenFields.has(field)) return;

    this.handleUpdate(this.core.getHour()?.value);
    this.commitActivePreview();
  }

  setCaptions(captions: RangeCaptionInput): void {
    CAPTION_PARTS.forEach((part) => {
      const caption = captions[part];
      if (caption === undefined) return;
      this.captions[part] = caption ? String(caption) : null;
    });
    this.ui.renderCaptions(this.captions);
  }

  reset(): void {
    this.state.reset();
    this.pendingRange = null;
    this.pendingPart = null;
  }

  destroy(): void {
    this.emitter.off('update', this.handleWheelUpdate);
    this.releaseHandlers();
    this.reset();
  }

  private releaseHandlers(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
    this.isBound = false;
  }
}
