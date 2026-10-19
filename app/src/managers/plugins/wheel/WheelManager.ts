import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { PluginSelection } from '../../../core/PluginRegistry';
import { parseTime, pad, type TimeValue } from '../../../utils/time/parse';
import { NEUTRAL_HOUR, NEUTRAL_ZERO, TIME_COLUMNS, WheelRenderer } from './WheelRenderer';
import { WheelScrollHandler, selectionToTime } from './WheelScrollHandler';
import { WheelEventHandler } from './WheelEventHandler';
import { WheelDragHandler } from './WheelDragHandler';
import PopoverManager from './PopoverManager';
import type { WheelTimeColumn } from './WheelTypes';
import { bindEmitter } from '../../../utils/managerHelpers';
import { setSpinbuttonValue } from '../../../utils/accessibility';
import { getClockType, isCompactWheelMode } from '../../../utils/options/predicates';

const HEADER_FIELDS = { hours: 'getHour', minutes: 'getMinutes', seconds: 'getSeconds' } as const;

export default class WheelManager {
  private readonly renderer: WheelRenderer;
  private readonly dragHandler: WheelDragHandler;
  private readonly scrollHandler: WheelScrollHandler;
  private readonly eventHandler: WheelEventHandler;
  private readonly core: CoreState;
  private readonly emitter: EventEmitter<TimepickerEventMap>;
  private readonly popover: PopoverManager;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.renderer = new WheelRenderer(core);
    this.dragHandler = new WheelDragHandler(this.renderer);
    this.scrollHandler = new WheelScrollHandler(this.renderer, core);
    this.scrollHandler.setDragHandler(this.dragHandler);
    this.eventHandler = new WheelEventHandler(emitter, this.scrollHandler, core);
    this.popover = new PopoverManager(core, emitter);
  }

  init(): void {
    this.releaseHandlers();
    this.renderer.init();
    this.dragHandler.init();
    this.scrollHandler.init();
    this.eventHandler.init();

    this.dragHandler.setVisualUpdateCallback((columnType): void => {
      this.scrollHandler.updateVisualClasses(columnType);
    });

    this.listenForAmPmChanges();
    this.listenForTimeSelection();
    this.listenForClear();
    this.snapHeaderToColumns();
    this.deferInitialSync();
  }

  scrollToValue(hour: string, minute: string, type?: string, second?: string): void {
    const time: TimeValue = {
      hour: this.snapToColumn('hours', hour),
      minutes: this.snapToColumn('minutes', minute),
      type,
    };
    this.renderer.updateDisabledItems(time);
    this.scrollHandler.scrollToValue('hours', time.hour);
    this.scrollHandler.scrollToValue('minutes', time.minutes);
    if (second) {
      this.scrollHandler.scrollToValue('seconds', this.snapToColumn('seconds', second));
    }
    if (type && isCompactWheelMode(this.core.options)) {
      this.scrollHandler.scrollToValue('ampm', type.toUpperCase());
    }
  }

  getSelection(): PluginSelection | null {
    if (!this.renderer.getColumnElement('hours')?.isConnected) return null;
    return selectionToTime(this.scrollHandler.getCurrentSelection());
  }

  updateDisabledItems(): void {
    this.renderer.updateDisabledItems(this.getSelection());
  }

  attachPopover(): void {
    this.popover.attach();
  }

  detachPopover(): void {
    this.popover.detach();
  }

  destroy(): void {
    this.popover.destroy();
    this.releaseHandlers();
    this.eventHandler.destroy();
    this.scrollHandler.destroy();
    this.dragHandler.destroy();
    this.renderer.destroy();
  }

  private deferInitialSync(): void {
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        this.syncInitialValues();
      });
    } else {
      this.syncInitialValues();
    }
  }

  private releaseHandlers(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
  }

  private snapHeaderToColumns(): void {
    TIME_COLUMNS.forEach((column) => {
      const value = this.core[HEADER_FIELDS[column]]()?.value;
      if (value) this.snapToColumn(column, value);
    });
  }

  private snapToColumn(column: WheelTimeColumn, value: string): string {
    const padded = pad(value);
    const snapped = this.scrollHandler.resolveValue(column, padded) ?? padded;
    if (snapped !== padded) {
      setSpinbuttonValue(this.core[HEADER_FIELDS[column]](), snapped);
    }
    return snapped;
  }

  private syncInitialValues(
    parsed = isCompactWheelMode(this.core.options) ? this.parseMainInputValue() : null,
  ): void {
    const emptyHour = this.core.options.clock.type === '24h' ? NEUTRAL_ZERO : NEUTRAL_HOUR;

    this.scrollToValue(
      this.core.getHour()?.value || parsed?.hour || emptyHour,
      this.core.getMinutes()?.value || parsed?.minutes || NEUTRAL_ZERO,
      parsed?.type ?? this.renderer.getHeaderPeriod(),
      this.core.getSeconds()?.value || parsed?.seconds || NEUTRAL_ZERO,
    );
  }

  private parseMainInputValue(): TimeValue | null {
    const value = this.core.getInput()?.value;
    if (!value) return null;
    const { options } = this.core;
    return parseTime(value, { clockType: getClockType(options), showSeconds: options.clock.showSeconds });
  }

  private listenForAmPmChanges(): void {
    if (this.core.options.clock.type === '24h') return;

    const handler = (): void => this.refreshDisabledItems();

    bindEmitter(this.emitter, this.cleanupHandlers, 'select:am', handler);
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:pm', handler);
  }

  private listenForClear(): void {
    bindEmitter(this.emitter, this.cleanupHandlers, 'clear', () => {
      this.syncInitialValues(null);
    });
  }

  private listenForTimeSelection(): void {
    const { showSeconds } = this.core.options.clock;
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:hour', ({ hour }) => {
      if (this.hasTimeDependentMarks()) this.refreshDisabledItems();
      if (hour) this.scrollHandler.scrollToValue('hours', pad(hour));
    });
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:minute', ({ minutes }) => {
      if (showSeconds && this.hasTimeDependentMarks()) this.refreshDisabledItems();
      if (minutes) this.scrollHandler.scrollToValue('minutes', pad(minutes));
    });
    bindEmitter(this.emitter, this.cleanupHandlers, 'select:second', ({ seconds }) => {
      if (seconds) this.scrollHandler.scrollToValue('seconds', pad(seconds));
    });
  }

  private hasTimeDependentMarks(): boolean {
    const value = this.core.disabledTime?.value;
    return Boolean(value?.isInterval || value?.predicate);
  }

  private refreshDisabledItems(): void {
    const selection = this.getSelection();
    this.renderer.updateDisabledItems(selection);
    this.scrollToFirstAvailable('hours', selection?.hour);
    this.scrollToFirstAvailable('minutes', selection?.minutes);
    this.scrollToFirstAvailable('seconds', selection?.seconds);
  }

  private scrollToFirstAvailable(columnType: WheelTimeColumn, preferredValue: string | undefined): void {
    const target = this.scrollHandler.findFirstAvailable(columnType, preferredValue ?? null);
    if (target !== null) {
      this.scrollHandler.scrollToValue(columnType, target, target !== preferredValue);
    }
  }
}
