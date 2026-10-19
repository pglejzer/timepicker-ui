import { mountRangeManager, type RangeHarness } from './range-test-helpers';

describe('range.linked', () => {
  let harness: RangeHarness | null = null;

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  const lastValidation = (h: RangeHarness): Record<string, unknown> | undefined => {
    const entries = h.events.filter((entry) => entry.event === 'range:validation');
    return entries[entries.length - 1]?.payload as Record<string, unknown> | undefined;
  };

  const isToTabEnabled = (h: RangeHarness): boolean =>
    h.toTab.getAttribute('aria-disabled') === 'false' && !h.toTab.classList.contains('disabled');

  describe('end-part disabled time', () => {
    it('should be null with linked: false once From is set and "to" is active', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });
      harness.commit('09', '30');

      expect(harness.manager.getActivePart()).toBe('to');
      expect(harness.manager.getDisabledTimeForEndPart()).toBeNull();
    });

    it('should block earlier times with linked: true (today behaviour)', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });
      harness.commit('09', '30');

      const disabled = harness.manager.getDisabledTimeForEndPart();
      expect(disabled).not.toBeNull();
      expect(disabled?.hours).toEqual(['00', '01', '02', '03', '04', '05', '06', '07', '08']);
    });

    it('should block earlier times when linked is unset', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.commit('09', '30');

      expect(harness.manager.getDisabledTimeForEndPart()).not.toBeNull();
    });

    it('should report no disabled time in range:switch with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });
      harness.commit('09', '30');

      const switchEvent = harness.events.find((entry) => entry.event === 'range:switch');
      expect(switchEvent?.payload).toEqual({ active: 'to', disabledTime: null });
    });
  });

  describe('To tab', () => {
    it('should be enabled at once with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });

      expect(isToTabEnabled(harness)).toBe(true);
    });

    it('should be disabled until From is complete with linked: true', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });

      expect(isToTabEnabled(harness)).toBe(false);

      harness.commit('09', '30');
      expect(isToTabEnabled(harness)).toBe(true);
    });

    it('should switch to To on click with linked: false while From is empty', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });

      harness.toTab.click();

      expect(harness.manager.getActivePart()).toBe('to');
    });

    it('should ignore the click on To with linked: true while From is empty', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });

      harness.toTab.click();

      expect(harness.manager.getActivePart()).toBe('from');
    });
  });

  describe('overnight range with minDuration', () => {
    it('should be confirmable with linked: false in 24h', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false, minDuration: 30 });

      harness.commit('22', '00');
      harness.commit('01', '00');

      expect(harness.manager.canConfirm()).toBe(true);
      expect(harness.okButton.getAttribute('aria-disabled')).toBe('false');
      expect(harness.okButton.classList.contains('disabled')).toBe(false);
    });

    it('should be confirmable with linked: false in 12h', () => {
      harness = mountRangeManager({ clockType: '12h', linked: false, minDuration: 30 });

      harness.commit('10', '00', 'PM');
      harness.commit('01', '00', 'AM');

      expect(harness.manager.canConfirm()).toBe(true);
    });

    it('should not be confirmable with linked: true', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true, minDuration: 30 });

      harness.commit('22', '00');
      harness.commit('01', '00');

      expect(harness.manager.canConfirm()).toBe(false);
      expect(harness.okButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('should skip the duration limits entirely with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false, minDuration: 30, maxDuration: 60 });

      harness.commit('09', '00');
      harness.commit('17', '00');

      expect(harness.manager.canConfirm()).toBe(true);
    });

    it('should still enforce the duration limits with linked: true', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true, minDuration: 30, maxDuration: 60 });

      harness.commit('09', '00');
      harness.commit('17', '00');

      expect(harness.manager.canConfirm()).toBe(false);
    });

    it('should need both ends before confirming with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });

      harness.commit('09', '00');

      expect(harness.manager.canConfirm()).toBe(false);
    });
  });

  describe('range:validation', () => {
    it('should report valid: true for an overnight range with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false, minDuration: 30 });

      harness.commit('22', '00');
      harness.commit('01', '00');

      expect(lastValidation(harness)).toEqual(expect.objectContaining({ valid: true, duration: -1260 }));
    });

    it('should report valid: false for the same range with linked: true', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true, minDuration: 30 });

      harness.commit('22', '00');
      harness.commit('01', '00');

      expect(lastValidation(harness)).toEqual(expect.objectContaining({ valid: false }));
    });

    it('should not emit a validation result before both ends are complete', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });

      harness.commit('22', '00');

      expect(lastValidation(harness)).toBeUndefined();
    });

    it('should report valid: true once both ends are complete after setRange with linked: false', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false, minDuration: 30 });

      harness.manager.setRange('22:00', '01:00', true);

      expect(harness.manager.validateRange()).toEqual(expect.objectContaining({ valid: true }));
    });
  });
});
