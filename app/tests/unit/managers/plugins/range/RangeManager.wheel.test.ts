import type { PluginSelection } from '@/core/PluginRegistry';
import { mountRangeManager, type RangeHarness, type RangeHarnessConfig } from './range-test-helpers';

type WheelMode = 'wheel' | 'compact-wheel';

const QUIET_EVENTS = ['update', 'select:hour', 'select:minute', 'select:am', 'select:pm'] as const;

const SWITCH_TO = { event: 'range:switch', payload: { active: 'to', disabledTime: null } };
const SWITCH_FROM = { event: 'range:switch', payload: { active: 'from', disabledTime: null } };
const CLEARED = { event: 'range:change', payload: { part: 'from', from: null, to: null } };

const switchToWithLimit = (fromHour: number): RangeHarness['events'][number] => ({
  event: 'range:switch',
  payload: { active: 'to', disabledTime: expect.objectContaining({ fromHour }) },
});

interface WheelHarness extends RangeHarness {
  readonly shown: PluginSelection[];
  readonly quiet: string[];
}

const mountWheelRange = (mode: WheelMode, config: RangeHarnessConfig = {}): WheelHarness => {
  const shown: PluginSelection[] = [];
  const timeView = {
    show: (value: PluginSelection): void => {
      shown.push({ ...value });
    },
  };
  const harness = mountRangeManager({ ...config, mode, timeView });
  const quiet: string[] = [];
  QUIET_EVENTS.forEach((event) => {
    harness.emitter.on(event, () => {
      quiet.push(event);
    });
  });
  return { ...harness, shown, quiet };
};

const named = (h: RangeHarness, event: string): RangeHarness['events'] =>
  h.events.filter((entry) => entry.event === event);

const payloadsOf = (h: RangeHarness, event: string): unknown[] =>
  named(h, event).map((entry) => entry.payload);

const reset = (h: WheelHarness): void => {
  h.events.length = 0;
  h.quiet.length = 0;
  h.shown.length = 0;
};

const key = (el: HTMLElement, k: string): void => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe.each(['wheel', 'compact-wheel'] as const)('range plugin in %s mode', (mode) => {
  it('1: runs init and shows the seeded From through the port handed over before it', () => {
    const h = mountWheelRange(mode);

    expect(h.shown).toEqual([{ hour: '12', minutes: '00' }]);
    expect(h.events).toEqual([]);
    expect(h.fromTab.getAttribute('aria-selected')).toBe('true');
    expect(h.fromTime.textContent).toBe('12:00');
    expect(h.hour.value).toBe('12');
    expect(h.minutes.value).toBe('00');
  });

  it('2: a To tab click emits one range:switch, shows To quietly and leaves focus on the tab', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    reset(h);
    h.toTab.focus();

    h.toTab.click();

    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.quiet).toEqual([]);
    expect(h.shown).toEqual([{ hour: '17', minutes: '00' }]);
    expect(h.toTab.getAttribute('aria-selected')).toBe('true');
    expect(h.hour.value).toBe('17');
    expect(document.activeElement).toBe(h.toTab);

    h.toTab.click();

    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.shown).toHaveLength(1);
  });

  it('2: with linked, the range:switch for To carries the before-From limit', () => {
    const h = mountWheelRange(mode, { inputValue: '09:00 - 17:00' });
    reset(h);

    h.toTab.click();

    expect(payloadsOf(h, 'range:switch')).toEqual([
      { active: 'to', disabledTime: expect.objectContaining({ fromHour: 9, minutes: [] }) },
    ]);
    expect(h.quiet).toEqual([]);
  });

  it('3: after Clear with linked, a To tab click does nothing', () => {
    const h = mountWheelRange(mode, { inputValue: '09:00 - 17:00' });
    h.emitter.emit('clear', { previousValue: '09:00 - 17:00' });
    reset(h);

    h.toTab.click();

    expect(h.events).toEqual([]);
    expect(h.shown).toEqual([]);
    expect(h.manager.getActivePart()).toBe('from');
    expect(h.toTab.getAttribute('aria-disabled')).toBe('true');
  });

  it('4: the tabs keep Enter, Space, arrows, Home and End', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    h.fromTab.focus();

    key(h.fromTab, 'ArrowRight');
    expect(document.activeElement).toBe(h.toTab);

    key(h.toTab, 'Enter');
    expect(h.manager.getActivePart()).toBe('to');

    key(h.toTab, 'Home');
    expect(document.activeElement).toBe(h.fromTab);

    key(h.fromTab, ' ');
    expect(h.manager.getActivePart()).toBe('from');

    key(h.fromTab, 'End');
    expect(document.activeElement).toBe(h.toTab);

    key(h.toTab, 'ArrowLeft');
    expect(document.activeElement).toBe(h.fromTab);
  });

  it('5: setActivePart on an open picker switches once, quietly, without moving focus', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    reset(h);
    h.fromTab.focus();

    expect(h.manager.setActivePart('to', { focus: false })).toBe(true);
    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.shown).toEqual([{ hour: '17', minutes: '00' }]);
    expect(h.quiet).toEqual([]);
    expect(document.activeElement).toBe(h.fromTab);

    expect(h.manager.setActivePart('to', { focus: false })).toBe(true);
    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.shown).toHaveLength(1);

    const linked = mountWheelRange(mode);
    linked.emitter.emit('clear', { previousValue: null });
    reset(linked);

    expect(linked.manager.setActivePart('to', { focus: false })).toBe(false);
    expect(linked.events).toEqual([]);
    expect(linked.shown).toEqual([]);
  });

  it('7: an update with From active fills From only and reports it with range:change', () => {
    const h = mountWheelRange(mode, { linked: false });
    reset(h);

    h.emitter.emit('update', { hour: '10', minutes: '30' });

    expect(h.manager.getRange()).toEqual({ from: { hour: '10', minutes: '30' }, to: null });
    expect(h.fromTime.textContent).toBe('10:30');
    expect(h.manager.getActivePart()).toBe('from');
    expect(h.events).toEqual([
      { event: 'range:change', payload: { part: 'from', from: { hour: '10', minutes: '30' }, to: null } },
    ]);
  });

  it('7: an incomplete update (Clear empties the header) is ignored', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    reset(h);

    h.emitter.emit('update', { hour: '', minutes: '00' });

    expect(h.manager.getRange().from).toEqual({ hour: '09', minutes: '00' });
    expect(h.events).toEqual([]);
  });

  it('8: an update with To active validates against min/max duration, and OK follows canConfirm', () => {
    const h = mountWheelRange(mode, { minDuration: 60, maxDuration: 180, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.emitter.emit('update', { hour: '09', minutes: '30' });
    expect(h.okButton.getAttribute('aria-disabled')).toBe('true');

    h.emitter.emit('update', { hour: '11', minutes: '00' });
    expect(h.okButton.getAttribute('aria-disabled')).toBe('false');

    h.emitter.emit('update', { hour: '13', minutes: '00' });
    expect(h.okButton.getAttribute('aria-disabled')).toBe('true');

    expect(payloadsOf(h, 'range:validation')).toEqual([
      expect.objectContaining({ valid: false, duration: 30 }),
      expect.objectContaining({ valid: true, duration: 120 }),
      expect.objectContaining({ valid: false, duration: 240 }),
    ]);
    expect(h.manager.getRange().to).toEqual({ hour: '13', minutes: '00' });
    expect(named(h, 'range:switch')).toEqual([]);
  });

  it('8: with linked: false the duration limits do not apply', () => {
    const h = mountWheelRange(mode, { linked: false, minDuration: 60, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.emitter.emit('update', { hour: '09', minutes: '30' });

    expect(payloadsOf(h, 'range:validation')).toEqual([
      expect.objectContaining({ valid: true, duration: 30 }),
    ]);
    expect(h.okButton.getAttribute('aria-disabled')).toBe('false');
  });

  it('9: AM / PM does not auto-advance; the update sets the period', () => {
    const h = mountWheelRange(mode, { clockType: '12h' });
    h.core.getActiveType = () => 'PM';
    h.emitter.emit('update', { hour: '09', minutes: '00', type: 'AM' });
    reset(h);

    h.emitter.emit('select:pm', {});

    expect(h.manager.getActivePart()).toBe('from');
    expect(h.manager.getRange().from).toEqual({ hour: '09', minutes: '00', type: 'AM' });
    expect(h.events).toEqual([]);

    h.emitter.emit('update', { hour: '09', minutes: '00', type: 'PM' });

    expect(h.manager.getRange().from).toEqual({ hour: '09', minutes: '00', type: 'PM' });
    expect(h.fromTime.textContent).toBe('09:00 PM');
    expect(h.manager.getActivePart()).toBe('from');
  });

  it('10: seconds are stored and shown', () => {
    const h = mountWheelRange(mode, { showSeconds: true });
    expect(h.shown).toEqual([{ hour: '12', minutes: '00', seconds: '00' }]);

    h.emitter.emit('update', { hour: '10', minutes: '30', seconds: '15' });

    expect(h.manager.getRange().from).toEqual({ hour: '10', minutes: '30', seconds: '15' });
    expect(h.fromTime.textContent).toBe('10:30:15');
  });

  it('11: setRange on an open picker validates and shows the active end quietly', () => {
    const h = mountWheelRange(mode, { linked: false });
    reset(h);

    expect(h.manager.setRange('08:00', '12:00', false)).toBe(true);

    expect(h.events.map((entry) => entry.event)).toEqual(['range:validation']);
    expect(h.quiet).toEqual([]);
    expect(h.shown).toEqual([{ hour: '08', minutes: '00' }]);
    expect(h.hour.value).toBe('08');
  });

  it('11: setRange with To active and linked emits range:switch for the new limit first', () => {
    const h = mountWheelRange(mode, { inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.manager.setRange('10:00', '18:00', false);

    expect(h.events.map((entry) => entry.event)).toEqual(['range:switch', 'range:validation']);
    expect(payloadsOf(h, 'range:switch')).toEqual([
      { active: 'to', disabledTime: expect.objectContaining({ fromHour: 10 }) },
    ]);
    expect(h.quiet).toEqual([]);
    expect(h.shown).toEqual([{ hour: '18', minutes: '00' }]);
  });

  it('12: OK writes the range and emits range:confirm', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    h.emitter.emit('update', { hour: '10', minutes: '00' });

    h.emitter.emit('confirm', {});

    expect(payloadsOf(h, 'range:confirm')).toEqual([{ from: '10:00', to: '17:00', duration: 420 }]);
    expect(h.input.value).toBe('10:00 - 17:00');
  });

  it('12: OK does nothing while canConfirm is false (incomplete or too short)', () => {
    const incomplete = mountWheelRange(mode);
    incomplete.emitter.emit('confirm', {});
    expect(named(incomplete, 'range:confirm')).toEqual([]);
    expect(incomplete.input.value).toBe('');

    const tooShort = mountWheelRange(mode, { minDuration: 600, inputValue: '09:00 - 10:00' });
    tooShort.emitter.emit('update', { hour: '09', minutes: '30' });
    tooShort.emitter.emit('confirm', {});
    expect(named(tooShort, 'range:confirm')).toEqual([]);
    expect(tooShort.input.value).toBe('09:00 - 10:00');
  });

  it('12: an auto-commit confirm passes autoCommit on to range:confirm', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });

    h.emitter.emit('confirm', { autoCommit: true });

    expect(payloadsOf(h, 'range:confirm')).toEqual([
      { from: '09:00', to: '17:00', duration: 480, autoCommit: true },
    ]);
  });

  it('13: Clear empties both ends, focuses the From tab and does not seed', () => {
    const h = mountWheelRange(mode, { inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.emitter.emit('clear', { previousValue: '09:00 - 17:00' });

    expect(h.events).toEqual([CLEARED, SWITCH_FROM]);
    expect(h.manager.getRange()).toEqual({ from: null, to: null });
    expect(document.activeElement).toBe(h.fromTab);
    expect(h.shown).toEqual([]);
    expect(h.quiet).toEqual([]);
    expect(h.fromTime.textContent).toBe('--:--');
    expect(h.toTime.textContent).toBe('--:--');
  });

  it('14: D1 seeds an empty From from the other end, then clock.currentTime, then the neutral time', () => {
    const currentTime = { time: new Date(2026, 0, 1, 8, 15) };

    const fromOther = mountWheelRange(mode, { linked: false, inputValue: 'x - 17:00', currentTime });
    expect(fromOther.manager.getRange().from).toEqual({ hour: '17', minutes: '00' });
    expect(fromOther.shown).toEqual([{ hour: '17', minutes: '00' }]);
    expect(fromOther.events).toEqual([]);

    const fromCurrent = mountWheelRange(mode, { currentTime });
    expect(fromCurrent.manager.getRange().from).toEqual({ hour: '08', minutes: '15' });

    const evening = { time: new Date(2026, 0, 1, 20, 15) };
    const fromCurrent12h = mountWheelRange(mode, { clockType: '12h', currentTime: evening });
    expect(fromCurrent12h.manager.getRange().from).toEqual({ hour: '08', minutes: '15', type: 'PM' });

    const neutral24h = mountWheelRange(mode);
    expect(neutral24h.manager.getRange().from).toEqual({ hour: '12', minutes: '00' });

    const neutral12h = mountWheelRange(mode, { clockType: '12h' });
    expect(neutral12h.manager.getRange().from).toEqual({ hour: '12', minutes: '00', type: 'PM' });
    expect(neutral12h.shown).toEqual([{ hour: '12', minutes: '00', type: 'PM' }]);
  });

  it('14: D1 seeds an empty To from From on a switch, without range:validation or range:change', () => {
    const unlinked = mountWheelRange(mode, { linked: false, inputValue: '09:00 - x' });
    reset(unlinked);

    unlinked.toTab.click();

    expect(unlinked.manager.getRange().to).toEqual({ hour: '09', minutes: '00' });
    expect(unlinked.shown).toEqual([{ hour: '09', minutes: '00' }]);
    expect(named(unlinked, 'range:validation')).toEqual([]);
    expect(named(unlinked, 'range:change')).toEqual([]);
    expect(unlinked.manager.canConfirm()).toBe(true);

    const linked = mountWheelRange(mode, { inputValue: '09:00 - x' });
    linked.toTab.click();

    expect(linked.manager.getRange().to).toEqual({ hour: '09', minutes: '00' });
    expect(linked.manager.canConfirm()).toBe(false);
    expect(linked.okButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('15: D4 keeps To over a re-render and shows it again', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('to');
    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.shown).toEqual([{ hour: '17', minutes: '00' }]);
    expect(h.toTab.getAttribute('aria-selected')).toBe('true');
  });

  it('15: N1 keeps the seeded From over a re-render, so the carried To stays with the before-From limit', () => {
    const h = mountWheelRange(mode);
    h.toTab.click();
    expect(h.manager.getActivePart()).toBe('to');
    reset(h);

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('to');
    expect(h.events).toEqual([switchToWithLimit(12)]);
    expect(h.shown).toEqual([{ hour: '12', minutes: '00' }]);
  });

  it('15: D4 falls back to From when From is empty at a re-render that turns linked on', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    h.manager.setRange(null, undefined, false);
    expect(h.manager.getActivePart()).toBe('to');
    expect(h.manager.getRange()).toEqual({ from: null, to: { hour: '17', minutes: '00' } });
    h.options.range.linked = true;
    reset(h);

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('from');
    expect(h.events).toEqual([SWITCH_FROM]);
    expect(h.fromTab.getAttribute('aria-selected')).toBe('true');
  });

  it('15: a plain open starts on From', () => {
    const h = mountWheelRange(mode, { linked: false, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    reset(h);

    h.manager.init();

    expect(h.manager.getActivePart()).toBe('from');
    expect(h.events).toEqual([]);
    expect(h.shown).toEqual([{ hour: '09', minutes: '00' }]);
  });
});

describe('range plugin in clock mode', () => {
  it('15: D4 keeps To over a re-render', () => {
    const h = mountRangeManager({ mode: 'clock', linked: false, inputValue: '09:00 - 17:00' });
    h.toTab.click();
    h.events.length = 0;

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('to');
    expect(h.events).toEqual([SWITCH_TO]);
    expect(h.hour.value).toBe('17');
  });

  it('15: N1 keeps From over a re-render, so the carried To stays with the before-From limit', () => {
    const h = mountRangeManager({ mode: 'clock' });
    h.commit('09', '00');
    expect(h.manager.getActivePart()).toBe('to');
    h.events.length = 0;

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('to');
    expect(h.events).toEqual([switchToWithLimit(9)]);
    expect(h.manager.getRange()).toEqual({ from: { hour: '09', minutes: '00' }, to: null });
  });

  it('15: D4 falls back to From when From is empty at a re-render that turns linked on', () => {
    const h = mountRangeManager({ mode: 'clock', linked: false });
    h.toTab.click();
    expect(h.manager.getActivePart()).toBe('to');
    h.options.range.linked = true;
    h.events.length = 0;

    h.core.isRerendering = true;
    h.manager.init();

    expect(h.manager.getActivePart()).toBe('from');
    expect(h.events).toEqual([SWITCH_FROM]);
  });

  it('does not use the time view and keeps driving the clock with update', () => {
    const shown: PluginSelection[] = [];
    const h = mountRangeManager({
      mode: 'clock',
      linked: false,
      inputValue: '09:00 - 17:00',
      timeView: {
        show: (value) => {
          shown.push(value);
        },
      },
    });
    const onUpdate = jest.fn();
    h.emitter.on('update', onUpdate);

    h.toTab.click();
    h.manager.setRange('10:00', '18:00', false);

    expect(shown).toEqual([]);
    expect(onUpdate).toHaveBeenCalled();
    expect(h.hour.value).toBe('18');
  });
});
