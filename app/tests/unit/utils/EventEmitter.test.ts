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

  describe('once off-by-reference', () => {
    it('off() removes a once-registered handler when called with the original reference', () => {
      const emitter = new EventEmitter<{ ping: { n: number } }>();
      let calls = 0;
      const handler = () => { calls++; };
      emitter.once('ping', handler);
      emitter.off('ping', handler);
      emitter.emit('ping', { n: 1 });
      expect(calls).toBe(0);
    });
  });

  describe('once cross-event wrapper isolation (regression)', () => {
    it('off("a", fn) after once on both "a" and "b" stops "a" but keeps "b" firing', () => {
      // Core regression: same handler used as `once` on two events must not collide.
      // Before the per-event WeakMap fix, the "a" wrapper leaked and could never be
      // removed by off(), and/or removing one event clobbered the other.
      const fn = jest.fn();

      emitter.once('testEvent', fn);
      emitter.once('anotherEvent', fn);

      emitter.off('testEvent', fn);

      emitter.emit('testEvent', { value: 'a' });
      expect(fn).not.toHaveBeenCalled();

      emitter.emit('anotherEvent', { count: 1 });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith({ count: 1 });
    });

    it('removing the OTHER event leaves the first event working', () => {
      const fn = jest.fn();

      emitter.once('testEvent', fn);
      emitter.once('anotherEvent', fn);

      emitter.off('anotherEvent', fn);

      emitter.emit('anotherEvent', { count: 99 });
      expect(fn).not.toHaveBeenCalled();

      emitter.emit('testEvent', { value: 'still-here' });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith({ value: 'still-here' });
    });

    it('same-event double-once: off() removes ALL duplicate once wrappers for the same event (leak fixed)', () => {
      // Regression for the residual same-event leak. off(event, handler) now scans
      // the Set and removes every registration tagged with __originalHandler === fn,
      // so registering once('a', fn) twice and then off('a', fn) leaves nothing.
      // Previously the earlier wrapper leaked and kept firing on every emit.
      const fn = jest.fn();

      emitter.once('testEvent', fn);
      emitter.once('testEvent', fn);

      emitter.off('testEvent', fn);

      // Both wrappers are gone — no emit, no matter how many, ever fires fn.
      emitter.emit('testEvent', { value: 'gone' });
      emitter.emit('testEvent', { value: 'again' });
      emitter.emit('testEvent', { value: 'third' });
      expect(fn).not.toHaveBeenCalled();
    });

    it('same-event double-once without off(): each wrapper fires exactly once, then self-removes', () => {
      // once('a', fn) twice with no explicit off(): a single emit fires both
      // wrappers (2 calls), each self-removes, so a second emit fires nothing.
      const fn = jest.fn();

      emitter.once('testEvent', fn);
      emitter.once('testEvent', fn);

      emitter.emit('testEvent', { value: 'first' });
      expect(fn).toHaveBeenCalledTimes(2);

      emitter.emit('testEvent', { value: 'second' });
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('on() + once() with same fn then off(): off() removes BOTH the persistent listener and the once wrapper', () => {
      // off(event, fn) matches the persistent on() registration by strict equality
      // AND the once() wrapper by its __originalHandler tag, so a single off()
      // wipes every registration of fn for that event.
      const fn = jest.fn();

      emitter.on('testEvent', fn);
      emitter.once('testEvent', fn);

      emitter.off('testEvent', fn);

      emitter.emit('testEvent', { value: 'gone' });
      expect(fn).not.toHaveBeenCalled();
    });

    it('auto-fire cleanup: once fires exactly once across repeated emits', () => {
      const fn = jest.fn();

      emitter.once('testEvent', fn);

      emitter.emit('testEvent', { value: 'first' });
      emitter.emit('testEvent', { value: 'second' });

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith({ value: 'first' });
    });

    it('off(event) with no handler clears the event and does not break a later once()', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();

      emitter.once('testEvent', fn1);
      emitter.off('testEvent');

      emitter.emit('testEvent', { value: 'cleared' });
      expect(fn1).not.toHaveBeenCalled();

      // A fresh once registration on the same event must still work after the
      // whole-event clear wiped the per-event wrapper map.
      emitter.once('testEvent', fn2);
      emitter.emit('testEvent', { value: 'fresh' });

      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledWith({ value: 'fresh' });
    });

    it('on() + once() with the same fn on the same event: persistent listener survives once auto-removal', () => {
      // `on` registers fn directly; `once` registers a separate wrapper for fn.
      // They are distinct entries in the Set, so the once auto-removal only
      // strips the wrapper and the persistent `on` listener keeps firing.
      const fn = jest.fn();

      emitter.on('testEvent', fn);
      emitter.once('testEvent', fn);

      emitter.emit('testEvent', { value: 'one' });
      // first emit: persistent on() + once() wrapper both invoke fn
      expect(fn).toHaveBeenCalledTimes(2);

      emitter.emit('testEvent', { value: 'two' });
      // once is gone; only the persistent on() listener fires
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});

