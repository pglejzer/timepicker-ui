import type { CoreState } from '../../../timepicker/CoreState';
import type { WheelColumnType, WheelSelectionState, WheelScrollEndCallback } from './WheelTypes';
import type { WheelRenderer } from './WheelRenderer';
import type { WheelDragHandler } from './WheelDragHandler';

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

  scrollToValue(columnType: WheelColumnType, value: string): void {
    const col = this.renderer.getColumnElement(columnType);
    if (!col || !this.dragHandler) return;

    const itemHeight = this.renderer.getItemHeight();
    if (itemHeight <= 0) return;

    const items = this.renderer.getItems(columnType);
    if (!items) return;

    let targetIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-value') === value) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex < 0) return;

    const offset = targetIndex * itemHeight;
    this.dragHandler.setScrollOffset(columnType, offset);
    this.applyVisualClassesForIndex(columnType, targetIndex);
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
    const hour = this.getSelectedValue('hours') ?? '12';
    const minute = this.getSelectedValue('minutes') ?? '00';
    const ampm = this.core.options.clock.type !== '24h' ? this.getSelectedValue('ampm') : null;

    return { hour, minute, ampm };
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

    if (this.onScrollEnd) {
      this.onScrollEnd(columnType, value);
    }
  }

  emitScrollStart(columnType: WheelColumnType): void {
    if (this.onScrollStart) {
      this.onScrollStart(columnType);
    }
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
      item.classList.toggle('is-center', distance === 0);
      item.classList.toggle('is-near', distance === 1);
    });

    const col = this.renderer.getColumnElement(columnType);
    if (col) {
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
    for (let i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-value') === value) {
        return items[i].classList.contains('is-disabled');
      }
    }
    return false;
  }

  private scrollToNextValid(columnType: WheelColumnType, currentValue: string): void {
    const items = this.renderer.getItems(columnType);
    if (!items) return;
    let currentIndex = -1;

    for (let i = 0; i < items.length; i++) {
      if (items[i].getAttribute('data-value') === currentValue) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex < 0) return;

    const maxOffset = items.length;
    for (let offset = 1; offset <= maxOffset; offset++) {
      const nextIndex = currentIndex + offset;
      const prevIndex = currentIndex - offset;

      if (nextIndex < items.length && !items[nextIndex].classList.contains('is-disabled')) {
        const nextValue = items[nextIndex].getAttribute('data-value');
        if (nextValue !== null) {
          this.scrollToValue(columnType, nextValue);
          return;
        }
      }

      if (prevIndex >= 0 && !items[prevIndex].classList.contains('is-disabled')) {
        const prevValue = items[prevIndex].getAttribute('data-value');
        if (prevValue !== null) {
          this.scrollToValue(columnType, prevValue);
          return;
        }
      }
    }
  }
}
