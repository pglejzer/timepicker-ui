import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { mockWheelItemHeight, selectedWheelValue, type WheelColumnName } from './wheel-test-helpers';

type ClockType = '12h' | '24h';
type Columns = Partial<Record<WheelColumnName, string | null>>;

const FRAME_MS = 16;
const FRAMES = 5;
const SETTLE_MS = 1000;

const COLUMNS: Record<ClockType, WheelColumnName[]> = {
  '12h': ['hours', 'minutes', 'ampm'],
  '24h': ['hours', 'minutes'],
};

const INPUT_VALUE: Record<ClockType, string> = { '12h': '09:15 AM', '24h': '09:15' };

const AT_INPUT_VALUE: Record<ClockType, Columns> = {
  '12h': { hours: '09', minutes: '15', ampm: 'AM' },
  '24h': { hours: '09', minutes: '15' },
};

const EMPTY_INPUT_DEFAULT: Record<ClockType, Columns> = {
  '12h': { hours: '12', minutes: '00', ampm: 'PM' },
  '24h': { hours: '00', minutes: '00' },
};

const CLOCK_TYPES: ClockType[] = ['12h', '24h'];

const readColumns = (clockType: ClockType): Columns =>
  Object.fromEntries(COLUMNS[clockType].map((column) => [column, selectedWheelValue(column)]));

const countChanges = (samples: ReadonlyArray<string | null | undefined>): number =>
  samples.filter((sample, index) => index > 0 && sample !== samples[index - 1]).length;

const openCompactWheel = (clockType: ClockType, value: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: clockType },
    ui: { mode: 'compact-wheel', animation: false, clearButton: true },
    clearBehavior: { clearInput: false },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
  return input;
};

const clickClear = (): void => {
  const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
  expect(clear).toHaveAttribute('aria-disabled', 'false');
  clear.click();
};

describe('compact-wheel Clear with clearBehavior.clearInput: false', () => {
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

  it.each(CLOCK_TYPES)('should open an empty input on the empty-input default (%s)', (clockType) => {
    openCompactWheel(clockType, '');

    expect(readColumns(clockType)).toEqual(EMPTY_INPUT_DEFAULT[clockType]);
  });

  it.each(CLOCK_TYPES)(
    'should keep the input value and leave the columns on the empty-input default after every frame (%s)',
    (clockType) => {
      const input = openCompactWheel(clockType, INPUT_VALUE[clockType]);
      expect(readColumns(clockType)).toEqual(AT_INPUT_VALUE[clockType]);
      const samples: Columns[] = [readColumns(clockType)];

      clickClear();
      samples.push(readColumns(clockType));
      for (let frame = 0; frame < FRAMES; frame++) {
        jest.advanceTimersByTime(FRAME_MS);
        samples.push(readColumns(clockType));
      }
      jest.advanceTimersByTime(SETTLE_MS);
      samples.push(readColumns(clockType));

      expect(input.value).toBe(INPUT_VALUE[clockType]);
      expect(samples[samples.length - 1]).toEqual(EMPTY_INPUT_DEFAULT[clockType]);
      expect(
        Object.fromEntries(
          COLUMNS[clockType].map((column) => [column, countChanges(samples.map((sample) => sample[column]))]),
        ),
      ).toEqual(Object.fromEntries(COLUMNS[clockType].map((column) => [column, 1])));
    },
  );
});
