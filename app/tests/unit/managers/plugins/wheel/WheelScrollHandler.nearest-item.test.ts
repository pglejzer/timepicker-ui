import { WheelScrollHandler } from '@/managers/plugins/wheel/WheelScrollHandler';
import { WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '@/managers/plugins/wheel/WheelDragHandler';
import type { WheelColumnType, WheelTimeColumn } from '@/managers/plugins/wheel/WheelTypes';
import {
  mockWheelItemHeight,
  setupWheelTestContext,
  WHEEL_ITEM_HEIGHT_PX,
  type WheelTestContext,
} from './wheel-test-helpers';

const COLUMN_VALUES: Readonly<Record<WheelTimeColumn, readonly string[]>> = {
  hours: ['02', '04', '06', '08', '10', '12'],
  minutes: Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')),
  seconds: ['00', '10', '20', '30', '40', '50'],
};

const buildItems = (values: readonly string[]): string =>
  values
    .map(
      (value) =>
        `<div class="tp-ui-wheel-item" role="option" data-value="${value}" aria-selected="false">${value}</div>`,
    )
    .join('');

const PADDING = '<div class="tp-ui-wheel-padding"></div><div class="tp-ui-wheel-padding"></div>';

const fillColumn = (modal: HTMLElement, column: WheelTimeColumn, values: readonly string[]): void => {
  const content = PADDING + buildItems(values) + PADDING;
  const existing = modal.querySelector(`.tp-ui-wheel-${column}`);
  if (existing) {
    existing.innerHTML = content;
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  wrapper.innerHTML = `<div class="tp-ui-wheel-column tp-ui-wheel-${column}" role="listbox" tabindex="0">${content}</div>`;
  modal.querySelector('.tp-ui-wheel-container')?.appendChild(wrapper);
};

describe('WheelScrollHandler.scrollToValue lands on the nearest item when the value is not listed', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;

  const ariaSelected = (column: WheelColumnType): string[] =>
    [
      ...document.querySelectorAll(`.tp-ui-modal .tp-ui-wheel-${column} .tp-ui-wheel-item[aria-selected="true"]`),
    ].map((item) => item.getAttribute('data-value') ?? '');

  const offsetOf = (column: WheelColumnType, value: string): number => {
    const values = column === 'ampm' ? ['AM', 'PM'] : COLUMN_VALUES[column];
    return values.indexOf(value) * WHEEL_ITEM_HEIGHT_PX;
  };

  beforeEach(() => {
    ctx = setupWheelTestContext('12h', 'wheel-nearest-item');
    (Object.keys(COLUMN_VALUES) as WheelTimeColumn[]).forEach((column) =>
      fillColumn(ctx.modal, column, COLUMN_VALUES[column]),
    );
    mockWheelItemHeight();

    renderer = new WheelRenderer(ctx.core);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
  });

  afterEach(() => {
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it.each<[WheelColumnType, string, string, string]>([
    ['hours', '12', '03', '04'],
    ['hours', '12', '01', '02'],
    ['hours', '02', '11', '12'],
    ['minutes', '30', '07', '05'],
    ['minutes', '30', '08', '10'],
    ['seconds', '30', '05', '10'],
    ['seconds', '00', '54', '50'],
  ])('%s at %s: value %s scrolls to %s', (column, from, requested, expected) => {
    scrollHandler.scrollToValue(column, from);

    scrollHandler.scrollToValue(column, requested);

    expect(scrollHandler.getSelectedValue(column)).toBe(expected);
    expect(dragHandler.getScrollOffset(column)).toBe(offsetOf(column, expected));
    expect(ariaSelected(column)).toEqual([expected]);
  });

  it('still scrolls to a listed value exactly', () => {
    scrollHandler.scrollToValue('hours', '06');

    expect(scrollHandler.getSelectedValue('hours')).toBe('06');
    expect(dragHandler.getScrollOffset('hours')).toBe(offsetOf('hours', '06'));
  });

  it('leaves the AM/PM column where it is for a value it does not list', () => {
    scrollHandler.scrollToValue('ampm', 'PM');

    scrollHandler.scrollToValue('ampm', 'XX');

    expect(scrollHandler.getSelectedValue('ampm')).toBe('PM');
    expect(dragHandler.getScrollOffset('ampm')).toBe(offsetOf('ampm', 'PM'));
    expect(ariaSelected('ampm')).toEqual(['PM']);
  });
});
