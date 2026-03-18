import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import type { WheelScrollHandler } from './WheelScrollHandler';
import type { WheelColumnType } from './WheelTypes';
import { isDocument } from '../../../utils/node';
import { announceToScreenReader } from '../../../utils/accessibility';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const NEUTRAL_HOUR = '12';
const NEUTRAL_MINUTES = '00';
const NEUTRAL_AMPM = 'AM';
const COMMIT_ON_SCROLL_DELAY_MS = 400;

export class WheelEventHandler {
  private emitter: EventEmitter<TimepickerEventMap>;
  private scrollHandler: WheelScrollHandler;
  private core: CoreState;
  private keydownListeners: Map<WheelColumnType, (e: KeyboardEvent) => void> = new Map();
  private clearHandler: ((data: { previousValue: string | null }) => void) | null = null;
  private previousValues: Map<WheelColumnType, string | null> = new Map();
  private scrollStartHandler: ((columnType: WheelColumnType) => void) | null = null;
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

    this.captureCurrentValues();

    this.scrollHandler.setScrollEndCallback((columnType: WheelColumnType, value: string): void => {
      this.handleColumnScrollEnd(columnType, value);
    });

    this.scrollStartHandler = (columnType: WheelColumnType): void => {
      this.emitter.emit('wheel:scroll:start', { column: columnType });
    };
    this.scrollHandler.setScrollStartCallback(this.scrollStartHandler);

    this.attachKeyboardListeners();
    this.attachClearListener();
  }

  destroy(): void {
    this.scrollHandler.setScrollEndCallback((): void => {});
    this.scrollHandler.setScrollStartCallback(null);
    this.removeKeyboardListeners();
    this.removeClearListener();
    this.previousValues.clear();
    this.scrollStartHandler = null;
    if (this.commitOnScrollTimer !== null) {
      clearTimeout(this.commitOnScrollTimer);
      this.commitOnScrollTimer = null;
    }
  }

  private handleColumnScrollEnd(columnType: WheelColumnType, value: string): void {
    const selection = this.scrollHandler.getCurrentSelection();
    const previousValue = this.previousValues.get(columnType) ?? null;

    this.emitter.emit('wheel:scroll:end', {
      column: columnType,
      value,
      previousValue,
    });

    this.previousValues.set(columnType, value);

    const modal = this.core.getModalElement();

    switch (columnType) {
      case 'hours':
        this.syncHourInput(value);
        this.emitter.emit('select:hour', { hour: value });
        announceToScreenReader(modal, `Hour: ${value}`);
        break;
      case 'minutes':
        this.syncMinuteInput(value);
        this.emitter.emit('select:minute', { minutes: value });
        announceToScreenReader(modal, `Minutes: ${value}`);
        break;
      case 'ampm':
        this.syncAmPmState(value);
        if (value === 'AM') {
          this.emitter.emit('select:am', {});
        } else {
          this.emitter.emit('select:pm', {});
        }
        announceToScreenReader(modal, `${value} selected`);
        break;
    }

    this.emitter.emit('update', {
      hour: selection.hour,
      minutes: selection.minute,
      type: selection.ampm ?? undefined,
    });

    if (this.core.options.wheel?.commitOnScroll === true) {
      this.scheduleCommitOnScroll();
    }
  }

  private scheduleCommitOnScroll(): void {
    if (this.commitOnScrollTimer !== null) {
      clearTimeout(this.commitOnScrollTimer);
    }

    this.commitOnScrollTimer = setTimeout(() => {
      this.commitOnScrollTimer = null;
      const selection = this.scrollHandler.getCurrentSelection();

      const input = this.core.getInput();
      if (input) {
        const type = selection.ampm ? ` ${selection.ampm}` : '';
        input.value = `${selection.hour}:${selection.minute}${type}`;
      }

      this.emitter.emit('confirm', {
        hour: selection.hour,
        minutes: selection.minute,
        type: selection.ampm ?? undefined,
        autoCommit: true,
      });
    }, COMMIT_ON_SCROLL_DELAY_MS);
  }

  private syncHourInput(value: string): void {
    const hourInput = this.core.getHour();
    if (hourInput) {
      hourInput.value = value;
      hourInput.setAttribute('aria-valuenow', value);
    }
    this.core.setDegreesHours(parseInt(value, 10) * 30);
  }

  private syncMinuteInput(value: string): void {
    const minuteInput = this.core.getMinutes();
    if (minuteInput) {
      minuteInput.value = value;
      minuteInput.setAttribute('aria-valuenow', value);
    }
    this.core.setDegreesMinutes(parseInt(value, 10) * 6);
  }

  private syncAmPmState(value: string): void {
    const AM = this.core.getAM();
    const PM = this.core.getPM();

    if (AM && PM) {
      AM.classList.toggle('active', value === 'AM');
      PM.classList.toggle('active', value === 'PM');
    }
  }

  private attachKeyboardListeners(): void {
    if (!isDocument()) return;

    const columnTypes: readonly WheelColumnType[] = ['hours', 'minutes', 'ampm'];

    columnTypes.forEach((type) => {
      const col = this.scrollHandler.getCurrentSelection() ? this.getColumnFromRenderer(type) : null;

      if (!col) return;

      const listener = (e: KeyboardEvent): void => {
        if (e.key === ARROW_UP || e.key === ARROW_DOWN) {
          e.preventDefault();
          this.handleArrowKey(type, e.key);
        }
      };

      col.addEventListener('keydown', listener);
      this.keydownListeners.set(type, listener);
    });
  }

  private getColumnFromRenderer(type: WheelColumnType): HTMLDivElement | null {
    if (!isDocument()) return null;
    const modal = this.core.getModalElement();
    if (!modal) return null;

    const selectorMap: Record<WheelColumnType, string> = {
      hours: '.tp-ui-wheel-hours',
      minutes: '.tp-ui-wheel-minutes',
      ampm: '.tp-ui-wheel-ampm',
    };

    return modal.querySelector<HTMLDivElement>(selectorMap[type]);
  }

  private handleArrowKey(columnType: WheelColumnType, key: string): void {
    const currentValue = this.scrollHandler.getSelectedValue(columnType);
    if (currentValue === null) return;

    const col = this.getColumnFromRenderer(columnType);
    if (!col) return;

    const items = col.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    let currentIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-value') === currentValue) {
        currentIndex = i;
        break;
      }
    }
    if (currentIndex < 0) return;

    const direction = key === ARROW_UP ? -1 : 1;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextValue = items[nextIndex].getAttribute('data-value');
    if (nextValue !== null) {
      this.scrollHandler.scrollToValue(columnType, nextValue);
      this.handleColumnScrollEnd(columnType, nextValue);
    }
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
      this.scrollHandler.scrollToValue('minutes', NEUTRAL_MINUTES);
      this.scrollHandler.scrollToValue('ampm', NEUTRAL_AMPM);
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
    if (selection.ampm !== null) {
      this.previousValues.set('ampm', selection.ampm);
    }
  }
}
