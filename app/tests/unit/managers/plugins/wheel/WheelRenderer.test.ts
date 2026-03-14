import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { setupWheelTestContext, type WheelTestContext } from './wheel-test-helpers';

describe('WheelRenderer', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
  });

  afterEach(() => {
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should cache column elements from the modal DOM', () => {
      renderer.init();

      expect(renderer.getColumnElement('hours')).toBeInstanceOf(HTMLDivElement);
      expect(renderer.getColumnElement('minutes')).toBeInstanceOf(HTMLDivElement);
    });

    it('should cache ampm column in 12h mode', () => {
      renderer.init();

      expect(renderer.getColumnElement('ampm')).toBeInstanceOf(HTMLDivElement);
    });

    it('should not cache ampm column in 24h mode', () => {
      document.body.innerHTML = '';
      const ctx24 = setupWheelTestContext('24h', 'test-24h-renderer');
      const renderer24 = new WheelRenderer(ctx24.core, ctx24.emitter);

      renderer24.init();
      expect(renderer24.getColumnElement('ampm')).toBeNull();

      renderer24.destroy();
    });

    it('should not throw when modal is missing', () => {
      document.body.innerHTML = '';
      const element = document.createElement('div');
      element.innerHTML = '<input type="text" />';
      document.body.appendChild(element);

      const emitter = new EventEmitter<TimepickerEventMap>();
      const orphanRenderer = new WheelRenderer(ctx.core, emitter);

      expect(() => orphanRenderer.init()).not.toThrow();
      expect(orphanRenderer.getColumnElement('hours')).toBeNull();

      orphanRenderer.destroy();
    });
  });

  describe('getColumnElement()', () => {
    it('should return null before init', () => {
      expect(renderer.getColumnElement('hours')).toBeNull();
      expect(renderer.getColumnElement('minutes')).toBeNull();
      expect(renderer.getColumnElement('ampm')).toBeNull();
    });

    it('should return correct elements after init', () => {
      renderer.init();

      const hours = renderer.getColumnElement('hours');
      expect(hours?.classList.contains('tp-ui-wheel-hours')).toBe(true);

      const minutes = renderer.getColumnElement('minutes');
      expect(minutes?.classList.contains('tp-ui-wheel-minutes')).toBe(true);
    });
  });

  describe('getItems()', () => {
    it('should return null before init', () => {
      expect(renderer.getItems('hours')).toBeNull();
    });

    it('should return 12 hour items in 12h mode', () => {
      renderer.init();
      const items = renderer.getItems('hours');

      expect(items).not.toBeNull();
      expect(items?.length).toBe(12);
    });

    it('should return 60 minute items', () => {
      renderer.init();
      const items = renderer.getItems('minutes');

      expect(items).not.toBeNull();
      expect(items?.length).toBe(60);
    });

    it('should cache items on subsequent calls', () => {
      renderer.init();
      const first = renderer.getItems('hours');
      const second = renderer.getItems('hours');

      expect(first).toBe(second);
    });
  });

  describe('getItemCount()', () => {
    it('should return 0 before init', () => {
      expect(renderer.getItemCount('hours')).toBe(0);
    });

    it('should return correct count after init', () => {
      renderer.init();
      expect(renderer.getItemCount('hours')).toBe(12);
      expect(renderer.getItemCount('minutes')).toBe(60);
    });
  });

  describe('getItemHeight()', () => {
    it('should return 0 before init', () => {
      expect(renderer.getItemHeight()).toBe(0);
    });

    it('should cache the height value', () => {
      renderer.init();

      const first = renderer.getItemHeight();
      const second = renderer.getItemHeight();
      expect(first).toBe(second);
    });
  });

  describe('updateDisabledItems()', () => {
    it('should not throw when no disabled time is set', () => {
      renderer.init();
      expect(() => renderer.updateDisabledItems()).not.toThrow();
    });

    it('should add is-disabled class to disabled hours', () => {
      ctx.core.setDisabledTime({
        value: { hours: ['3', '5'] },
      });

      renderer.init();
      renderer.updateDisabledItems();

      const hoursCol = renderer.getColumnElement('hours');
      const item03 = hoursCol?.querySelector('[data-value="03"]');
      const item05 = hoursCol?.querySelector('[data-value="05"]');
      const item04 = hoursCol?.querySelector('[data-value="04"]');

      expect(item03?.classList.contains('is-disabled')).toBe(true);
      expect(item05?.classList.contains('is-disabled')).toBe(true);
      expect(item04?.classList.contains('is-disabled')).toBe(false);
    });

    it('should add is-disabled class to disabled minutes', () => {
      ctx.core.setDisabledTime({
        value: { minutes: ['00', '15', '30', '45'] },
      });

      renderer.init();
      renderer.updateDisabledItems();

      const minutesCol = renderer.getColumnElement('minutes');
      const item00 = minutesCol?.querySelector('[data-value="00"]');
      const item15 = minutesCol?.querySelector('[data-value="15"]');
      const item01 = minutesCol?.querySelector('[data-value="01"]');

      expect(item00?.classList.contains('is-disabled')).toBe(true);
      expect(item15?.classList.contains('is-disabled')).toBe(true);
      expect(item01?.classList.contains('is-disabled')).toBe(false);
    });

    it('should toggle disabled state when called again with different values', () => {
      ctx.core.setDisabledTime({ value: { hours: ['3'] } });
      renderer.init();
      renderer.updateDisabledItems();

      const hoursCol = renderer.getColumnElement('hours');
      expect(hoursCol?.querySelector('[data-value="03"]')?.classList.contains('is-disabled')).toBe(true);

      ctx.core.setDisabledTime({ value: { hours: ['7'] } });
      renderer.updateDisabledItems();

      expect(hoursCol?.querySelector('[data-value="03"]')?.classList.contains('is-disabled')).toBe(false);
      expect(hoursCol?.querySelector('[data-value="07"]')?.classList.contains('is-disabled')).toBe(true);
    });
  });

  describe('destroy()', () => {
    it('should clear cached data', () => {
      renderer.init();
      expect(renderer.getColumnElement('hours')).not.toBeNull();

      renderer.destroy();
      expect(renderer.getColumnElement('hours')).toBeNull();
      expect(renderer.getItems('hours')).toBeNull();
    });

    it('should not throw when called multiple times', () => {
      renderer.init();
      renderer.destroy();
      expect(() => renderer.destroy()).not.toThrow();
    });

    it('should not throw when called without init', () => {
      expect(() => renderer.destroy()).not.toThrow();
    });
  });
});

