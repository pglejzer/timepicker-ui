/**
 * Tests for module exports to ensure all entry points are covered
 */
import type {
  DisabledTimeCheckOptions,
  RangeCaptionInput,
  RangeChangeEventData,
  RangeTimeInput,
  TimeFormatOptions,
  TimepickerEventName,
  TimepickerView,
  TimeValue,
} from '../../src/index';

describe('Module Exports', () => {
  describe('index.ts exports', () => {
    it('should export TimepickerUI as default and named', async () => {
      const mainModule = await import('../../src/index');

      expect(mainModule.default).toBeDefined();
      expect(mainModule.TimepickerUI).toBeDefined();
      expect(mainModule.default).toBe(mainModule.TimepickerUI);
    });

    it('should export EventEmitter', async () => {
      const { EventEmitter } = await import('../../src/index');

      expect(EventEmitter).toBeDefined();
    });

    it('should export PluginRegistry', async () => {
      const { PluginRegistry } = await import('../../src/index');

      expect(PluginRegistry).toBeDefined();
    });
  });

  describe('index.ts time helpers and types', () => {
    it('should export the three time helpers as functions', async () => {
      const { parseTime, formatTime, createDisabledTimeCheck } = await import('../../src/index');

      expect(typeof parseTime).toBe('function');
      expect(typeof formatTime).toBe('function');
      expect(typeof createDisabledTimeCheck).toBe('function');
    });

    it('should export the helpers working end to end', async () => {
      const { parseTime, formatTime } = await import('../../src/index');

      expect(parseTime('2:30 PM', { clockType: '24h' })).toEqual({ hour: '14', minutes: '30' });
      expect(formatTime({ hour: '14', minutes: '30' }, { clockType: '24h' })).toBe('14:30');
    });

    it('should export the public type names', () => {
      type ExportedTypes = [
        TimepickerView,
        RangeChangeEventData,
        RangeTimeInput,
        RangeCaptionInput,
        TimeValue,
        TimeFormatOptions,
        DisabledTimeCheckOptions,
        TimepickerEventName,
      ];
      const typesAreExported: ExportedTypes extends unknown[] ? true : false = true;

      expect(typesAreExported).toBe(true);
    });
  });

  describe('index.umd.ts exports', () => {
    it('should export TimepickerUI as default', async () => {
      const umdModule = await import('../../src/index.umd');

      expect(umdModule.default).toBeDefined();
    });

    it('should expose PluginRegistry on the default export so UMD plugins can be registered', async () => {
      const umdModule = await import('../../src/index.umd');
      const { TimepickerUI, PluginRegistry } = await import('../../src/index');

      expect(umdModule.default).toBe(TimepickerUI);
      expect(umdModule.default.PluginRegistry).toBe(PluginRegistry);
    });
  });

  describe('timepicker.ts exports', () => {
    it('should export TimepickerUI as default from timepicker entry', async () => {
      const timepickerModule = await import('../../src/timepicker');

      expect(timepickerModule.default).toBeDefined();
    });
  });

  describe('range.ts exports', () => {
    it('should export RangePlugin from range entry', async () => {
      const rangeModule = await import('../../src/range');

      expect(rangeModule.RangePlugin).toBeDefined();
      expect(rangeModule.RangePlugin.name).toBe('range');
    });

    it('should export RangeManager from range entry', async () => {
      const rangeModule = await import('../../src/range');

      expect(rangeModule.RangeManager).toBeDefined();
    });
  });

  describe('timezone.ts exports', () => {
    it('should export TimezonePlugin from timezone entry', async () => {
      const timezoneModule = await import('../../src/timezone');

      expect(timezoneModule.TimezonePlugin).toBeDefined();
      expect(timezoneModule.TimezonePlugin.name).toBe('timezone');
    });

    it('should export TimezoneManager from timezone entry', async () => {
      const timezoneModule = await import('../../src/timezone');

      expect(timezoneModule.TimezoneManager).toBeDefined();
    });

    it('should export the timezone list helpers from timezone entry', async () => {
      const timezoneModule = await import('../../src/timezone');

      expect(typeof timezoneModule.getTimezoneList).toBe('function');
      expect(timezoneModule.DEFAULT_TIMEZONES).toContain('UTC');
      expect(timezoneModule.getTimezoneList([...timezoneModule.DEFAULT_TIMEZONES, 'Europe/Warsaw'])).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'Europe/Warsaw' })]),
      );
    });
  });

  describe('constants/index.ts exports', () => {
    it('should re-export timings constants', async () => {
      const constantsModule = await import('../../src/constants/index');

      expect(constantsModule.TIMINGS).toBeDefined();
      expect(constantsModule.TIMINGS.MODAL_EXIT).toBeDefined();
    });
  });
});
