import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { mockWheelItemHeight, selectedWheelValue } from './wheel-test-helpers';

const EMPTY_12H_DEFAULT_PERIOD = 'PM';
const FRAME_MS = 16;
const SETTLE_MS = 1000;

const openCompactWheel = (value: string): TimepickerUI => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '12h' },
    ui: { mode: 'compact-wheel', animation: false, clearButton: true },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
  return picker;
};

const countChanges = (samples: ReadonlyArray<string | null>): number =>
  samples.filter((sample, index) => index > 0 && sample !== samples[index - 1]).length;

describe('compact-wheel 12h defaults the period like clock mode does for an empty input', () => {
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

  it('should open an empty input on the default period', () => {
    openCompactWheel('');

    expect(selectedWheelValue('ampm')).toBe(EMPTY_12H_DEFAULT_PERIOD);
  });

  it('should land on the default period after Clear without flipping through the other period', () => {
    const picker = openCompactWheel('09:15 PM');
    expect(selectedWheelValue('ampm')).toBe('PM');
    const onAm = jest.fn();
    const onPm = jest.fn();
    picker.on('select:am', onAm);
    picker.on('select:pm', onPm);
    const samples: Array<string | null> = [selectedWheelValue('ampm')];

    const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
    expect(clear).toHaveAttribute('aria-disabled', 'false');
    clear.click();
    samples.push(selectedWheelValue('ampm'));
    for (let frame = 0; frame < 3; frame++) {
      jest.advanceTimersByTime(FRAME_MS);
      samples.push(selectedWheelValue('ampm'));
    }
    jest.advanceTimersByTime(SETTLE_MS);
    samples.push(selectedWheelValue('ampm'));

    expect(samples[samples.length - 1]).toBe(EMPTY_12H_DEFAULT_PERIOD);
    expect(countChanges(samples)).toBeLessThanOrEqual(1);
    expect(onAm).not.toHaveBeenCalled();
    expect(onPm.mock.calls.length).toBeLessThanOrEqual(1);
  });
});
