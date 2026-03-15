import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { setupWheelTestContext, WHEEL_ITEM_HEIGHT_PX, type WheelTestContext } from './wheel-test-helpers';

describe('WheelScrollHandler edge cases', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
  });

  afterEach(() => {
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('scrollToNextValid() with all items disabled', () => {
    it('should not infinite-loop when every item in column is disabled', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      const items = hoursCol.querySelectorAll('.tp-ui-wheel-item');
      items.forEach((item) => item.classList.add('is-disabled'));

      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

      expect(() => scrollHandler.scrollToValue('hours', '01')).not.toThrow();
    });
  });

  describe('getSelectedValue() with out-of-bounds offset', () => {
    it('should return null when scroll offset yields negative index', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      jest.spyOn(dragHandler, 'getScrollOffset').mockReturnValue(-999);

      const value = scrollHandler.getSelectedValue('hours');
      expect(value).toBeNull();
    });

    it('should return null when scroll offset yields index beyond item count', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      jest.spyOn(dragHandler, 'getScrollOffset').mockReturnValue(99999);

      const value = scrollHandler.getSelectedValue('hours');
      expect(value).toBeNull();
    });
  });

  describe('getSelectedValue() with zero item height', () => {
    it('should return null when item height is 0', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(0);

      const value = scrollHandler.getSelectedValue('hours');
      expect(value).toBeNull();
    });
  });

  describe('scrollToValue() with missing drag handler', () => {
    it('should not throw when drag handler is null after destroy', () => {
      scrollHandler.destroy();

      expect(() => scrollHandler.scrollToValue('hours', '05')).not.toThrow();
    });
  });

  describe('getCurrentSelection() defaults', () => {
    it('should return 12 and 00 as defaults when no items are selectable', () => {
      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(0);

      const selection = scrollHandler.getCurrentSelection();
      expect(selection.hour).toBe('12');
      expect(selection.minute).toBe('00');
    });
  });

  describe('emitScrollStart()', () => {
    it('should call scroll start callback when set', () => {
      const startCb = jest.fn();
      scrollHandler.setScrollStartCallback(startCb);

      scrollHandler.emitScrollStart('hours');

      expect(startCb).toHaveBeenCalledWith('hours');
    });

    it('should not throw when no callback is set', () => {
      scrollHandler.setScrollStartCallback(null);

      expect(() => scrollHandler.emitScrollStart('minutes')).not.toThrow();
    });
  });

  describe('updateVisualClasses() with empty column', () => {
    it('should not throw when column has no items', () => {
      const emptyCtx = setupWheelTestContext('24h', 'empty-col-test');
      const emptyRenderer = new WheelRenderer(emptyCtx.core, emptyCtx.emitter);
      const emptyDrag = new WheelDragHandler(emptyRenderer);
      const emptyScroll = new WheelScrollHandler(emptyRenderer, emptyCtx.core);
      emptyScroll.setDragHandler(emptyDrag);

      emptyRenderer.init();

      expect(() => emptyScroll.updateVisualClasses('ampm')).not.toThrow();

      emptyScroll.destroy();
      emptyDrag.destroy();
      emptyRenderer.destroy();
    });
  });
});

