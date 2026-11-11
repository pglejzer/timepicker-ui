import type { CoreState } from '../../../timepicker/CoreState';
import { isDocument } from '../../../utils/node';
import { getClockType } from '../../../utils/options/predicates';
import { pad, type TimeValue } from '../../../utils/time/parse';
import {
  isHourDisabled,
  isMinuteDisabled,
  isSecondDisabled,
  type DisabledRules,
} from '../../../utils/time/rules';
import {
  isHourBeforeRangeFrom,
  isMinuteBeforeRangeFrom,
  isSecondBeforeRangeFrom,
  type RangeFromLimit,
} from '../../../utils/time/rangeLimit';
import type { WheelColumnType, WheelTimeColumn } from './WheelTypes';

type DisabledValue = NonNullable<NonNullable<CoreState['disabledTime']>['value']>;
type WheelTime = Partial<TimeValue>;
type ColumnCheck = (column: WheelTimeColumn, item: string) => boolean;

interface MarkContext {
  hour: string;
  minutes: string;
  type: string;
}

export const NEUTRAL_HOUR = '12';
export const NEUTRAL_ZERO = '00';

export const COLUMN_SELECTORS: Record<WheelColumnType, string> = {
  hours: '.tp-ui-wheel-hours',
  minutes: '.tp-ui-wheel-minutes',
  seconds: '.tp-ui-wheel-seconds',
  ampm: '.tp-ui-wheel-ampm',
};

export const TIME_COLUMNS: readonly WheelTimeColumn[] = ['hours', 'minutes', 'seconds'];

export const WHEEL_COLUMNS: readonly WheelColumnType[] = [...TIME_COLUMNS, 'ampm'];

const isListed = (disabledSet: ReadonlySet<string>, value: string): boolean =>
  disabledSet.has(value) || disabledSet.has(String(parseInt(value, 10)));

const setItemDisabled = (item: HTMLElement, disabled: boolean): void => {
  item.classList.toggle('is-disabled', disabled);
  item.setAttribute('aria-disabled', String(disabled));
};

export class WheelRenderer {
  private core: CoreState;
  private columns: Map<WheelColumnType, HTMLDivElement> = new Map();
  private cachedItemHeight: number | null = null;
  private cachedItems: Map<WheelColumnType, NodeListOf<HTMLDivElement>> = new Map();
  private removedItems: Map<WheelColumnType, HTMLDivElement[]> = new Map();
  private rangeLimit: RangeFromLimit | null = null;
  private hasRangeMarks = false;

  constructor(core: CoreState) {
    this.core = core;
  }

  init(): void {
    this.cachedItems.clear();
    this.cachedItemHeight = null;
    this.rangeLimit = null;
    this.hasRangeMarks = false;
    this.restoreRemovedItems();

    if (!isDocument()) return;

    const modal = this.core.getModalElement();
    if (!modal) return;

    WHEEL_COLUMNS.forEach((type) => {
      const el = modal.querySelector<HTMLDivElement>(COLUMN_SELECTORS[type]);
      if (el) {
        this.columns.set(type, el);
      }
    });

    this.updateDisabledItems();
  }

  setRangeLimit(limit: RangeFromLimit | null): void {
    this.rangeLimit = limit;
  }

  hasRangeLimit(): boolean {
    return this.rangeLimit !== null;
  }

  updateDisabledItems(wheelTime: WheelTime | null = null): void {
    const value = this.core.disabledTime?.value;
    const beforeFrom = this.buildRangeCheck(this.resolveContext(wheelTime));

    if (!beforeFrom) {
      this.clearRangeMarks();
    }
    if (!value && !beforeFrom) return;

    const shouldHide = this.core.options.wheel.hideDisabled === true;

    if (shouldHide) {
      this.restoreRemovedItems();
      this.invalidateItemCache();
    }

    if (value?.predicate) {
      this.updateDisabledByRules(this.buildPredicateRules(value), value, shouldHide, wheelTime, beforeFrom);
    } else if (value?.isInterval && value.intervals) {
      this.updateDisabledByRules(this.buildIntervalRules(value), null, shouldHide, wheelTime, beforeFrom);
    } else {
      this.updateDisabledByFlatLists(value ?? null, shouldHide, beforeFrom);
    }

    this.hasRangeMarks = beforeFrom !== null;

    if (shouldHide) {
      this.invalidateItemCache();
    }
  }

  private updateDisabledByFlatLists(
    value: DisabledValue | null,
    shouldHide: boolean,
    beforeFrom: ColumnCheck | null,
  ): void {
    TIME_COLUMNS.forEach((type) => {
      const list = value?.[type];
      if (!list && !beforeFrom) return;

      const disabledSet = new Set((list ?? []).map(String));
      this.markDisabled(
        type,
        shouldHide,
        (item) => isListed(disabledSet, item) || (beforeFrom?.(type, item) ?? false),
      );
    });
  }

  private buildIntervalRules(value: DisabledValue): DisabledRules {
    return {
      intervals: value.intervals,
      clockType: value.clockType === '24h' ? '24h' : '12h',
    };
  }

  private buildPredicateRules(value: DisabledValue): DisabledRules {
    return {
      intervals: value.isInterval ? value.intervals : undefined,
      predicate: value.predicate,
      clockType: (value.clockType ?? getClockType(this.core.options)) === '24h' ? '24h' : '12h',
    };
  }

  private updateDisabledByRules(
    rules: DisabledRules,
    lists: DisabledValue | null,
    shouldHide: boolean,
    wheelTime: WheelTime | null,
    beforeFrom: ColumnCheck | null,
  ): void {
    const listed = (type: WheelTimeColumn, item: string): boolean => {
      const list = lists && !lists.isInterval ? lists[type] : undefined;
      return list ? isListed(new Set(list.map(String)), item) : false;
    };
    const blocked = (type: WheelTimeColumn, item: string): boolean =>
      listed(type, item) || (beforeFrom?.(type, item) ?? false);
    const showSeconds = this.core.options.clock.showSeconds === true;
    const { hour, minutes, type } = this.resolveContext(wheelTime);

    this.markDisabled(
      'hours',
      shouldHide,
      (item) => blocked('hours', item) || isHourDisabled(rules, { hour: item, type }, showSeconds),
    );
    this.markDisabled(
      'minutes',
      shouldHide,
      (item) =>
        blocked('minutes', item) || isMinuteDisabled(rules, { hour, minutes: item, type }, showSeconds),
    );
    this.markDisabled(
      'seconds',
      shouldHide,
      (item) => blocked('seconds', item) || isSecondDisabled(rules, { hour, minutes, seconds: item, type }),
    );
  }

  private resolveContext(wheelTime: WheelTime | null): MarkContext {
    return {
      type: wheelTime?.type || this.getHeaderPeriod(),
      hour: this.getHeaderValue(this.core.getHour()) ?? wheelTime?.hour ?? NEUTRAL_HOUR,
      minutes: this.getHeaderValue(this.core.getMinutes()) ?? wheelTime?.minutes ?? NEUTRAL_ZERO,
    };
  }

  private buildRangeCheck({ hour, minutes, type }: MarkContext): ColumnCheck | null {
    const limit = this.rangeLimit;
    if (!limit) return null;

    const clockType = getClockType(this.core.options);
    return (column, item) => {
      if (column === 'hours') return isHourBeforeRangeFrom(item, type, limit, clockType);
      if (column === 'minutes') return isMinuteBeforeRangeFrom(item, hour, type, limit, clockType);
      return isSecondBeforeRangeFrom(item, minutes, hour, type, limit, clockType);
    };
  }

  private clearRangeMarks(): void {
    if (!this.hasRangeMarks) return;

    this.hasRangeMarks = false;
    this.restoreRemovedItems();
    this.invalidateItemCache();
    TIME_COLUMNS.forEach((type) => this.markDisabled(type, false, () => false));
  }

  private markDisabled(
    type: WheelColumnType,
    shouldHide: boolean,
    isDisabled: (value: string) => boolean,
  ): void {
    const column = this.columns.get(type);
    if (!column) return;

    column.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item').forEach((item) => {
      const value = item.getAttribute('data-value');
      if (value === null) return;

      const disabled = isDisabled(value);
      setItemDisabled(item, disabled);
      if (shouldHide && disabled) {
        this.removeItemFromDOM(item, type);
      }
    });
  }

  getHeaderPeriod(): string {
    return this.core.getAM()?.classList.contains('active') ? 'AM' : 'PM';
  }

  private getHeaderValue(field: HTMLInputElement | null): string | null {
    const value = field?.value;
    return value ? pad(value) : null;
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

    const firstItem = hoursCol.querySelector<HTMLDivElement>('.tp-ui-wheel-item');
    if (!firstItem) return 0;

    const height = firstItem.getBoundingClientRect().height;
    if (height > 0) {
      this.cachedItemHeight = height;
    }
    return height;
  }

  private removeItemFromDOM(item: HTMLDivElement, type: WheelColumnType): void {
    const list = this.removedItems.get(type) ?? [];
    list.push(item);
    this.removedItems.set(type, list);

    item.remove();
  }

  private restoreRemovedItems(): void {
    WHEEL_COLUMNS.forEach((type) => {
      const removed = this.removedItems.get(type);
      if (!removed || removed.length === 0) return;

      const col = this.columns.get(type);
      if (!col) return;

      const existingItems = Array.from(col.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item'));
      removed.forEach((item) => {
        setItemDisabled(item, false);
        const itemValue = parseInt(item.getAttribute('data-value') ?? '0', 10);
        const insertBefore = existingItems.find((existing) => {
          const existingValue = parseInt(existing.getAttribute('data-value') ?? '0', 10);
          return existingValue > itemValue;
        });
        if (insertBefore) {
          col.insertBefore(item, insertBefore);
        } else {
          const lastExisting = existingItems[existingItems.length - 1];
          const ref = lastExisting?.nextSibling ?? null;
          if (ref) {
            col.insertBefore(item, ref);
          } else {
            col.appendChild(item);
          }
        }
        existingItems.push(item);
        existingItems.sort((a, b) => {
          return (
            parseInt(a.getAttribute('data-value') ?? '0', 10) -
            parseInt(b.getAttribute('data-value') ?? '0', 10)
          );
        });
      });
    });
    this.removedItems.clear();
  }

  destroy(): void {
    this.rangeLimit = null;
    this.hasRangeMarks = false;
    this.restoreRemovedItems();
    this.columns.clear();
    this.cachedItems.clear();
    this.cachedItemHeight = null;
    this.removedItems.clear();
  }
}
