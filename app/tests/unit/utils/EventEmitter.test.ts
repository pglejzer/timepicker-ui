import { EventEmitter } from '../../../src/utils/EventEmitter';

interface TestEventMap extends Record<string, unknown> {
  testEvent: { value: string };
  anotherEvent: { count: number };
  noData: Record<string, never>;
}

describe('EventEmitter', () => {
  let emitter: EventEmitter<TestEventMap>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEventMap>();
  });

  describe('on', () => {
    it('should register event handler', () => {
      const handler = jest.fn();
      emitter.on('testEvent', handler);

      emitter.emit('testEvent', { value: 'test' });
      expect(handler).toHaveBeenCalledWith({ value: 'test' });
    });

    it('should allow multiple handlers for same event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on('testEvent', handler1);
      emitter.on('testEvent', handler2);

      emitter.emit('testEvent', { value: 'test' });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should not register same handler twice', () => {
      const handler = jest.fn();

      emitter.on('testEvent', handler);
      emitter.on('testEvent', handler);

      emitter.emit('testEvent', { value: 'test' });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should call handler only once', () => {
      const handler = jest.fn();
      emitter.once('testEvent', handler);

      emitter.emit('testEvent', { value: 'first' });
      emitter.emit('testEvent', { value: 'second' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ value: 'first' });
    });
  });

  describe('off', () => {
    it('should remove specific handler', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on('testEvent', handler1);
      emitter.on('testEvent', handler2);
      emitter.off('testEvent', handler1);

      emitter.emit('testEvent', { value: 'test' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should remove all handlers when no handler specified', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on('testEvent', handler1);
      emitter.on('testEvent', handler2);
      emitter.off('testEvent');

      emitter.emit('testEvent', { value: 'test' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('emit', () => {
    it('should call all registered handlers with data', () => {
      const handler = jest.fn();
      emitter.on('anotherEvent', handler);

      emitter.emit('anotherEvent', { count: 42 });

      expect(handler).toHaveBeenCalledWith({ count: 42 });
    });

    it('should not throw when emitting event with no handlers', () => {
      expect(() => emitter.emit('testEvent', { value: 'test' })).not.toThrow();
    });

    it('should handle events without data', () => {
      const handler = jest.fn();
      emitter.on('noData', handler);

      emitter.emit('noData');

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove all event handlers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.on('testEvent', handler1);
      emitter.on('anotherEvent', handler2);
      emitter.clear();

      emitter.emit('testEvent', { value: 'test' });
      emitter.emit('anotherEvent', { count: 1 });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('hasListeners', () => {
    it('should return true when event has listeners', () => {
      emitter.on('testEvent', jest.fn());
      expect(emitter.hasListeners('testEvent')).toBe(true);
    });

    it('should return false when event has no listeners', () => {
      expect(emitter.hasListeners('testEvent')).toBe(false);
    });

    it('should return false after all listeners removed', () => {
      const handler = jest.fn();
      emitter.on('testEvent', handler);
      emitter.off('testEvent', handler);

      expect(emitter.hasListeners('testEvent')).toBe(false);
    });
  });
});

