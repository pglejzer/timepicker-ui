import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { accessibleName, mountRangeManager, type RangeHarness } from './range-test-helpers';

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

describe('RangeManager on the clear event', () => {
  const RANGE = '09:00 - 17:00';
  let harness: RangeHarness | null = null;

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  it('should write an empty input, not "--:-- - --:--", the next time it writes the input after Clear', () => {
    harness = mountRangeManager({ inputValue: RANGE });

    harness.emitter.emit('clear', { previousValue: RANGE });
    expect(harness.manager.setRange(undefined, null, true)).toBe(true);

    expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    expect(harness.input.value).toBe('');
  });

  it('should reset and switch to From without moving focus or range:change while core.isApiChange is set', () => {
    harness = mountRangeManager({ inputValue: RANGE });
    harness.toTab.click();
    harness.okButton.focus();
    harness.events.length = 0;
    harness.core.isApiChange = true;

    harness.emitter.emit('clear', { previousValue: RANGE });

    expect(document.activeElement).toBe(harness.okButton);
    expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    expect(harness.manager.getActivePart()).toBe('from');
    expect(harness.events).toEqual([
      { event: 'range:switch', payload: { active: 'from', disabledTime: null } },
    ]);
    expect(harness.fromTime.textContent).toBe(PLACEHOLDER);
  });

  it('should only reset while the picker is closed', () => {
    harness = mountRangeManager({ inputValue: RANGE });
    harness.toTab.click();
    expect(harness.manager.getActivePart()).toBe('to');
    harness.okButton.focus();
    harness.core.isOpen = false;
    harness.events.length = 0;

    harness.emitter.emit('clear', { previousValue: RANGE });

    expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    expect(harness.manager.getActivePart()).toBe('from');
    expect(harness.events).toEqual([]);
    expect(document.activeElement).toBe(harness.okButton);
  });
});
