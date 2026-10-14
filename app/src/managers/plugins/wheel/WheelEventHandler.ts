import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { indexOfValue, selectionToTime, type WheelScrollHandler } from './WheelScrollHandler';
import type { WheelColumnType } from './WheelTypes';
import { COLUMN_SELECTORS, NEUTRAL_HOUR, NEUTRAL_ZERO, WHEEL_COLUMNS } from './WheelRenderer';
import { isDocument } from '../../../utils/node';
import { announceToScreenReader, setActivePeriod, setSpinbuttonValue } from '../../../utils/accessibility';
import { formatTime } from '../../../utils/time/parse';
import { getClockType } from '../../../utils/options/predicates';
import { TIMINGS } from '../../../constants/timings';

const PAGE_STEP = 5;

type NavTarget = (index: number, lastIndex: number) => number;

const NAV_KEYS: Readonly<Record<string, readonly [direction: 1 | -1, target: NavTarget]>> = {
  ArrowUp: [-1, (index) => index - 1],
  ArrowDown: [1, (index) => index + 1],
  Home: [1, () => 0],
  End: [-1, (_, lastIndex) => lastIndex],
  PageUp: [-1, (index) => Math.max(0, index - PAGE_STEP)],
  PageDown: [1, (index, lastIndex) => Math.min(lastIndex, index + PAGE_STEP)],
};

const NAV_KEY_NAMES = Object.keys(NAV_KEYS);

export class WheelEventHandler {
  private emitter: EventEmitter<TimepickerEventMap>;
  private scrollHandler: WheelScrollHandler;
  private core: CoreState;
  private keydownListeners: Map<WheelColumnType, (e: KeyboardEvent) => void> = new Map();
  private clearHandler: ((data: { previousValue: string | null }) => void) | null = null;
  private previousValues: Map<WheelColumnType, string | null> = new Map();
  private commitOnScrollTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(emitter: EventEmitter<TimepickerEventMap>, scrollHandler: WheelScrollHandler, core: CoreState) {
    this.emitter = emitter;
    this.scrollHandler = scrollHandler;
    this.core = core;
  }

  init(): void {
    this.removeKeyboardListeners();
    this.removeClearListener();
    this.previousValues.clear();
    this.clearCommitTimer();

    this.captureCurrentValues();

    this.scrollHandler.setScrollEndCallback((columnType: WheelColumnType, value: string): void => {
      this.handleColumnScrollEnd(columnType, value);
    });

    this.scrollHandler.setScrollStartCallback((columnType: WheelColumnType): void => {
      if (!this.core.isOpen) return;
      this.emitter.emit('wheel:scroll:start', { column: columnType });
    });

    this.attachKeyboardListeners();
    this.attachClearListener();
  }

  destroy(): void {
    this.scrollHandler.setScrollEndCallback((): void => {});
    this.scrollHandler.setScrollStartCallback(null);
    this.removeKeyboardListeners();
    this.removeClearListener();
    this.previousValues.clear();
    this.clearCommitTimer();
  }

  private clearCommitTimer(): void {
    if (this.commitOnScrollTimer !== null) {
      clearTimeout(this.commitOnScrollTimer);
      this.commitOnScrollTimer = null;
    }
  }

  private handleColumnScrollEnd(columnType: WheelColumnType, value: string): void {
    if (!this.core.isOpen) return;

    const previousValue = this.previousValues.get(columnType) ?? null;

    this.emitter.emit('wheel:scroll:end', {
      column: columnType,
      value,
      previousValue,
    });

    this.previousValues.set(columnType, value);

    const modal = this.core.getModalElement();
    const labels = this.core.options.labels;

    switch (columnType) {
      case 'hours':
        setSpinbuttonValue(this.core.getHour(), value);
        this.core.setDegreesHours(parseInt(value, 10) * 30);
        this.emitter.emit('select:hour', { hour: value });
        announceToScreenReader(modal, `${labels.announceHour}: ${value}`);
        break;
      case 'minutes':
        setSpinbuttonValue(this.core.getMinutes(), value);
        this.core.setDegreesMinutes(parseInt(value, 10) * 6);
        this.emitter.emit('select:minute', { minutes: value });
        announceToScreenReader(modal, `${labels.announceMinute}: ${value}`);
        break;
      case 'seconds':
        setSpinbuttonValue(this.core.getSeconds(), value);
        this.core.setDegreesSeconds(parseInt(value, 10) * 6);
        this.emitter.emit('select:second', { seconds: value });
        announceToScreenReader(modal, `${labels.second}: ${value}`);
        break;
      case 'ampm':
        setActivePeriod(this.core.getAM(), this.core.getPM(), value);
        if (value === 'AM') {
          this.emitter.emit('select:am', {});
          announceToScreenReader(modal, labels.announceAmSelected!);
        } else {
          this.emitter.emit('select:pm', {});
          announceToScreenReader(modal, labels.announcePmSelected!);
        }
        break;
    }

    this.emitter.emit('update', selectionToTime(this.scrollHandler.getCurrentSelection()));

    if (this.core.options.wheel?.commitOnScroll === true) {
      this.scheduleCommitOnScroll();
    }
  }

  private scheduleCommitOnScroll(): void {
    this.clearCommitTimer();

    this.commitOnScrollTimer = setTimeout(() => {
      this.commitOnScrollTimer = null;
      if (!this.core.isOpen) return;

      const { options } = this.core;
      const time = selectionToTime(this.scrollHandler.getCurrentSelection());

      const input = this.core.getInput();
      if (input) {
        input.value = formatTime(time, {
          clockType: getClockType(options),
          showSeconds: options.clock.showSeconds,
        });
      }

      this.emitter.emit('confirm', { ...time, autoCommit: true });
    }, TIMINGS.COMMIT_ON_SCROLL_DELAY);
  }

  private attachKeyboardListeners(): void {
    if (!isDocument()) return;

    WHEEL_COLUMNS.forEach((type) => {
      const col = this.getColumnFromRenderer(type);

      if (!col) return;

      const listener = (e: KeyboardEvent): void => {
        if (NAV_KEY_NAMES.includes(e.key)) {
          e.preventDefault();
          this.handleNavKey(type, e.key);
        }
      };

      col.addEventListener('keydown', listener);
      this.keydownListeners.set(type, listener);
    });
  }

  private getColumnFromRenderer(type: WheelColumnType): HTMLDivElement | null {
    return this.core.getModalElement()?.querySelector<HTMLDivElement>(COLUMN_SELECTORS[type]) ?? null;
  }

  private handleNavKey(columnType: WheelColumnType, key: string): void {
    const currentValue = this.scrollHandler.getSelectedValue(columnType);
    if (currentValue === null) return;

    const col = this.getColumnFromRenderer(columnType);
    if (!col) return;

    const items = col.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    if (items.length === 0) return;

    const currentIndex = indexOfValue(items, currentValue);
    if (currentIndex < 0) return;

    const lastIndex = items.length - 1;
    const nextIndex = this.findEnabledIndex(items, key, currentIndex, lastIndex);
    if (nextIndex < 0 || nextIndex > lastIndex || nextIndex === currentIndex) return;

    const nextValue = items[nextIndex].getAttribute('data-value');
    if (nextValue !== null) {
      this.scrollHandler.scrollToValue(columnType, nextValue);
      this.handleColumnScrollEnd(columnType, nextValue);
    }
  }

  private findEnabledIndex(
    items: NodeListOf<HTMLDivElement>,
    key: string,
    currentIndex: number,
    lastIndex: number,
  ): number {
    const [direction, target] = NAV_KEYS[key];
    let index = target(currentIndex, lastIndex);
    while (index >= 0 && index < items.length && items[index].classList.contains('is-disabled')) {
      index += direction;
    }
    return index;
  }

  private removeKeyboardListeners(): void {
    this.keydownListeners.forEach((listener, type) => {
      const col = this.getColumnFromRenderer(type);
      if (col) {
        col.removeEventListener('keydown', listener);
      }
    });
    this.keydownListeners.clear();
  }

  private attachClearListener(): void {
    this.clearHandler = (): void => {
      this.scrollHandler.scrollToValue('hours', NEUTRAL_HOUR);
      this.scrollHandler.scrollToValue('minutes', NEUTRAL_ZERO);
      this.scrollHandler.scrollToValue('seconds', NEUTRAL_ZERO);
    };

    this.emitter.on('clear', this.clearHandler);
  }

  private removeClearListener(): void {
    if (this.clearHandler) {
      this.emitter.off('clear', this.clearHandler);
      this.clearHandler = null;
    }
  }

  private captureCurrentValues(): void {
    const selection = this.scrollHandler.getCurrentSelection();
    this.previousValues.set('hours', selection.hour);
    this.previousValues.set('minutes', selection.minute);
    this.previousValues.set('seconds', selection.second);
    this.previousValues.set('ampm', selection.ampm);
  }
}
