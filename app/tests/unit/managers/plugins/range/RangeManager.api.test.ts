import { mountRangeManager, type RangeHarness } from './range-test-helpers';

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
      ['an empty from', '', '17:00'],
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
  });

  describe('set while closed, then opened', () => {
    it('should show From on the clock after the picker is opened (input is the source of truth)', () => {
      harness = mountRangeManager({ clockType: '24h', isOpen: false });

      harness.manager.setRange('09:15', '17:45', true);
      expect(harness.manager.getRange()).toEqual({
        from: { hour: '09', minutes: '15' },
        to: { hour: '17', minutes: '45' },
      });

      (harness.core as { isOpen: boolean }).isOpen = true;
      (harness.core as { getModalElement: () => HTMLElement }).getModalElement = () => harness!.modal;
      (harness.core as { getHour: () => HTMLInputElement }).getHour = () => harness!.hour;
      (harness.core as { getMinutes: () => HTMLInputElement }).getMinutes = () => harness!.minutes;
      (harness.core as { getOkButton: () => HTMLElement }).getOkButton = () => harness!.okButton;
      harness.manager.init();

      expect(harness.manager.getActivePart()).toBe('from');
      expect(harness.hour.value).toBe('09');
      expect(harness.minutes.value).toBe('15');
      expect(harness.fromTime.textContent).toBe('09:15');
    });
  });
});
