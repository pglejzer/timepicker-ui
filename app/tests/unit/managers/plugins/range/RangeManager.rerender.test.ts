import type { PluginSelection } from '@/core/PluginRegistry';
import { mountRangeManager, type RangeHarness, type RangeHarnessConfig } from './range-test-helpers';

const NINE = { hour: '09', minutes: '00' };
const TEN = { hour: '10', minutes: '00' };
const TEN_FIFTEEN = { hour: '10', minutes: '15' };
const EIGHT = { hour: '08', minutes: '00' };
const FIVE_PM = { hour: '17', minutes: '00' };
const FIVE_THIRTY_PM = { hour: '17', minutes: '30' };

const rerender = (harness: RangeHarness): void => {
  harness.core.isRerendering = true;
  harness.manager.init();
  harness.core.isRerendering = false;
};

describe('RangeManager keeps the range over a keep-view re-render (N1)', () => {
  const mounted: RangeHarness[] = [];

  const mount = (config: RangeHarnessConfig = {}): RangeHarness => {
    const harness = mountRangeManager(config);
    mounted.push(harness);
    return harness;
  };

  afterEach(() => {
    mounted.splice(0).forEach((harness) => harness.manager.destroy());
    document.body.innerHTML = '';
  });

  it('keeps both ends and To over a keep-view re-render', () => {
    const harness = mount({ clockType: '24h' });
    harness.commit('09', '00');
    harness.commit('17', '30');
    const before = harness.manager.getRange();

    rerender(harness);

    expect(before).toEqual({ from: NINE, to: FIVE_THIRTY_PM });
    expect(harness.manager.getRange()).toEqual(before);
    expect(harness.manager.getActivePart()).toBe('to');
    expect(harness.changes()).toHaveLength(2);
    expect(harness.hour.value).toBe('17');
    expect(harness.toTab.getAttribute('aria-selected')).toBe('true');
  });

  it.each(['wheel', 'compact-wheel'] as const)(
    'keeps both ends and To over a keep-view re-render in %s mode and shows To again',
    (mode) => {
      const shown: PluginSelection[] = [];
      const harness = mount({
        mode,
        timeView: {
          show: (value) => {
            shown.push({ ...value });
          },
        },
      });
      harness.emitter.emit('update', { hour: '09', minutes: '00' });
      harness.toTab.click();
      harness.emitter.emit('update', { hour: '17', minutes: '30' });
      const before = harness.manager.getRange();
      const changesBefore = harness.changes().length;
      shown.length = 0;

      rerender(harness);

      expect(before).toEqual({ from: NINE, to: FIVE_THIRTY_PM });
      expect(harness.manager.getRange()).toEqual(before);
      expect(harness.manager.getActivePart()).toBe('to');
      expect(harness.changes()).toHaveLength(changesBefore);
      expect(shown).toEqual([FIVE_THIRTY_PM]);
    },
  );

  it('converts both ends when clock.type changes from 24h to 12h', () => {
    const harness = mount({ clockType: '24h' });
    harness.commit('09', '00');
    harness.commit('17', '30');
    harness.options.clock.type = '12h';

    rerender(harness);

    expect(harness.manager.getRange()).toEqual({
      from: { ...NINE, type: 'AM' },
      to: { hour: '05', minutes: '30', type: 'PM' },
    });
    expect(harness.toTime.textContent).toBe('05:30 PM');
    expect(harness.manager.getActivePart()).toBe('to');
  });

  it('adds seconds "00" to both ends when showSeconds is turned on', () => {
    const harness = mount({ clockType: '24h' });
    harness.commit('09', '00');
    harness.commit('17', '30');
    harness.options.clock.showSeconds = true;

    rerender(harness);

    expect(harness.manager.getRange()).toEqual({
      from: { ...NINE, seconds: '00' },
      to: { ...FIVE_THIRTY_PM, seconds: '00' },
    });
    expect(harness.toTime.textContent).toBe('17:30:00');
  });

  it('drops an end that is incomplete when the clock format changes', () => {
    const harness = mount({ clockType: '12h' });
    harness.commit('09', '30');
    expect(harness.manager.getFromValue()).toEqual({ hour: '09', minutes: '30' });
    harness.options.clock.type = '24h';

    rerender(harness);

    expect(harness.manager.getFromValue()).toBeNull();
    expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    expect(harness.fromTime.textContent).toBe('--:--');
  });

  it('reads the input again without isRerendering (plain open or inline Cancel)', () => {
    const harness = mount({ clockType: '24h', inputValue: '08:00 - 10:00' });
    harness.commit('09', '00');
    harness.commit('17', '30');
    expect(harness.manager.getRange()).toEqual({ from: NINE, to: FIVE_THIRTY_PM });

    harness.manager.init();

    expect(harness.manager.getRange()).toEqual({ from: EIGHT, to: TEN });
    expect(harness.manager.getActivePart()).toBe('from');
  });

  it('commits a complete typed preview present at the re-render and fires one range:change', () => {
    const harness = mount({ clockType: '24h', inputValue: '09:00 - 17:00' });
    harness.typePreview('10', '15');
    expect(harness.changes()).toEqual([]);

    rerender(harness);

    expect(harness.manager.getRange()).toEqual({ from: TEN_FIFTEEN, to: FIVE_PM });
    expect(harness.changes()).toEqual([{ part: 'from', from: TEN_FIFTEEN, to: FIVE_PM }]);
    expect(harness.fromTime.textContent).toBe('10:15');
  });
});
