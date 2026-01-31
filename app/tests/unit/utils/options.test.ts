import { DEFAULT_OPTIONS, mergeOptions } from '../../../src/utils/options/defaults';

describe('options defaults', () => {
  describe('DEFAULT_OPTIONS', () => {
    it('should have clock options', () => {
      expect(DEFAULT_OPTIONS.clock).toBeDefined();
      expect(DEFAULT_OPTIONS.clock.type).toBe('12h');
      expect(DEFAULT_OPTIONS.clock.incrementHours).toBe(1);
      expect(DEFAULT_OPTIONS.clock.incrementMinutes).toBe(1);
      expect(DEFAULT_OPTIONS.clock.autoSwitchToMinutes).toBe(true);
    });

    it('should have ui options', () => {
      expect(DEFAULT_OPTIONS.ui).toBeDefined();
      expect(DEFAULT_OPTIONS.ui.theme).toBe('basic');
      expect(DEFAULT_OPTIONS.ui.animation).toBe(true);
      expect(DEFAULT_OPTIONS.ui.backdrop).toBe(true);
      expect(DEFAULT_OPTIONS.ui.mobile).toBe(false);
      expect(DEFAULT_OPTIONS.ui.enableSwitchIcon).toBe(false);
      expect(DEFAULT_OPTIONS.ui.editable).toBe(false);
    });

    it('should have labels options', () => {
      expect(DEFAULT_OPTIONS.labels).toBeDefined();
      expect(DEFAULT_OPTIONS.labels.am).toBe('AM');
      expect(DEFAULT_OPTIONS.labels.pm).toBe('PM');
      expect(DEFAULT_OPTIONS.labels.ok).toBe('OK');
      expect(DEFAULT_OPTIONS.labels.cancel).toBe('Cancel');
      expect(DEFAULT_OPTIONS.labels.time).toBe('Select time');
      expect(DEFAULT_OPTIONS.labels.mobileTime).toBe('Enter Time');
    });

    it('should have behavior options', () => {
      expect(DEFAULT_OPTIONS.behavior).toBeDefined();
      expect(DEFAULT_OPTIONS.behavior.focusInputAfterClose).toBe(false);
      expect(DEFAULT_OPTIONS.behavior.focusTrap).toBe(true);
      expect(DEFAULT_OPTIONS.behavior.delayHandler).toBe(300);
    });

    it('should have callbacks options', () => {
      expect(DEFAULT_OPTIONS.callbacks).toBeDefined();
      expect(DEFAULT_OPTIONS.callbacks.onOpen).toBeUndefined();
      expect(DEFAULT_OPTIONS.callbacks.onConfirm).toBeUndefined();
      expect(DEFAULT_OPTIONS.callbacks.onCancel).toBeUndefined();
    });

    it('should have timezone options', () => {
      expect(DEFAULT_OPTIONS.timezone).toBeDefined();
      expect(DEFAULT_OPTIONS.timezone.enabled).toBe(false);
      expect(DEFAULT_OPTIONS.timezone.label).toBe('Timezone');
    });

    it('should have range options', () => {
      expect(DEFAULT_OPTIONS.range).toBeDefined();
      expect(DEFAULT_OPTIONS.range.enabled).toBe(false);
      expect(DEFAULT_OPTIONS.range.fromLabel).toBe('From');
      expect(DEFAULT_OPTIONS.range.toLabel).toBe('To');
    });
  });

  describe('mergeOptions', () => {
    it('should return defaults when no options provided', () => {
      const result = mergeOptions();
      expect(result).toEqual(DEFAULT_OPTIONS);
    });

    it('should return defaults when empty object provided', () => {
      const result = mergeOptions({});
      expect(result).toEqual(DEFAULT_OPTIONS);
    });

    it('should merge clock options', () => {
      const result = mergeOptions({
        clock: { type: '24h' },
      });

      expect(result.clock.type).toBe('24h');
      expect(result.clock.autoSwitchToMinutes).toBe(true);
      expect(result.clock.incrementMinutes).toBe(1);
    });

    it('should merge ui options', () => {
      const result = mergeOptions({
        ui: { theme: 'dark', mobile: true },
      });

      expect(result.ui.theme).toBe('dark');
      expect(result.ui.mobile).toBe(true);
      expect(result.ui.animation).toBe(true);
    });

    it('should merge labels options', () => {
      const result = mergeOptions({
        labels: { am: 'A.M.', pm: 'P.M.' },
      });

      expect(result.labels.am).toBe('A.M.');
      expect(result.labels.pm).toBe('P.M.');
      expect(result.labels.ok).toBe('OK');
    });

    it('should merge behavior options', () => {
      const result = mergeOptions({
        behavior: { focusInputAfterClose: true, delayHandler: 500 },
      });

      expect(result.behavior.focusInputAfterClose).toBe(true);
      expect(result.behavior.delayHandler).toBe(500);
      expect(result.behavior.focusTrap).toBe(true);
    });

    it('should merge callbacks options', () => {
      const onOpen = jest.fn();
      const onConfirm = jest.fn();

      const result = mergeOptions({
        callbacks: { onOpen, onConfirm },
      });

      expect(result.callbacks.onOpen).toBe(onOpen);
      expect(result.callbacks.onConfirm).toBe(onConfirm);
      expect(result.callbacks.onCancel).toBeUndefined();
    });

    it('should merge timezone options', () => {
      const result = mergeOptions({
        timezone: { enabled: true, default: 'UTC' },
      });

      expect(result.timezone.enabled).toBe(true);
      expect(result.timezone.default).toBe('UTC');
      expect(result.timezone.label).toBe('Timezone');
    });

    it('should merge range options', () => {
      const result = mergeOptions({
        range: { enabled: true, minDuration: 30 },
      });

      expect(result.range.enabled).toBe(true);
      expect(result.range.minDuration).toBe(30);
      expect(result.range.fromLabel).toBe('From');
    });

    it('should merge multiple option groups', () => {
      const result = mergeOptions({
        clock: { type: '24h' },
        ui: { theme: 'dark' },
        labels: { ok: 'Save' },
      });

      expect(result.clock.type).toBe('24h');
      expect(result.ui.theme).toBe('dark');
      expect(result.labels.ok).toBe('Save');
    });

    it('should not modify DEFAULT_OPTIONS', () => {
      const originalType = DEFAULT_OPTIONS.clock.type;

      mergeOptions({ clock: { type: '24h' } });

      expect(DEFAULT_OPTIONS.clock.type).toBe(originalType);
    });
  });
});

