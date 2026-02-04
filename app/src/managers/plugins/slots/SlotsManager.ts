import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { SlotsConfig, TimePoint, SlotConflictEventData } from './types';
import { SlotsState } from './SlotsState';
import { SlotsUI } from './SlotsUI';
import { parseTime } from './utils';

export default class SlotsManager {
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly state: SlotsState;
  private readonly ui: SlotsUI;
  private cleanupHandlers: Array<() => void> = [];
  private currentHour: number | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;

    const slotsConfig = this.getSlotsConfig();
    const clockType = (core.options.clock.type || '12h') as '12h' | '24h';

    this.state = new SlotsState(slotsConfig, clockType);
    this.ui = new SlotsUI(core, this.state);
  }

  private getSlotsConfig(): SlotsConfig {
    const opts = this.core.options as Record<string, unknown>;
    const slotsOpts = opts['slots'] as SlotsConfig | undefined;

    return slotsOpts || { enabled: false };
  }

  private get isEnabled(): boolean {
    return this.state.isEnabled();
  }

  init(): void {
    if (!this.isEnabled) return;

    this.bindEvents();
    this.emitDisabledTime();
    this.ui.init();
  }

  private bindEvents(): void {
    const handleSelectHour = (data: { hour: string }): void => {
      this.currentHour = parseInt(data.hour, 10);
      this.emitDisabledTime();
    };

    const handleRangeConfirm = (data: { from: string; to: string }): void => {
      this.validateRangeSelection(data.from, data.to);
    };

    const handleOpen = (): void => {
      this.ui.init();
      this.emitDisabledTime();
    };

    const handleHide = (): void => {
      this.currentHour = null;
    };

    const handleAnimationClock = (): void => {
      setTimeout(() => {
        this.updateSlotsForCurrentView();
      }, 100);
    };

    const handleSelectMinute = (): void => {
      setTimeout(() => {
        this.updateSlotsForCurrentView();
      }, 50);
    };

    const handleSwitchView = (): void => {
      setTimeout(() => {
        this.ui.init();
        this.updateSlotsForCurrentView();
      }, 100);
    };

    this.emitter.on('select:hour', handleSelectHour);
    this.emitter.on('select:minute', handleSelectMinute);
    this.emitter.on('range:confirm', handleRangeConfirm);
    this.emitter.on('open', handleOpen);
    this.emitter.on('hide', handleHide);
    this.emitter.on('switch:view', handleSwitchView);
    this.emitter.on('animation:clock', handleAnimationClock);

    this.cleanupHandlers.push(
      () => this.emitter.off('select:hour', handleSelectHour),
      () => this.emitter.off('select:minute', handleSelectMinute),
      () => this.emitter.off('range:confirm', handleRangeConfirm),
      () => this.emitter.off('open', handleOpen),
      () => this.emitter.off('hide', handleHide),
      () => this.emitter.off('switch:view', handleSwitchView),
      () => this.emitter.off('animation:clock', handleAnimationClock),
    );
  }

  private updateSlotsForCurrentView(): void {
    const hourElement = this.core.getHour();
    const minuteElement = this.core.getMinutes();

    const isHoursView = hourElement?.classList.contains('active') ?? false;
    const isMinutesView = minuteElement?.classList.contains('active') ?? false;
    console.log(
      '[SlotsManager] updateSlotsForCurrentView: isHoursView =',
      isHoursView,
      'isMinutesView =',
      isMinutesView,
    );

    if (!this.ui.hasOverlay()) {
      console.log('[SlotsManager] no overlay, calling init');
      this.ui.init();
    }

    if (isHoursView) {
      this.ui.renderHourOverlay();
    } else if (isMinutesView) {
      this.ui.updateMinuteOverlay();
    }
  }

  private emitDisabledTime(): void {
    const disabled = this.state.generateDisabledTime(this.currentHour);
    this.emitter.emit('slots:disabled', disabled);
  }

  private validateRangeSelection(fromStr: string, toStr: string): void {
    const from = parseTime(fromStr);
    const to = parseTime(toStr);

    if (!from || !to) return;

    const overlap = this.state.checkRangeOverlap(from, to);

    if (!overlap.hasOverlap) return;

    const mode = this.state.getOverlapMode();

    if (mode === 'allow') return;

    const eventData: SlotConflictEventData = {
      overlap,
      selectedRange: { from, to },
      action: mode,
    };

    this.emitter.emit('slots:conflict', eventData);
  }

  getDisabledTimeForCurrentHour(): { hours: string[]; minutes: string[] } {
    return this.state.generateDisabledTime(this.currentHour);
  }

  getState(): SlotsState {
    return this.state;
  }

  updateSlots(config: Partial<SlotsConfig>): void {
    this.state.updateConfig(config);
    this.emitDisabledTime();
    this.ui.refresh();
  }

  destroy(): void {
    this.cleanupHandlers.forEach((cleanup) => cleanup());
    this.cleanupHandlers = [];
    this.ui.destroy();
  }
}

