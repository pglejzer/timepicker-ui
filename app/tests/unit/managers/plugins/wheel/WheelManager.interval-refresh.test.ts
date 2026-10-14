import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { mockWheelItemHeight, selectedWheelValue } from './wheel-test-helpers';

const SETTLE_MS = 1000;
const INTERVAL = '14:00 - 14:30';
const INPUT_VALUE = '15:10';
const DISABLED_IN_HOUR_14 = Array.from({ length: 31 }, (_, minute) => String(minute).padStart(2, '0'));

const openCompactWheel = (): TimepickerUI => {
  const input = document.createElement('input');
  input.value = INPUT_VALUE;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h', disabledTime: { interval: INTERVAL } },
    ui: { mode: 'compact-wheel', animation: false },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
  return picker;
};

const column = (name: 'hours' | 'minutes'): HTMLElement => {
  const element = document.querySelector<HTMLElement>(`.tp-ui-modal .tp-ui-wheel-${name}`);
  if (!element) throw new Error(`the ${name} column is not rendered`);
  return element;
};

const disabledMinutes = (): string[] =>
  [...column('minutes').querySelectorAll('.tp-ui-wheel-item.is-disabled')].map(
    (item) => item.getAttribute('data-value') ?? '',
  );

const pressOnHours = (key: string): void => {
  column('hours').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  jest.advanceTimersByTime(SETTLE_MS);
};

describe('compact-wheel 24h moves an interval-disabled minute when the hour changes', () => {
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

  it('should open on the input value with every minute free', () => {
    openCompactWheel();

    expect(selectedWheelValue('hours')).toBe('15');
    expect(selectedWheelValue('minutes')).toBe('10');
    expect(disabledMinutes()).toEqual([]);
  });

  it('should snap the minutes column to the first free minute after ArrowUp moves the hour into the interval', () => {
    openCompactWheel();

    pressOnHours('ArrowUp');

    expect(selectedWheelValue('hours')).toBe('14');
    expect(disabledMinutes()).toEqual(DISABLED_IN_HOUR_14);
    expect(selectedWheelValue('minutes')).toBe('31');
  });

  it('should report the snapped minute, not the old one, in the last update event', () => {
    const picker = openCompactWheel();
    const onUpdate = jest.fn();
    picker.on('update', onUpdate);

    pressOnHours('ArrowUp');

    expect(onUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ hour: '14', minutes: '31' }));
  });
});
