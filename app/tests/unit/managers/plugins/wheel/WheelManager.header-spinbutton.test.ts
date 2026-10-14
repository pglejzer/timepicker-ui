import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { mockWheelItemHeight, selectedWheelValue, type WheelColumnName } from './wheel-test-helpers';

const SETTLE_MS = 1000;

const openWheel = (clockType: ClockType, value: string): void => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: clockType },
    ui: { mode: 'wheel', animation: false },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
};

const header = (selector: string): HTMLInputElement =>
  document.querySelector(`.tp-ui-modal ${selector}`) as HTMLInputElement;

const press = (target: HTMLElement, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  jest.advanceTimersByTime(SETTLE_MS);
};

type ClockType = '12h' | '24h';

interface SpinCase {
  unit: string;
  spinbutton: string;
  column: WheelColumnName;
  clockType: ClockType;
  key: string;
  before: string;
  after: string;
}

const INPUT_VALUE: Record<ClockType, string> = { '24h': '10:15', '12h': '10:15 AM' };
const HOUR = { unit: 'hour', spinbutton: '.tp-ui-hour', column: 'hours' } as const;
const MINUTE = { unit: 'minute', spinbutton: '.tp-ui-minutes', column: 'minutes' } as const;

const CASES: SpinCase[] = [
  { ...HOUR, clockType: '24h', key: 'ArrowUp', before: '10', after: '11' },
  { ...HOUR, clockType: '24h', key: 'ArrowDown', before: '10', after: '09' },
  { ...HOUR, clockType: '12h', key: 'ArrowUp', before: '10', after: '11' },
  { ...MINUTE, clockType: '24h', key: 'ArrowUp', before: '15', after: '16' },
  { ...MINUTE, clockType: '12h', key: 'ArrowDown', before: '15', after: '14' },
];

describe('wheel mode keeps the column in step with the header spinbutton', () => {
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

  it.each(CASES)(
    'should move the $column column to the new $unit after $key on the $unit spinbutton ($clockType)',
    ({ spinbutton, column, clockType, key, before, after }) => {
      openWheel(clockType, INPUT_VALUE[clockType]);
      expect(selectedWheelValue(column)).toBe(before);

      press(header(spinbutton), key);

      expect(header(spinbutton).value).toBe(after);
      expect(selectedWheelValue(column)).toBe(after);
    },
  );
});
