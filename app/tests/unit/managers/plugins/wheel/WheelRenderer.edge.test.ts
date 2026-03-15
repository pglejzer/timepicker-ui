import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { setupWheelTestContext, createWheelOptions, type WheelTestContext } from './wheel-test-helpers';
import { CoreState } from '../../../../../src/timepicker/CoreState';

describe('WheelRenderer edge cases', () => {
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

  describe('hideDisabledOptions + cache invalidation', () => {
    it('should exclude hidden items from getItems after updateDisabledItems', () => {
      const hideOpts = createWheelOptions({
        clock: { type: '12h', disabledTime: { hideOptions: true } },
      });
      const hideCore = new CoreState(ctx.element, hideOpts, ctx.core.instanceId);
      const hideRenderer = new WheelRenderer(hideCore, ctx.emitter);

      hideCore.setDisabledTime({ value: { hours: ['3', '5', '7'] } });
      hideRenderer.init();

      const items = hideRenderer.getItems('hours');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));
      expect(values).not.toContain('03');
      expect(values).not.toContain('05');
      expect(values).not.toContain('07');

      hideRenderer.destroy();
    });

    it('should refresh items cache after invalidateItemCache', () => {
      renderer.init();
      const before = renderer.getItems('hours');
      renderer.invalidateItemCache();
      const after = renderer.getItems('hours');

      expect(before).not.toBe(after);
      expect(before?.length).toBe(after?.length);
    });
  });

  describe('double init()', () => {
    it('should not duplicate column references after calling init twice', () => {
      renderer.init();
      const first = renderer.getColumnElement('hours');

      renderer.init();
      const second = renderer.getColumnElement('hours');

      expect(first).toBe(second);
    });

    it('should reset item cache on re-init', () => {
      renderer.init();
      const beforeItems = renderer.getItems('hours');

      renderer.init();
      const afterItems = renderer.getItems('hours');

      expect(beforeItems).not.toBe(afterItems);
    });
  });

  describe('getItemHeight() caching', () => {
    it('should return 0 when column has no items', () => {
      const element = document.createElement('div');
      element.innerHTML = '<input type="text" />';
      document.body.appendChild(element);

      const emptyOpts = createWheelOptions({ clock: { type: '12h' } });
      const emptyCore = new CoreState(element, emptyOpts, 'empty-height-test');

      const modal = document.createElement('div');
      modal.setAttribute('data-owner-id', 'empty-height-test');
      const col = document.createElement('div');
      col.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
      modal.appendChild(col);
      document.body.appendChild(modal);

      const emitter = new EventEmitter<TimepickerEventMap>();
      const emptyRenderer = new WheelRenderer(emptyCore, emitter);
      emptyRenderer.init();

      expect(emptyRenderer.getItemHeight()).toBe(0);

      emptyRenderer.destroy();
    });
  });

  describe('updateDisabledItems with both hours and minutes disabled', () => {
    it('should apply is-disabled class to items in both columns simultaneously', () => {
      ctx.core.setDisabledTime({
        value: { hours: ['1', '2'], minutes: ['10', '20'] },
      });

      renderer.init();
      renderer.updateDisabledItems();

      const hoursCol = renderer.getColumnElement('hours');
      const minutesCol = renderer.getColumnElement('minutes');

      expect(hoursCol?.querySelector('[data-value="01"]')?.classList.contains('is-disabled')).toBe(true);
      expect(hoursCol?.querySelector('[data-value="02"]')?.classList.contains('is-disabled')).toBe(true);
      expect(minutesCol?.querySelector('[data-value="10"]')?.classList.contains('is-disabled')).toBe(true);
      expect(minutesCol?.querySelector('[data-value="20"]')?.classList.contains('is-disabled')).toBe(true);
      expect(minutesCol?.querySelector('[data-value="30"]')?.classList.contains('is-disabled')).toBe(false);
    });
  });

  describe('getItemCount for non-existent column', () => {
    it('should return 0 for ampm column in 24h mode', () => {
      renderer.destroy();
      document.body.innerHTML = '';

      const ctx24 = setupWheelTestContext('24h', 'count-24h');
      const renderer24 = new WheelRenderer(ctx24.core, ctx24.emitter);
      renderer24.init();

      expect(renderer24.getItemCount('ampm')).toBe(0);

      renderer24.destroy();
    });
  });
});

