import type { CoreState } from '../../../timepicker/CoreState';
import type { TimeValue } from '../../../utils/time/parse';
import type { WheelColumnType, WheelSelectionState, WheelScrollEndCallback } from './WheelTypes';
import { NEUTRAL_HOUR, NEUTRAL_ZERO, type WheelRenderer } from './WheelRenderer';
import type { WheelDragHandler } from './WheelDragHandler';

export const indexOfValue = (items: ArrayLike<Element>, value: string): number =>
  Array.from(items).findIndex((item) => item.getAttribute('data-value') === value);

const nearestEnabledIndex = (items: ArrayLike<Element>, value: string): number => {
  const target = parseInt(value, 10);
  let nearest = -1;
  let nearestDistance = Infinity;
  Array.from(items).forEach((item, index) => {
    const distance = Math.abs(parseInt(item.getAttribute('data-value') ?? '', 10) - target);
    if (distance <= nearestDistance && !item.classList.contains('is-disabled')) {
      nearest = index;
      nearestDistance = distance;
    }
  });
  return nearest;
};

const findValueIndex = (items: ArrayLike<Element>, value: string, columnType: WheelColumnType): number => {
  const index = indexOfValue(items, value);
  return index < 0 && columnType !== 'ampm' ? nearestEnabledIndex(items, value) : index;
};

export const selectionToTime = ({ hour, minute, second, ampm }: WheelSelectionState): TimeValue => ({
  hour,
  minutes: minute,
  seconds: second ?? undefined,
  type: ampm ?? undefined,
});

export class WheelScrollHandler {
  private renderer: WheelRenderer;
  private core: CoreState;
  private dragHandler: WheelDragHandler | null = null;
  private onScrollEnd: WheelScrollEndCallback | null = null;
  private onScrollStart: ((columnType: WheelColumnType) => void) | null = null;

  constructor(renderer: WheelRenderer, core: CoreState) {
    this.renderer = renderer;
    this.core = core;
  }

  setDragHandler(dragHandler: WheelDragHandler): void {
    this.dragHandler = dragHandler;
  }

  init(): void {
    if (this.dragHandler) {
      this.dragHandler.setSnapCallback((columnType: WheelColumnType): void => {
        this.onColumnSnapped(columnType);
      });
      this.dragHandler.setScrollStartCallback((columnType: WheelColumnType): void => {
        this.emitScrollStart(columnType);
      });
    }
  }

  setScrollEndCallback(callback: WheelScrollEndCallback): void {
    this.onScrollEnd = callback;
  }

  setScrollStartCallback(callback: ((columnType: WheelColumnType) => void) | null): void {
    this.onScrollStart = callback;
  }

  scrollToValue(columnType: WheelColumnType, value: string, commit = false): void {
    const col = this.renderer.getColumnElement(columnType);
    if (!col || !this.dragHandler) return;

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return;

    const items = this.renderer.getItems(columnType);
    if (!items) return;

    const targetIndex = findValueIndex(items, value, columnType);
    if (targetIndex < 0) return;

    this.dragHandler.setScrollOffset(columnType, targetIndex * itemHeight);
    this.applyVisualClassesForIndex(columnType, targetIndex);

    if (commit) {
      this.onScrollEnd?.(columnType, items[targetIndex].getAttribute('data-value') ?? value);
    }
  }

  resolveValue(columnType: WheelColumnType, value: string): string | null {
    const items = this.renderer.getItems(columnType);
    if (!items) return null;
    return items[findValueIndex(items, value, columnType)]?.getAttribute('data-value') ?? null;
  }

  getSelectedValue(columnType: WheelColumnType): string | null {
    if (!this.dragHandler) return null;

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return null;

    const offset = this.dragHandler.getScrollOffset(columnType);
    const index = Math.round(offset / itemHeight);
    const items = this.renderer.getItems(columnType);

    if (!items || index < 0 || index >= items.length) return null;

    return items[index].getAttribute('data-value');
  }

  getCurrentSelection(): WheelSelectionState {
    const { clock } = this.core.options;
    const hour = this.getSelectedValue('hours') ?? NEUTRAL_HOUR;
    const minute = this.getSelectedValue('minutes') ?? NEUTRAL_ZERO;
    const second = clock.showSeconds ? (this.getSelectedValue('seconds') ?? NEUTRAL_ZERO) : null;
    let ampm: string | null = null;

    if (clock.type !== '24h') {
      ampm = this.getSelectedValue('ampm') ?? this.renderer.getHeaderPeriod();
    }

    return { hour, minute, second, ampm };
  }

  findFirstAvailable(
    columnType: WheelColumnType,
    preferredValue: string | null,
  ): string | null {
    const items = this.renderer.getItems(columnType);
    if (!items || items.length === 0) return null;

    if (preferredValue !== null) {
      for (const it of items) {
        if (
          it.getAttribute('data-value') === preferredValue &&
          !it.classList.contains('is-disabled')
        ) {
          return preferredValue;
        }
      }
    }

    for (const it of items) {
      if (!it.classList.contains('is-disabled')) {
        const val = it.getAttribute('data-value');
        if (val !== null) return val;
      }
    }

    return null;
  }

  destroy(): void {
    this.onScrollEnd = null;
    this.onScrollStart = null;
    this.dragHandler = null;
  }

  private onColumnSnapped(columnType: WheelColumnType): void {
    const value = this.getSelectedValue(columnType);
    if (value === null) return;

    if (this.isValueDisabled(columnType, value)) {
      this.scrollToNextValid(columnType, value);
      return;
    }

    this.onScrollEnd?.(columnType, value);
  }

  emitScrollStart(columnType: WheelColumnType): void {
    this.onScrollStart?.(columnType);
  }

  updateVisualClasses(columnType: WheelColumnType): void {
    if (!this.dragHandler) return;

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return;

    const offset = this.dragHandler.getScrollOffset(columnType);
    const centerIndex = Math.round(offset / itemHeight);
    this.applyVisualClassesForIndex(columnType, centerIndex);
  }

  private applyVisualClassesForIndex(columnType: WheelColumnType, centerIndex: number): void {
    const items = this.renderer.getItems(columnType);
    if (!items) return;

    items.forEach((item, i) => {
      const distance = Math.abs(i - centerIndex);
      const isCenter = distance === 0;
      item.classList.toggle('is-center', isCenter);
      item.classList.toggle('is-near', distance === 1);
      item.setAttribute('aria-selected', String(isCenter));
    });

    const col = this.renderer.getColumnElement(columnType);
    if (col) {
      const centerItem = items[centerIndex];
      if (centerItem) {
        const itemId = centerItem.getAttribute('id');
        if (itemId) {
          col.setAttribute('aria-activedescendant', itemId);
        }
      }

      const wrapper = col.parentElement;
      if (wrapper) {
        wrapper.classList.toggle('at-start', centerIndex <= 0);
        wrapper.classList.toggle('at-end', centerIndex >= items.length - 1);
      }
    }
  }

  private isValueDisabled(columnType: WheelColumnType, value: string): boolean {
    const items = this.renderer.getItems(columnType);
    if (!items) return false;
    return items[indexOfValue(items, value)]?.classList.contains('is-disabled') ?? false;
  }

  private scrollToNextValid(columnType: WheelColumnType, currentValue: string): void {
    const items = this.renderer.getItems(columnType);
    if (!items) return;

    const currentIndex = indexOfValue(items, currentValue);
    if (currentIndex < 0) return;

    for (let offset = 1; offset <= items.length; offset++) {
      for (const index of [currentIndex + offset, currentIndex - offset]) {
        const item: HTMLDivElement | undefined = items[index];
        const value = item?.classList.contains('is-disabled') ? null : item?.getAttribute('data-value');
        if (value) {
          this.scrollToValue(columnType, value, true);
          return;
        }
      }
    }
  }
}
