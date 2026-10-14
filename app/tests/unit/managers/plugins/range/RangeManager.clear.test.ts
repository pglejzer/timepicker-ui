import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { accessibleName } from './range-test-helpers';

type Part = 'from' | 'to';
type ClockType = '12h' | '24h';

const PARTS: Part[] = ['from', 'to'];
const LABELS: Record<Part, string> = { from: 'Od', to: 'Do' };
const PLACEHOLDER = '--:--';
const SETTLE_MS = 1000;

const tab = (part: Part): HTMLElement =>
  document.querySelector(`.tp-ui-modal .tp-ui-range-tab.tp-ui-range-${part}`) as HTMLElement;
const timeOf = (part: Part): HTMLElement =>
  document.querySelector(`.tp-ui-modal .tp-ui-range-${part}-time`) as HTMLElement;

const readTabs = (): Array<{ part: Part; text: string | null; hidden: string | null; name: string }> =>
  PARTS.map((part) => ({
    part,
    text: timeOf(part).textContent,
    hidden: timeOf(part).getAttribute('aria-hidden'),
    name: accessibleName(tab(part)),
  }));

const openRange = (clockType: ClockType, value: string): void => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: clockType },
    ui: { animation: false, clearButton: true },
    range: { enabled: true, fromLabel: LABELS.from, toLabel: LABELS.to },
  });
  picker.create();
  picker.open();
};

const clickClear = (): void => {
  const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
  expect(clear).toHaveAttribute('aria-disabled', 'false');
  clear.click();
};

describe('range Clear puts both tabs back on the aria-hidden placeholder', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each<[ClockType, string]>([
    ['24h', '09:00 - 17:00'],
    ['12h', '09:00 AM - 05:00 PM'],
  ])(
    'should show the placeholder, hidden from AT, on both tabs and name each tab by its label after Clear (%s)',
    (clockType, value) => {
      openRange(clockType, value);
      PARTS.forEach((part) => {
        expect(timeOf(part).textContent).not.toBe(PLACEHOLDER);
        expect(timeOf(part)).not.toHaveAttribute('aria-hidden', 'true');
      });

      clickClear();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(readTabs()).toEqual(
        PARTS.map((part) => ({ part, text: PLACEHOLDER, hidden: 'true', name: LABELS[part] })),
      );
    },
  );
});
