/**
 * Tests for module exports to ensure all entry points are covered
 */

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

  describe('index.umd.ts exports', () => {
    it('should export TimepickerUI as default', async () => {
      const umdModule = await import('../../src/index.umd');

      expect(umdModule.default).toBeDefined();
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
  });

  describe('constants/index.ts exports', () => {
    it('should re-export timings constants', async () => {
      const constantsModule = await import('../../src/constants/index');

      expect(constantsModule.TIMINGS).toBeDefined();
      expect(constantsModule.TIMINGS.MODAL_REMOVE).toBeDefined();
    });
  });
});

