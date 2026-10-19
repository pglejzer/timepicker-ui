import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimeOfDay } from '@/types/options';
import { mockWheelItemHeight } from './wheel-test-helpers';

const SETTLE_MS = 1000;

type Column = 'hours' | 'minutes';
type Mode = 'wheel' | 'compact-wheel';

const openWheel = (
  mode: Mode,
  isTimeDisabled: (time: TimeOfDay) => boolean,
  value = '12:10',
): TimepickerUI => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h', isTimeDisabled },
    ui: { mode, animation: false },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
  return picker;
};

const items = (column: Column): HTMLElement[] => [
  ...document.querySelectorAll<HTMLElement>(`.tp-ui-modal .tp-ui-wheel-${column} .tp-ui-wheel-item`),
];

const disabled = (column: Column): number[] =>
  items(column)
    .filter((item) => item.classList.contains('is-disabled'))
    .map((item) => Number(item.getAttribute('data-value')));

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

describe('wheel items honour clock.isTimeDisabled (no disabledTime configured)', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe.each<Mode>(['wheel', 'compact-wheel'])('%s', (mode) => {
    it('marks hour items with is-disabled and aria-disabled', () => {
      openWheel(mode, ({ hour }) => hour < 9 || hour >= 17);

      expect(disabled('hours')).toEqual([...range(0, 8), ...range(17, 23)]);
      const noon = items('hours').find((item) => item.getAttribute('data-value') === '12');
      expect(noon?.getAttribute('aria-disabled')).toBe('false');
      const early = items('hours').find((item) => item.getAttribute('data-value') === '03');
      expect(early?.getAttribute('aria-disabled')).toBe('true');
    });

    it('marks minute items that the predicate disables', () => {
      openWheel(mode, ({ minutes }) => minutes >= 45);

      expect(disabled('minutes')).toEqual(range(45, 59));
      expect(disabled('hours')).toEqual([]);
    });

    it('marks nothing when the predicate never disables', () => {
      openWheel(mode, () => false);

      expect(disabled('hours')).toEqual([]);
      expect(disabled('minutes')).toEqual([]);
    });
  });

  describe('refreshDisabledTime', () => {
    it('updates the marks and clears the stale ones when the data behind the function changes', () => {
      let blockedFrom = 20;
      const picker = openWheel('wheel', ({ hour }) => hour >= blockedFrom);
      expect(disabled('hours')).toEqual(range(20, 23));

      blockedFrom = 14;
      picker.refreshDisabledTime();
      expect(disabled('hours')).toEqual(range(14, 23));

      blockedFrom = 22;
      picker.refreshDisabledTime();
      expect(disabled('hours')).toEqual(range(22, 23));
      const freed = items('hours').find((item) => item.getAttribute('data-value') === '15');
      expect(freed?.classList.contains('is-disabled')).toBe(false);
      expect(freed?.getAttribute('aria-disabled')).toBe('false');
    });

    it('clears every mark when the refresh leaves no disabled times', () => {
      let blocked = true;
      const picker = openWheel('wheel', ({ hour }) => blocked && hour === 3);
      expect(disabled('hours')).toEqual([3]);

      blocked = false;
      picker.refreshDisabledTime();

      expect(disabled('hours')).toEqual([]);
      expect(items('hours').every((item) => item.getAttribute('aria-disabled') !== 'true')).toBe(true);
    });

    it('does not rebuild the wheel items or change the selection', () => {
      let blockedHour = 3;
      const picker = openWheel('wheel', ({ hour }) => hour === blockedHour);
      const before = items('hours');
      const onUpdate = jest.fn();
      const onConfirm = jest.fn();
      picker.on('update', onUpdate);
      picker.on('confirm', onConfirm);

      blockedHour = 5;
      picker.refreshDisabledTime();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(items('hours')).toEqual(before);
      expect(items('hours').every((item, index) => item === before[index])).toBe(true);
      expect(onUpdate).not.toHaveBeenCalled();
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
