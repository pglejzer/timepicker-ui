import type { RangeChangeEventData } from '@/types/types';
import { mountRangeManager, type RangeHarness, type RangeHarnessConfig } from './range-test-helpers';

type RangeRead = ReturnType<RangeHarness['manager']['getRange']>;

interface ListenerRead {
  readonly payload: RangeChangeEventData;
  readonly inListener: RangeRead;
}

const NINE = { hour: '09', minutes: '00' };
const NINE_THIRTY = { hour: '09', minutes: '30' };
const TEN_FIFTEEN = { hour: '10', minutes: '15' };
const TEN_THIRTY = { hour: '10', minutes: '30' };
const FIVE_PM = { hour: '17', minutes: '00' };
const FIVE_FORTY_FIVE_PM = { hour: '17', minutes: '45' };

const eventNames = (h: RangeHarness): string[] => h.events.map((entry) => entry.event);

const readInListener = (h: RangeHarness): ListenerRead[] => {
  const reads: ListenerRead[] = [];
  h.emitter.on('range:change', (payload) => {
    reads.push({ payload, inListener: h.manager.getRange() });
  });
  return reads;
};

const expectFinalInListener = (reads: ListenerRead[]): void => {
  expect(reads.length).toBeGreaterThan(0);
  reads.forEach(({ payload, inListener }) => {
    expect(inListener).toEqual({ from: payload.from, to: payload.to });
  });
};

describe('RangeManager range:change', () => {
  const mounted: RangeHarness[] = [];

  const mount = (config: RangeHarnessConfig = {}): RangeHarness => {
    const harness = mountRangeManager(config);
    mounted.push(harness);
    return harness;
  };

  const mountWithToActive = (config: RangeHarnessConfig = {}): RangeHarness => {
    const harness = mount(config);
    harness.manager.setRange('09:00', undefined, false);
    harness.manager.setActivePart('to', { focus: false });
    harness.events.length = 0;
    return harness;
  };

  afterEach(() => {
    mounted.splice(0).forEach((harness) => harness.manager.destroy());
    document.body.innerHTML = '';
  });

  describe('dial commits', () => {
    it('emits range:change before range:switch when the From minute is committed, then once for To', () => {
      const harness = mount({ clockType: '24h' });
      const reads = readInListener(harness);

      harness.commit('09', '30');

      const order = eventNames(harness);
      expect(order.indexOf('range:change')).toBeLessThan(order.indexOf('range:switch'));
      expect(harness.changes()).toEqual([{ part: 'from', from: NINE_THIRTY, to: null }]);
      expect(reads[0].inListener).toEqual({ from: NINE_THIRTY, to: null });

      harness.commit('17', '00');

      expect(harness.changes()).toEqual([
        { part: 'from', from: NINE_THIRTY, to: null },
        { part: 'to', from: NINE_THIRTY, to: FIVE_PM },
      ]);
      expectFinalInListener(reads);
    });

    it('fires nothing for a 12h minute commit without AM/PM and fires once when AM completes From', () => {
      const harness = mount({ clockType: '12h' });
      const reads = readInListener(harness);

      harness.commit('09', '30');

      expect(harness.changes()).toEqual([]);
      expect(harness.manager.getRange().from).toBeNull();

      harness.core.getActiveType = () => 'AM';
      harness.emitter.emit('select:am', {});

      const nineThirtyAm = { ...NINE_THIRTY, type: 'AM' };
      expect(harness.changes()).toEqual([{ part: 'from', from: nineThirtyAm, to: null }]);
      const order = eventNames(harness);
      expect(order.indexOf('range:change')).toBeLessThan(order.indexOf('range:switch'));
      expect(harness.events.find((entry) => entry.event === 'range:switch')?.payload).toEqual(
        expect.objectContaining({ active: 'to' }),
      );
      expectFinalInListener(reads);
    });

    it('fires one From change with the new period for AM -> PM on a complete From, without range:switch', () => {
      const harness = mount({ clockType: '12h' });
      harness.manager.setRange('09:30 AM', undefined, false);
      harness.events.length = 0;
      const reads = readInListener(harness);

      harness.core.getActiveType = () => 'PM';
      harness.emitter.emit('select:pm', {});

      expect(harness.changes()).toEqual([{ part: 'from', from: { ...NINE_THIRTY, type: 'PM' }, to: null }]);
      expect(eventNames(harness)).not.toContain('range:switch');
      expect(harness.manager.getActivePart()).toBe('from');
      expectFinalInListener(reads);
    });
  });

  describe('wheel updates', () => {
    it('fires once for a new complete From and not for the same value again', () => {
      const harness = mount({ mode: 'compact-wheel' });
      const reads = readInListener(harness);

      harness.emitter.emit('update', { hour: '10', minutes: '30' });
      harness.emitter.emit('update', { hour: '10', minutes: '30' });

      expect(harness.changes()).toEqual([{ part: 'from', from: TEN_THIRTY, to: null }]);
      expectFinalInListener(reads);
    });

    it('fires once for a new complete To while To is active', () => {
      const harness = mount({ mode: 'compact-wheel', linked: false, inputValue: '09:00 - 17:00' });
      harness.manager.setActivePart('to', { focus: false });
      expect(harness.changes()).toEqual([]);

      harness.emitter.emit('update', { hour: '18', minutes: '00' });
      harness.emitter.emit('update', { hour: '18', minutes: '00' });

      expect(harness.changes()).toEqual([{ part: 'to', from: NINE, to: { hour: '18', minutes: '00' } }]);
    });
  });

  describe('typed times, OK and Clear', () => {
    it('fires one To change for a typed To committed by input:commit', () => {
      const harness = mountWithToActive();
      const reads = readInListener(harness);

      harness.typeInto(harness.hour, '17', 'hour');
      expect(harness.changes()).toEqual([]);
      harness.typeInto(harness.minutes, '45', 'minutes');

      expect(harness.changes()).toEqual([{ part: 'to', from: NINE, to: FIVE_FORTY_FIVE_PM }]);
      expectFinalInListener(reads);
    });

    it('fires one change for the active end before range:confirm when OK commits a complete preview', () => {
      const harness = mountWithToActive();
      const reads = readInListener(harness);
      harness.typePreview('17', '45');
      expect(harness.changes()).toEqual([]);

      harness.emitter.emit('confirm', {});

      const order = eventNames(harness);
      expect(harness.changes()).toEqual([{ part: 'to', from: NINE, to: FIVE_FORTY_FIVE_PM }]);
      expect(order.indexOf('range:change')).toBeLessThan(order.indexOf('range:confirm'));
      expectFinalInListener(reads);
    });

    it('fires nothing when OK confirms without a preview', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });

      harness.emitter.emit('confirm', {});

      expect(eventNames(harness)).toContain('range:confirm');
      expect(harness.changes()).toEqual([]);
    });

    it('fires exactly one cleared From change before range:switch to From on Clear', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });
      const reads = readInListener(harness);

      harness.emitter.emit('clear', { previousValue: '09:00 - 17:00' });

      expect(harness.events).toEqual([
        { event: 'range:change', payload: { part: 'from', from: null, to: null } },
        { event: 'range:switch', payload: { active: 'from', disabledTime: null } },
      ]);
      expect(reads).toHaveLength(1);
      expect(reads[0].inListener).toEqual({ from: null, to: null });
    });
  });

  describe('stays silent', () => {
    it('for init with an input value', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });

      expect(harness.manager.getRange()).toEqual({ from: NINE, to: FIVE_PM });
      expect(harness.changes()).toEqual([]);
    });

    it('for setActivePart({ focus: false }) without a preview and for setRange', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });

      harness.manager.setActivePart('to', { focus: false });
      harness.manager.setRange('10:00', '18:00', false);
      harness.manager.setRange(null, undefined, false);

      expect(harness.manager.getRange()).toEqual({ from: null, to: { hour: '18', minutes: '00' } });
      expect(harness.changes()).toEqual([]);
    });

    it('for Clear while core.isApiChange is set', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });
      harness.core.isApiChange = true;

      harness.emitter.emit('clear', { previousValue: '09:00 - 17:00' });

      expect(harness.manager.getRange()).toEqual({ from: null, to: null });
      expect(eventNames(harness)).toEqual(['range:switch']);
      expect(harness.changes()).toEqual([]);
    });

    it('for the wheel D1 seed while core.isApiChange is set', () => {
      const harness = mount({ mode: 'wheel', inputValue: '09:00 - --:--' });
      harness.core.isApiChange = true;

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(true);

      expect(harness.manager.getRange().to).toEqual(NINE);
      expect(harness.changes()).toEqual([]);
    });

    it('for the wheel D1 seed after a user click on the To tab, which still follows range:switch', () => {
      const harness = mount({ mode: 'wheel', inputValue: '09:00 - --:--' });
      const toInSwitch: RangeRead['to'][] = [];
      harness.emitter.on('range:switch', () => {
        toInSwitch.push(harness.manager.getRange().to);
      });

      harness.toTab.click();

      expect(toInSwitch).toEqual([null]);
      expect(harness.manager.getRange().to).toEqual(NINE);
      expect(harness.changes()).toEqual([]);
    });

    it('for a keep-view re-render without a preview', () => {
      const harness = mount({ inputValue: '09:00 - 17:00' });

      harness.core.isRerendering = true;
      harness.manager.init();
      harness.core.isRerendering = false;

      expect(harness.manager.getRange()).toEqual({ from: NINE, to: FIVE_PM });
      expect(harness.changes()).toEqual([]);
    });
  });

  it('fires for a typed preview that setActivePart commits while core.isApiChange is set (the user typed it)', () => {
    const harness = mount({ inputValue: '09:00 - 17:00' });
    harness.typePreview('10', '15');
    harness.core.isApiChange = true;

    harness.manager.setActivePart('to', { focus: false });

    const order = eventNames(harness);
    expect(harness.changes()).toEqual([{ part: 'from', from: TEN_FIFTEEN, to: FIVE_PM }]);
    expect(order.indexOf('range:change')).toBeLessThan(order.indexOf('range:switch'));
    expect(harness.manager.getActivePart()).toBe('to');
  });
});
