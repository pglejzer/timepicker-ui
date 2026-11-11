import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { TIMINGS } from '../../../../../src/constants/timings';
import { mockWheelItemHeight, setupWheelTestContext, type WheelTestContext } from './wheel-test-helpers';

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

    it('should jump to the first hour on Home', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('06');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      hoursCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('hours', '01');
    });

    it('should jump to the last hour on End', () => {
      const hoursCol = renderer.getColumnElement('hours');
      if (!hoursCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('06');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      hoursCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('hours', '12');
    });

    it('should step the minutes back by 5 on PageUp', () => {
      const minutesCol = renderer.getColumnElement('minutes');
      if (!minutesCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('30');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      minutesCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('minutes', '25');
    });

    it('should step the minutes forward by 5 on PageDown', () => {
      const minutesCol = renderer.getColumnElement('minutes');
      if (!minutesCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('30');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      minutesCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('minutes', '35');
    });

    it('should clamp PageUp at the first minute', () => {
      const minutesCol = renderer.getColumnElement('minutes');
      if (!minutesCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('02');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      minutesCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('minutes', '00');
    });

    it('should jump to the last minute on End', () => {
      const minutesCol = renderer.getColumnElement('minutes');
      if (!minutesCol) return;

      jest.spyOn(scrollHandler, 'getSelectedValue').mockReturnValue('30');
      const scrollSpy = jest.spyOn(scrollHandler, 'scrollToValue');

      minutesCol.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));

      expect(scrollSpy).toHaveBeenCalledWith('minutes', '59');
    });
  });

  describe('scroll end event emission', () => {
    it('should emit select:hour when scroll handler reports hour scroll end', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      const capturedRef: { callback: ((columnType: string, value: string) => void) | null } = {
        callback: null,
      };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (columnType: string, value: string) => void;
      });

      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '09',
        minute: '30',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      expect(capturedRef.callback).not.toBeNull();
      capturedRef.callback?.('hours', '09');

      expect(emitSpy).toHaveBeenCalledWith('select:hour', { hour: '09' });
      expect(emitSpy).toHaveBeenCalledWith('update', {
        hour: '09',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should emit select:minute when scroll handler reports minute scroll end', () => {
      const emitSpy = jest.spyOn(ctx.emitter, 'emit');
      const capturedRef: { callback: ((columnType: string, value: string) => void) | null } = {
        callback: null,
      };

      jest.spyOn(scrollHandler, 'setScrollEndCallback').mockImplementation((cb) => {
        capturedRef.callback = cb as (columnType: string, value: string) => void;
      });

      jest.spyOn(scrollHandler, 'getCurrentSelection').mockReturnValue({
        hour: '12',
        minute: '45',
        ampm: 'AM',
      });

      eventHandler.destroy();
      eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);
      eventHandler.init();

      expect(capturedRef.callback).not.toBeNull();
      capturedRef.callback?.('minutes', '45');

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

describe('WheelEventHandler commitOnScroll timer with a range', () => {
  let destroyHandlers: (() => void) | null = null;

  const mountCommitOnScroll = (rangeEnabled: boolean): WheelTestContext => {
    const context = setupWheelTestContext('24h');
    context.core.updateOptions({ range: { enabled: rangeEnabled }, wheel: { commitOnScroll: true } });

    const wheelRenderer = new WheelRenderer(context.core);
    const wheelDrag = new WheelDragHandler(wheelRenderer);
    const wheelScroll = new WheelScrollHandler(wheelRenderer, context.core);
    wheelScroll.setDragHandler(wheelDrag);
    const wheelEvents = new WheelEventHandler(context.emitter, wheelScroll, context.core);

    wheelRenderer.init();
    wheelDrag.init();
    wheelScroll.init();
    wheelScroll.scrollToValue('hours', '12');
    wheelScroll.scrollToValue('minutes', '00');
    wheelEvents.init();

    destroyHandlers = (): void => {
      wheelEvents.destroy();
      wheelScroll.destroy();
      wheelDrag.destroy();
      wheelRenderer.destroy();
    };
    return context;
  };

  const stepHours = (context: WheelTestContext): void => {
    context.modal
      .querySelector('.tp-ui-wheel-hours')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    destroyHandlers?.();
    destroyHandlers = null;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('21: skips the input write with range.enabled and still confirms with autoCommit', () => {
    const context = mountCommitOnScroll(true);
    const onConfirm = jest.fn();
    context.emitter.on('confirm', onConfirm);

    stepHours(context);
    expect(onConfirm).not.toHaveBeenCalled();
    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(context.core.getInput()?.value).toBe('');
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '13', minutes: '00', autoCommit: true }),
    );
  });

  it('21: still writes the input without a range', () => {
    const context = mountCommitOnScroll(false);
    const onConfirm = jest.fn();
    context.emitter.on('confirm', onConfirm);

    stepHours(context);
    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(context.core.getInput()?.value).toBe('13:00');
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '13', minutes: '00', autoCommit: true }),
    );
  });
});
