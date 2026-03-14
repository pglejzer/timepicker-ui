import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { setupWheelTestContext, type WheelTestContext } from './wheel-test-helpers';

describe('WheelEventHandler', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  beforeEach(() => {
    ctx = setupWheelTestContext('12h');
    renderer = new WheelRenderer(ctx.core, ctx.emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('init()', () => {
    it('should set the scroll end callback on the scroll handler', () => {
      const spy = jest.spyOn(scrollHandler, 'setScrollEndCallback');

      const freshHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      freshHandler.init();

      expect(spy).toHaveBeenCalledWith(expect.any(Function));

      freshHandler.destroy();
    });

    it('should not throw when called', () => {
      const freshHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      expect(() => freshHandler.init()).not.toThrow();
      freshHandler.destroy();
    });
  });

  describe('clear event', () => {
    it('should scroll hours and minutes to neutral values on clear', () => {
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      ctx.emitter.emit('clear', { previousValue: null });

      expect(scrollSpy).toHaveBeenCalledWith('hours', '12');
      expect(scrollSpy).toHaveBeenCalledWith('minutes', '00');
    });
  });

  describe('keyboard navigation', () => {
    it('should not throw on ArrowDown keypress on hours column', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      expect(() => {
        hoursCol.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
          }),
        );
      }).not.toThrow();
    });

    it('should not throw on ArrowUp keypress on hours column', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      expect(() => {
        hoursCol.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            bubbles: true,
          }),
        );
      }).not.toThrow();
    });

    it('should not respond to non-arrow keys', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      hoursCol.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
        }),
      );

      expect(scrollSpy).not.toHaveBeenCalled();
    });
  });

  describe('scroll end event emission', () => {
    it('should emit select:hour when scroll handler reports hour scroll end', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      let capturedCallback: ((columnType: string, value: string) => void) | null = null;

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedCallback = cb as (columnType: string, value: string) => void;
      });

      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '09',
        minute: '30',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      expect(capturedCallback).not.toBeNull();
      capturedCallback?.('hours', '09');

      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '09' });
      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '09',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should emit select:minute when scroll handler reports minute scroll end', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      let capturedCallback: ((columnType: string, value: string) => void) | null = null;

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedCallback = cb as (columnType: string, value: string) => void;
      });

      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '12',
        minute: '45',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      expect(capturedCallback).not.toBeNull();
      capturedCallback?.('minutes', '45');

      expect(emitSpy).toHaveBeenCalledWith('select:minute', { minutes: '45' });
      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '12',
        minutes: '45',
        type: 'AM',
      });
    });
  });

  describe('destroy()', () => {
    it('should not throw when called', () => {
      expect(() => eventHandler.destroy()).not.toThrow();
    });

    it('should not throw when called multiple times', () => {
      eventHandler.destroy();
      expect(() => eventHandler.destroy()).not.toThrow();
    });

    it('should remove clear listener', () => {
      const offSpy = jest.spyOn(ctx.emitter, 'off');
      eventHandler.destroy();
      expect(offSpy).toHaveBeenCalledWith('clear', expect.any(Function));
    });

    it('should not throw when called without init', () => {
      const freshHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      expect(() => freshHandler.destroy()).not.toThrow();
    });
  });
});

