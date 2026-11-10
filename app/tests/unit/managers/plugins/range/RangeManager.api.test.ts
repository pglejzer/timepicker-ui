import { mountRangeManager, type RangeHarness } from './range-test-helpers';

const NINE = { hour: '09', minutes: '00' };
const FIVE_PM = { hour: '17', minutes: '00' };

const QUIET_EVENTS = ['select:hour', 'select:minute', 'select:am', 'select:pm', 'update'] as const;

const listenQuiet = (h: RangeHarness): string[] => {
  const heard: string[] = [];
  QUIET_EVENTS.forEach((event) => {
    h.emitter.on(event, () => {
      heard.push(event);
    });
  });
  return heard;
};

const switchesOf = (h: RangeHarness): unknown[] =>
  h.events.filter((entry) => entry.event === 'range:switch').map((entry) => entry.payload);

const openCore = (h: RangeHarness): void => {
  h.core.isOpen = true;
  h.core.getModalElement = () => h.modal;
  h.core.getHour = () => h.hour;
  h.core.getMinutes = () => h.minutes;
  h.core.getOkButton = () => h.okButton;
};

describe('RangeManager range API', () => {
  let harness: RangeHarness | null = null;

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  describe('setRange and getRange', () => {
    it('should round-trip a 12h range', () => {
      harness = mountRangeManager({ clockType: '12h' });

      expect(harness.manager.setRange('9:15 AM', '2:30 PM', true)).toBe(true);

      expect(harness.manager.getRange()).toEqual({
        from: { hour: '09', minutes: '15', type: 'AM' },
        to: { hour: '02', minutes: '30', type: 'PM' },
      });
    });

    it('should round-trip a 24h range', () => {
      harness = mountRangeManager({ clockType: '24h' });

      expect(harness.manager.setRange('09:00', '17:45', true)).toBe(true);

      expect(harness.manager.getRange()).toEqual({
        from: { hour: '09', minutes: '00' },
        to: { hour: '17', minutes: '45' },
      });
    });

    it('should round-trip a range with seconds', () => {
      harness = mountRangeManager({ clockType: '24h', showSeconds: true });

      expect(harness.manager.setRange('09:00:15', '17:45:30', true)).toBe(true);

      expect(harness.manager.getRange()).toEqual({
        from: { hour: '09', minutes: '00', seconds: '15' },
        to: { hour: '17', minutes: '45', seconds: '30' },
      });
    });

    it('should return null ends before anything is set', () => {
      harness = mountRangeManager();

      expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    });
  });

  describe('invalid times', () => {
    it.each([
      ['an unparsable from', 'nonsense', '17:00'],
      ['an unparsable to', '09:00', '25:99'],
    ])('should refuse %s and keep the range unchanged', (_label, from, to) => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('08:00', '10:00', true);
      const before = harness.manager.getRange();
      const inputBefore = harness.input.value;

      expect(harness.manager.setRange(from, to, true)).toBe(false);

      expect(harness.manager.getRange()).toEqual(before);
      expect(harness.input.value).toBe(inputBefore);
    });

    it('should refuse a half-valid pair without applying the valid end', () => {
      harness = mountRangeManager({ clockType: '24h' });

      harness.manager.setRange('09:00', 'nope', true);

      expect(harness.manager.getRange()).toEqual({ from: null, to: null });
    });
  });

  describe('one end at a time', () => {
    it('should keep To when only From is given and keep From when only To is given', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('08:00', '17:00', true);

      expect(harness.manager.setRange('09:00', undefined, true)).toBe(true);
      expect(harness.manager.getRange()).toEqual({ from: NINE, to: FIVE_PM });

      expect(harness.manager.setRange(undefined, '18:00', true)).toBe(true);
      expect(harness.manager.getRange()).toEqual({ from: NINE, to: { hour: '18', minutes: '00' } });
    });

    it('should clear To with null and keep From', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', true);

      expect(harness.manager.setRange(undefined, null, true)).toBe(true);

      expect(harness.manager.getRange()).toEqual({ from: NINE, to: null });
    });

    it.each([
      ['null', null],
      ['an empty string', ''],
    ])('should clear From with %s and keep To', (_label, from) => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('08:00', '10:00', true);

      expect(harness.manager.setRange(from, '17:00', true)).toBe(true);

      expect(harness.manager.getRange()).toEqual({ from: null, to: FIVE_PM });
      expect(harness.input.value).toBe('--:-- - 17:00');
    });

    it.each([
      ['neither end', undefined],
      ['an unparsable From', 'x'],
    ])('should refuse %s and change nothing', (_label, from) => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', true);
      harness.events.length = 0;

      expect(harness.manager.setRange(from, undefined, true)).toBe(false);

      expect(harness.manager.getRange()).toEqual({ from: NINE, to: FIVE_PM });
      expect(harness.input.value).toBe('09:00 - 17:00');
      expect(harness.events).toEqual([]);
    });

    it.each<[string, string | null, string | null, string]>([
      ['only From', '09:00', null, '09:00 - --:--'],
      ['only To', null, '17:00', '--:-- - 17:00'],
      ['no end', null, null, ''],
      ['both ends', '09:00', '17:00', '09:00 - 17:00'],
    ])('should write the input for %s', (_label, from, to, expected) => {
      harness = mountRangeManager({ clockType: '24h', inputValue: '08:00 - 10:00' });

      harness.manager.setRange(from, to, true);

      expect(harness.input.value).toBe(expected);
    });

    it('should go back to From with one range:switch when From is cleared while To is active (linked)', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      harness.manager.setActivePart('to', { focus: false });
      harness.events.length = 0;

      expect(harness.manager.setRange(null, undefined, true)).toBe(true);

      expect(harness.manager.getActivePart()).toBe('from');
      expect(harness.events).toEqual([
        { event: 'range:switch', payload: { active: 'from', disabledTime: null } },
      ]);
    });
  });

  describe('updateInput', () => {
    it('should write "from - to" to the input when updateInput is true', () => {
      harness = mountRangeManager({ clockType: '12h' });

      harness.manager.setRange('9:15 AM', '2:30 PM', true);

      expect(harness.input.value).toBe('09:15 AM - 02:30 PM');
    });

    it('should write seconds to the input with showSeconds', () => {
      harness = mountRangeManager({ clockType: '24h', showSeconds: true });

      harness.manager.setRange('09:00:15', '17:45:30', true);

      expect(harness.input.value).toBe('09:00:15 - 17:45:30');
    });

    it('should keep the input as is when updateInput is false', () => {
      harness = mountRangeManager({ clockType: '24h', inputValue: '08:00 - 10:00' });

      harness.manager.setRange('09:00', '17:00', false);

      expect(harness.input.value).toBe('08:00 - 10:00');
      expect(harness.manager.getRange()?.from).toEqual({ hour: '09', minutes: '00' });
    });

    it('should not emit range:confirm', () => {
      harness = mountRangeManager({ clockType: '24h' });

      harness.manager.setRange('09:00', '17:00', true);

      expect(harness.events.map((entry) => entry.event)).not.toContain('range:confirm');
    });
  });

  describe('while open', () => {
    it('should show the From time on the clock and the tabs after setRange', () => {
      harness = mountRangeManager({ clockType: '24h' });

      harness.manager.setRange('09:15', '17:45', true);

      expect(harness.hour.value).toBe('09');
      expect(harness.minutes.value).toBe('15');
      expect(harness.fromTime.textContent).toBe('09:15');
      expect(harness.toTime.textContent).toBe('17:45');
      expect(harness.toTab.getAttribute('aria-disabled')).toBe('false');
    });

    it('should not move focus', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.okButton.focus();

      harness.manager.setRange('09:15', '17:45', true);

      expect(document.activeElement).toBe(harness.okButton);
    });

    it('should sync the dial with select:hour and update when the shown end changes', () => {
      harness = mountRangeManager({ clockType: '24h' });
      const heard = listenQuiet(harness);

      harness.manager.setRange('09:15', '17:45', false);

      expect(heard).toEqual(['select:hour', 'update']);
      expect(harness.hour.value).toBe('09');
    });

    it('should leave the dial alone and re-send the limit when only the inactive From changes', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      harness.manager.setActivePart('to', { focus: false });
      harness.events.length = 0;
      const heard = listenQuiet(harness);

      expect(harness.manager.setRange('08:00', undefined, false)).toBe(true);

      expect(heard).toEqual([]);
      expect(harness.hour.value).toBe('17');
      expect(harness.fromTime.textContent).toBe('08:00');
      expect(switchesOf(harness)).toEqual([
        { active: 'to', disabledTime: expect.objectContaining({ fromHour: 8 }) },
      ]);
    });

    it('should show the --:-- placeholder and emit an empty update when the shown From is cleared', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:15', '17:45', false);
      const updates: unknown[] = [];
      harness.emitter.on('update', (payload) => {
        updates.push(payload);
      });

      expect(harness.manager.setRange(null, undefined, false)).toBe(true);

      expect(harness.fromTime.textContent).toBe('--:--');
      expect(harness.fromTime.getAttribute('aria-hidden')).toBe('true');
      expect(updates).toEqual([{ hour: undefined, minutes: undefined, type: undefined }]);
    });

    it('should show the --:-- placeholder and emit an empty update when switching to an empty To', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', undefined, false);
      const updates: unknown[] = [];
      harness.emitter.on('update', (payload) => {
        updates.push(payload);
      });

      harness.manager.setActivePart('to', { focus: false });

      expect(harness.manager.getToValue()).toBeNull();
      expect(harness.toTime.textContent).toBe('--:--');
      expect(harness.toTime.getAttribute('aria-hidden')).toBe('true');
      expect(updates).toEqual([{ hour: undefined, minutes: undefined, type: undefined }]);
    });

    it('should not show the wheel again when the shown end does not change', () => {
      const show = jest.fn();
      harness = mountRangeManager({ mode: 'compact-wheel', inputValue: '09:00 - 17:00', timeView: { show } });
      show.mockClear();

      harness.manager.setRange(undefined, '18:00', false);
      harness.manager.setRange('09:00', undefined, false);

      expect(show).not.toHaveBeenCalled();

      harness.manager.setRange('10:00', undefined, false);

      expect(show).toHaveBeenCalledTimes(1);
      expect(show).toHaveBeenCalledWith({ hour: '10', minutes: '00' });
    });
  });

  describe('set while closed, then opened', () => {
    it('should show From on the clock after the picker is opened (input is the source of truth)', () => {
      harness = mountRangeManager({ clockType: '24h', isOpen: false });

      harness.manager.setRange('09:15', '17:45', true);
      expect(harness.manager.getRange()).toEqual({
        from: { hour: '09', minutes: '15' },
        to: { hour: '17', minutes: '45' },
      });

      openCore(harness);
      harness.manager.init();

      expect(harness.manager.getActivePart()).toBe('from');
      expect(harness.hour.value).toBe('09');
      expect(harness.minutes.value).toBe('15');
      expect(harness.fromTime.textContent).toBe('09:15');
    });

    it('should open on a From set alone without writing the input', () => {
      harness = mountRangeManager({ clockType: '24h', isOpen: false });

      expect(harness.manager.setRange('09:00', undefined, false)).toBe(true);
      expect(harness.input.value).toBe('');

      openCore(harness);
      harness.manager.init();

      expect(harness.manager.getRange()).toEqual({ from: NINE, to: null });
      expect(harness.manager.getActivePart()).toBe('from');
      expect(harness.hour.value).toBe('09');
      expect(harness.fromTime.textContent).toBe('09:00');
      expect(harness.toTime.textContent).toBe('--:--');
    });
  });
});
