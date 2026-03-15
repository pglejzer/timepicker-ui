import type { CoreState } from '../../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../../utils/EventEmitter';
import { isDocument } from '../../../utils/node';
import { checkedDisabledValuesInterval } from '../../../utils/time/disable';
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
    this.cachedItems.clear();
    this.cachedItemHeight = null;

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

    const shouldHide = this.core.options.clock.disabledTime?.hideOptions === true;

    if (disabled.value.isInterval && disabled.value.intervals) {
      this.updateDisabledByInterval(disabled.value, shouldHide);
    } else {
      this.updateDisabledByFlatLists(disabled.value, shouldHide);
    }

    if (shouldHide) {
      this.invalidateItemCache();
    }
  }

  private updateDisabledByFlatLists(
    value: NonNullable<NonNullable<typeof this.core.disabledTime>['value']>,
    shouldHide: boolean,
  ): void {
    const hoursColumn = this.columns.get('hours');
    const minutesColumn = this.columns.get('minutes');

    if (hoursColumn && value.hours) {
      const disabledSet = new Set(value.hours.map(String));
      this.toggleDisabledOnItems(hoursColumn, disabledSet, shouldHide);
    }

    if (minutesColumn && value.minutes) {
      const disabledSet = new Set(value.minutes.map(String));
      this.toggleDisabledOnItems(minutesColumn, disabledSet, shouldHide);
    }
  }

  private updateDisabledByInterval(
    value: NonNullable<NonNullable<typeof this.core.disabledTime>['value']>,
    shouldHide: boolean,
  ): void {
    const clockType = (value.clockType as '12h' | '24h') ?? '12h';
    const intervals = value.intervals;
    const amPm = this.getCurrentAmPm();
    const currentHour = this.getCurrentHour();

    const hoursColumn = this.columns.get('hours');
    if (hoursColumn) {
      const items = hoursColumn.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
      items.forEach((item) => {
        const hourVal = item.getAttribute('data-value');
        if (hourVal === null) return;

        const allMinutesDisabled = this.isHourFullyDisabled(hourVal, amPm, intervals, clockType);
        item.classList.toggle('is-disabled', allMinutesDisabled);
        if (shouldHide) {
          item.classList.toggle('is-hidden', allMinutesDisabled);
        }
      });
    }

    const minutesColumn = this.columns.get('minutes');
    if (minutesColumn) {
      const items = minutesColumn.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
      items.forEach((item) => {
        const minuteVal = item.getAttribute('data-value');
        if (minuteVal === null) return;

        const isValid = checkedDisabledValuesInterval(currentHour, minuteVal, amPm, intervals, clockType);
        item.classList.toggle('is-disabled', !isValid);
        if (shouldHide) {
          item.classList.toggle('is-hidden', !isValid);
        }
      });
    }
  }

  private isHourFullyDisabled(
    hour: string,
    amPm: string,
    intervals: string[] | undefined,
    clockType: '12h' | '24h',
  ): boolean {
    if (!intervals) return false;

    for (let m = 0; m < 60; m++) {
      const minuteStr = m.toString().padStart(2, '0');
      const isValid = checkedDisabledValuesInterval(hour, minuteStr, amPm, intervals, clockType);
      if (isValid) return false;
    }
    return true;
  }

  private toggleDisabledOnItems(column: HTMLDivElement, disabledSet: Set<string>, shouldHide: boolean): void {
    const items = column.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    items.forEach((item) => {
      const val = item.getAttribute('data-value');
      if (val !== null) {
        const numVal = String(parseInt(val, 10));
        const isDisabled = disabledSet.has(numVal) || disabledSet.has(val);
        item.classList.toggle('is-disabled', isDisabled);
        if (shouldHide) {
          item.classList.toggle('is-hidden', isDisabled);
        }
      }
    });
  }

  private getCurrentAmPm(): string {
    const am = this.core.getAM();
    if (am?.classList.contains('active')) return 'AM';
    return 'PM';
  }

  private getCurrentHour(): string {
    const hourInput = this.core.getHour();
    return hourInput?.value?.padStart(2, '0') ?? '12';
  }

  getColumnElement(type: WheelColumnType): HTMLDivElement | null {
    return this.columns.get(type) ?? null;
  }

  getItems(type: WheelColumnType): NodeListOf<HTMLDivElement> | null {
    const cached = this.cachedItems.get(type);
    if (cached) return cached;

    const col = this.columns.get(type);
    if (!col) return null;

    const shouldHide = this.core.options.clock.disabledTime?.hideOptions === true;
    const selector = shouldHide ? '.tp-ui-wheel-item:not(.is-hidden)' : '.tp-ui-wheel-item';

    const items = col.querySelectorAll<HTMLDivElement>(selector);
    this.cachedItems.set(type, items);
    return items;
  }

  invalidateItemCache(): void {
    this.cachedItems.clear();
    this.cachedItemHeight = null;
  }

  getItemCount(type: WheelColumnType): number {
    const items = this.getItems(type);
    return items ? items.length : 0;
  }

  getItemHeight(): number {
    if (this.cachedItemHeight !== null) return this.cachedItemHeight;

    const hoursCol = this.columns.get('hours');
    if (!hoursCol) return 0;

    const firstItem = hoursCol.querySelector<HTMLDivElement>('.tp-ui-wheel-item:not(.is-hidden)');
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
