import { EventEmitter } from '../../../src/utils/EventEmitter';

interface TestEventMap extends Record<string, unknown> {
  testEvent: { value: string };
  chainA: { step: number };
  chainB: { step: number };
}

describe('EventEmitter edge cases', () => {
  let emitter: EventEmitter<TestEventMap>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEventMap>();
  });

  describe('handler throwing exception', () => {
    it('should propagate error from handler and not call subsequent handlers', () => {
      const firstHandler = jest.fn(() => {
        throw new Error('handler crash');
      });
      const secondHandler = jest.fn();

      emitter.on('testEvent', firstHandler);
      emitter.on('testEvent', secondHandler);

      expect(() => emitter.emit('testEvent', { value: 'boom' })).toThrow('handler crash');
      expect(firstHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('re-entrant emit', () => {
    it('should handle emit called inside a handler', () => {
      const innerHandler = jest.fn();
      emitter.on('chainB', innerHandler);

      emitter.on('chainA', () => {
        emitter.emit('chainB', { step: 2 });
      });

      emitter.emit('chainA', { step: 1 });

      expect(innerHandler).toHaveBeenCalledWith({ step: 2 });
    });
  });

  describe('off() during emit', () => {
    it('should allow a handler to remove itself', () => {
      let callCount = 0;
      const selfRemover = (): void => {
        callCount++;
        emitter.off('testEvent', selfRemover);
      };

      emitter.on('testEvent', selfRemover);

      emitter.emit('testEvent', { value: 'a' });
      emitter.emit('testEvent', { value: 'b' });

      expect(callCount).toBe(1);
    });
  });

  describe('once() idempotency', () => {
    it('should fire exactly once even with rapid sequential emits', () => {
      const handler = jest.fn();
      emitter.once('testEvent', handler);

      emitter.emit('testEvent', { value: 'first' });
      emitter.emit('testEvent', { value: 'second' });
      emitter.emit('testEvent', { value: 'third' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ value: 'first' });
    });
  });

  describe('clear() between emissions', () => {
    it('should prevent handlers from firing after clear', () => {
      const handler = jest.fn();
      emitter.on('testEvent', handler);

      emitter.emit('testEvent', { value: 'before' });
      expect(handler).toHaveBeenCalledTimes(1);

      emitter.clear();
      emitter.emit('testEvent', { value: 'after' });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off() with non-registered handler', () => {
    it('should not throw when removing a handler that was never registered', () => {
      const unregistered = jest.fn();
      expect(() => emitter.off('testEvent', unregistered)).not.toThrow();
    });
  });

  describe('emit with undefined data', () => {
    it('should pass undefined to handler when no data provided', () => {
      const handler = jest.fn();
      emitter.on('testEvent', handler);

      emitter.emit('testEvent');

      expect(handler).toHaveBeenCalledWith(undefined);
    });
  });

  describe('hasListeners after clear', () => {
    it('should return false for all events after clear', () => {
      emitter.on('testEvent', jest.fn());
      emitter.on('chainA', jest.fn());

      emitter.clear();

      expect(emitter.hasListeners('testEvent')).toBe(false);
      expect(emitter.hasListeners('chainA')).toBe(false);
    });
  });
});

