import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isDocument } from '../../../utils/node';
import type { WheelColumnType } from './WheelTypes';

const COLUMN_SELECTORS: Record<WheelColumnType, string> = {
  hours: '.tp-ui-wheel-hours',
  minutes: '.tp-ui-wheel-minutes',
  ampm: '.tp-ui-wheel-ampm',
};

export class WheelRenderer {
  private core: CoreState;
  private columns: Map<WheelColumnType, HTMLDivElement> = new Map();
  private cachedItemHeight: number | null = null;
  private cachedItems: Map<WheelColumnType, NodeListOf<HTMLDivElement>> = new Map();

  constructor(core: CoreState, _emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
  }

  init(): void {
    if (!isDocument()) return;

    const modal = this.core.getModalElement();
    if (!modal) return;

    const columnTypes: readonly WheelColumnType[] = ['hours', 'minutes', 'ampm'];
    columnTypes.forEach((type) => {
      const el = modal.querySelector<HTMLDivElement>(COLUMN_SELECTORS[type]);
      if (el) {
        this.columns.set(type, el);
      }
    });

    this.updateDisabledItems();
  }

  updateDisabledItems(): void {
    const disabled = this.core.disabledTime;
    if (!disabled?.value) return;

    const hoursColumn = this.columns.get('hours');
    const minutesColumn = this.columns.get('minutes');

    if (hoursColumn && disabled.value.hours) {
      const disabledSet = new Set(disabled.value.hours.map(String));
      const items = hoursColumn.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
      items.forEach((item) => {
        const val = item.getAttribute('data-value');
        if (val !== null) {
          const numVal = String(parseInt(val, 10));
          item.classList.toggle('is-disabled', disabledSet.has(numVal) || disabledSet.has(val));
        }
      });
    }

    if (minutesColumn && disabled.value.minutes) {
      const disabledSet = new Set(disabled.value.minutes.map(String));
      const items = minutesColumn.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
      items.forEach((item) => {
        const val = item.getAttribute('data-value');
        if (val !== null) {
          const numVal = String(parseInt(val, 10));
          item.classList.toggle('is-disabled', disabledSet.has(numVal) || disabledSet.has(val));
        }
      });
    }
  }

  getColumnElement(type: WheelColumnType): HTMLDivElement | null {
    return this.columns.get(type) ?? null;
  }

  getItems(type: WheelColumnType): NodeListOf<HTMLDivElement> | null {
    const cached = this.cachedItems.get(type);
    if (cached) return cached;

    const col = this.columns.get(type);
    if (!col) return null;

    const items = col.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    this.cachedItems.set(type, items);
    return items;
  }

  getItemCount(type: WheelColumnType): number {
    const items = this.getItems(type);
    return items ? items.length : 0;
  }

  getItemHeight(): number {
    if (this.cachedItemHeight !== null) return this.cachedItemHeight;

    const hoursCol = this.columns.get('hours');
    if (!hoursCol) return 0;

    const firstItem = hoursCol.querySelector<HTMLDivElement>('.tp-ui-wheel-item');
    if (!firstItem) return 0;

    const height = firstItem.getBoundingClientRect().height;
    if (height > 0) {
      this.cachedItemHeight = height;
    }
    return height;
  }

  destroy(): void {
    this.columns.clear();
    this.cachedItems.clear();
    this.cachedItemHeight = null;
  }
}
