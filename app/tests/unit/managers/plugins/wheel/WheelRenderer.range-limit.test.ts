import { WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import type { CoreState } from '@/timepicker/CoreState';
import { createTimePredicate } from '@/utils/time/predicate';
import { setupWheelTestContext } from './wheel-test-helpers';

type Column = 'hours' | 'minutes' | 'seconds';

const itemOf = (modal: HTMLElement, column: Column, value: string): Element | null =>
  modal.querySelector(`.tp-ui-wheel-${column} .tp-ui-wheel-item[data-value="${value}"]`);

const disabled = (modal: HTMLElement, column: Column, value: string): boolean | undefined =>
  itemOf(modal, column, value)?.classList.contains('is-disabled');

const clearHeader = (core: CoreState): void => {
  [core.getHour(), core.getMinutes()].forEach((field) => {
    if (field) field.value = '';
  });
};

const appendSecondsColumn = (modal: HTMLElement): void => {
  const column = document.createElement('div');
  column.className = 'tp-ui-wheel-column tp-ui-wheel-seconds';
  for (let second = 0; second < 60; second++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(second).padStart(2, '0'));
    column.appendChild(item);
  }
  modal.querySelector('.tp-ui-wheel-container')?.appendChild(column);
};

interface RendererContext {
  readonly core: CoreState;
  readonly modal: HTMLElement;
  readonly renderer: WheelRenderer;
}

type Prepare = (context: Omit<RendererContext, 'renderer'>) => void;

const mountRenderer = (prepare?: Prepare): RendererContext => {
  const { core, modal } = setupWheelTestContext('24h');
  clearHeader(core);
  prepare?.({ core, modal });
  const renderer = new WheelRenderer(core);
  renderer.init();
  return { core, modal, renderer };
};

describe('WheelRenderer range limit (before From)', () => {
  let renderer: WheelRenderer | null = null;

  afterEach(() => {
    renderer?.destroy();
    renderer = null;
    document.body.innerHTML = '';
  });

  it('16: marks hours and minutes before From, re-evaluates minutes per hour and clears on null', () => {
    const context = mountRenderer();
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9, rangeFromMinute: 30 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(renderer.hasRangeLimit()).toBe(true);
    expect(disabled(modal, 'hours', '08')).toBe(true);
    expect(disabled(modal, 'hours', '09')).toBe(false);
    expect(disabled(modal, 'minutes', '29')).toBe(true);
    expect(disabled(modal, 'minutes', '30')).toBe(false);
    expect(itemOf(modal, 'hours', '08')?.getAttribute('aria-disabled')).toBe('true');

    renderer.updateDisabledItems({ hour: '10', minutes: '00' });
    expect(disabled(modal, 'minutes', '29')).toBe(false);
    expect(disabled(modal, 'hours', '08')).toBe(true);

    renderer.setRangeLimit(null);
    renderer.updateDisabledItems(null);

    expect(renderer.hasRangeLimit()).toBe(false);
    expect(disabled(modal, 'hours', '08')).toBe(false);
    expect(itemOf(modal, 'hours', '08')?.getAttribute('aria-disabled')).toBe('false');
  });

  it('16: marks seconds before From within the minute of From only', () => {
    const context = mountRenderer(({ modal }) => appendSecondsColumn(modal));
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9, rangeFromMinute: 30, rangeFromSecond: 15 });
    renderer.updateDisabledItems({ hour: '09', minutes: '30' });

    expect(disabled(modal, 'seconds', '14')).toBe(true);
    expect(disabled(modal, 'seconds', '15')).toBe(false);

    renderer.updateDisabledItems({ hour: '09', minutes: '31' });

    expect(disabled(modal, 'seconds', '14')).toBe(false);
  });

  it('16: hideDisabled removes the items before From and brings them back on null', () => {
    const context = mountRenderer(({ core }) => core.updateOptions({ wheel: { hideDisabled: true } }));
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(itemOf(modal, 'hours', '08')).toBeNull();
    expect(itemOf(modal, 'hours', '09')).not.toBeNull();

    renderer.setRangeLimit(null);
    renderer.updateDisabledItems(null);

    expect(itemOf(modal, 'hours', '08')).not.toBeNull();
  });

  it('17: combines with clock.disabledTime lists', () => {
    const context = mountRenderer(({ core }) => core.setDisabledTime({ value: { hours: ['14'] } }));
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(disabled(modal, 'hours', '08')).toBe(true);
    expect(disabled(modal, 'hours', '14')).toBe(true);
    expect(disabled(modal, 'hours', '10')).toBe(false);
  });

  it('17: combines with clock.disabledTime intervals', () => {
    const context = mountRenderer(({ core }) =>
      core.setDisabledTime({ value: { isInterval: true, clockType: '24h', intervals: ['14:00-14:59'] } }),
    );
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(disabled(modal, 'hours', '08')).toBe(true);
    expect(disabled(modal, 'hours', '14')).toBe(true);
    expect(disabled(modal, 'hours', '10')).toBe(false);
  });

  it('17: combines with a clock.isTimeDisabled predicate', () => {
    const predicate = createTimePredicate(({ hour }) => hour >= 20);
    const context = mountRenderer(({ core }) =>
      core.setDisabledTime({ value: { predicate, clockType: '24h' } }),
    );
    renderer = context.renderer;
    const { modal } = context;

    renderer.setRangeLimit({ rangeFromHour: 9 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(disabled(modal, 'hours', '08')).toBe(true);
    expect(disabled(modal, 'hours', '21')).toBe(true);
    expect(disabled(modal, 'hours', '14')).toBe(false);
  });

  it('17: clearing the limit keeps the clock.disabledTime marks and frees the before-From marks', () => {
    const context = mountRenderer(({ core }) => core.setDisabledTime({ value: { hours: ['14'] } }));
    renderer = context.renderer;
    const { modal } = context;
    renderer.setRangeLimit({ rangeFromHour: 9, rangeFromMinute: 30 });
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });
    expect(disabled(modal, 'minutes', '29')).toBe(true);

    renderer.setRangeLimit(null);
    renderer.updateDisabledItems({ hour: '09', minutes: '00' });

    expect(disabled(modal, 'hours', '14')).toBe(true);
    expect(disabled(modal, 'hours', '08')).toBe(false);
    expect(disabled(modal, 'minutes', '29')).toBe(false);
  });
});
