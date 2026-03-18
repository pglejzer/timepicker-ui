import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { setupWheelTestContext, WHEEL_ITEM_HEIGHT_PX, type WheelTestContext } from './wheel-test-helpers';

describe('WheelDragHandler', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
    renderer.init();
    dragHandler = new WheelDragHandler(renderer);
  });

  afterEach(() => {
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should not throw', () => {
      expect(() => dragHandler.init()).not.toThrow();
    });

    it('should attach pointer and wheel listeners to columns', () => {
      const hoursCol = renderer.getColumnElement('hours');
      const addSpy = jest.spyOn(hoursCol as HTMLDivElement, 'addEventListener');

      dragHandler.init();

      const eventNames = addSpy.mock.calls.map((call) => call[0]);
      expect(eventNames).toContain('pointerdown');
      expect(eventNames).toContain('wheel');

      addSpy.mockRestore();
    });

    it('should attach document-level pointermove and pointerup', () => {
      const docSpy = jest.spyOn(document, 'addEventListener');

      dragHandler.init();

      const eventNames = docSpy.mock.calls.map((call) => call[0]);
      expect(eventNames).toContain('pointermove');
      expect(eventNames).toContain('pointerup');

      docSpy.mockRestore();
    });
  });

  describe('getScrollOffset()', () => {
    it('should return 0 initially', () => {
      dragHandler.init();
      expect(dragHandler.getScrollOffset('hours')).toBe(0);
    });
  });

  describe('setScrollOffset()', () => {
    it('should set scrollTop on the column element', () => {
      dragHandler.init();
      dragHandler.setScrollOffset('hours', 120);

      const col = renderer.getColumnElement('hours');
      expect(col?.scrollTop).toBe(120);
    });

    it('should not throw for non-existent column', () => {
      dragHandler.init();
      expect(() => dragHandler.setScrollOffset('ampm', 0)).not.toThrow();
    });
  });

  describe('getMaxOffset()', () => {
    it('should return 0 when item height is 0', () => {
      dragHandler.init();
      expect(dragHandler.getMaxOffset('hours')).toBe(0);
    });

    it('should calculate max offset based on item count', () => {
      dragHandler.init();

      jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);
      jest.spyOn(renderer, 'getItemCount').mockReturnValue(12);

      const expected = (12 - 1) * WHEEL_ITEM_HEIGHT_PX;
      expect(dragHandler.getMaxOffset('hours')).toBe(expected);
    });
  });

  describe('setSnapCallback()', () => {
    it('should accept a callback without throwing', () => {
      expect(() => dragHandler.setSnapCallback(jest.fn())).not.toThrow();
    });
  });

  describe('setVisualUpdateCallback()', () => {
    it('should accept a callback without throwing', () => {
      expect(() => dragHandler.setVisualUpdateCallback(jest.fn())).not.toThrow();
    });
  });

  describe('pointer drag interaction', () => {
    beforeEach(() => {
      HTMLElement.prototype.setPointerCapture = jest.fn();
      HTMLElement.prototype.releasePointerCapture = jest.fn();

      if (typeof globalThis.PointerEvent === 'undefined') {
        (globalThis as Record<string, unknown>).PointerEvent = class PointerEvent extends MouseEvent {
          readonly pointerId: number;
          constructor(type: string, init: PointerEventInit & { pointerId?: number } = {}) {
            super(type, init);
            this.pointerId = init.pointerId ?? 0;
          }
        };
      }
    });

    it('should add is-dragging class on pointerdown', () => {
      dragHandler.init();

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) throw new Error('hours column not found');

      hoursCol.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientY: 100,
          pointerId: 1,
          bubbles: true,
        }),
      );

      expect(hoursCol.classList.contains('is-dragging')).toBe(true);
    });

    it('should remove is-dragging class on pointerup', () => {
      dragHandler.init();

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) throw new Error('hours column not found');

      hoursCol.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientY: 100,
          pointerId: 1,
          bubbles: true,
        }),
      );

      document.dispatchEvent(
        new PointerEvent('pointerup', {
          clientY: 100,
          pointerId: 1,
          bubbles: true,
        }),
      );

      expect(hoursCol.classList.contains('is-dragging')).toBe(false);
    });
  });

  describe('wheel interaction', () => {
    it('should prevent default on wheel events', () => {
      dragHandler.init();

      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) throw new Error('hours column not found');

      const event = new WheelEvent('wheel', {
        deltaY: 50,
        bubbles: true,
        cancelable: true,
      });

      const preventSpy = jest.spyOn(event, 'preventDefault');
      hoursCol.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('should not throw when called without init', () => {
      expect(() => dragHandler.destroy()).not.toThrow();
    });

    it('should not throw when called after init', () => {
      dragHandler.init();
      expect(() => dragHandler.destroy()).not.toThrow();
    });

    it('should not throw when called multiple times', () => {
      dragHandler.init();
      dragHandler.destroy();
      expect(() => dragHandler.destroy()).not.toThrow();
    });

    it('should clean up without errors after init', () => {
      dragHandler.init();
      expect(() => dragHandler.destroy()).not.toThrow();
    });
  });
});

