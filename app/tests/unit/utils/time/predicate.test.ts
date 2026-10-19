import { createTimePredicate } from '@/utils/time/predicate';
import { rethrowLater } from '@/utils/errors/rethrowLater';
import type { TimeOfDay } from '@/types/options';

describe('createTimePredicate', () => {
  it('converts a second of day to a 0-23 time of day', () => {
    const fn = jest.fn((_time: TimeOfDay) => false);
    const predicate = createTimePredicate(fn);

    predicate(13 * 3600 + 5 * 60 + 9);
    predicate(0);
    predicate(86399);

    expect(fn.mock.calls.map(([time]) => time)).toEqual([
      { hour: 13, minutes: 5, seconds: 9 },
      { hour: 0, minutes: 0, seconds: 0 },
      { hour: 23, minutes: 59, seconds: 59 },
    ]);
  });

  it('calls the user function once per time and serves repeats from the cache', () => {
    const fn = jest.fn(({ hour }: TimeOfDay) => hour === 9);
    const predicate = createTimePredicate(fn);

    expect(predicate(9 * 3600)).toBe(true);
    expect(predicate(9 * 3600)).toBe(true);
    expect(predicate(10 * 3600)).toBe(false);
    expect(predicate(10 * 3600)).toBe(false);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('coerces a truthy or falsy return to a boolean', () => {
    const predicate = createTimePredicate(((time: TimeOfDay) => (time.hour === 1 ? 1 : 0)) as never);

    expect(predicate(3600)).toBe(true);
    expect(predicate(7200)).toBe(false);
  });

  it('clear() drops the cache so changed data is picked up', () => {
    let blocked = true;
    const fn = jest.fn(() => blocked);
    const predicate = createTimePredicate(fn);

    expect(predicate(100)).toBe(true);
    blocked = false;
    expect(predicate(100)).toBe(true);

    predicate.clear();

    expect(predicate(100)).toBe(false);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  describe('a throwing user function', () => {
    let queued: Array<() => void>;
    let spy: jest.SpyInstance;

    beforeEach(() => {
      queued = [];
      spy = jest
        .spyOn(globalThis, 'queueMicrotask')
        .mockImplementation((callback: VoidFunction) => void queued.push(callback));
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('counts the time as enabled and rethrows the error in a microtask', () => {
      const failure = new Error('boom');
      const predicate = createTimePredicate(() => {
        throw failure;
      });

      expect(() => predicate(60)).not.toThrow();
      expect(predicate(60)).toBe(false);
      expect(queued).toHaveLength(1);
      expect(() => queued[0]()).toThrow(failure);
    });

    it('rethrows again after clear() because the throw is no longer cached', () => {
      const predicate = createTimePredicate(() => {
        throw new Error('boom');
      });

      predicate(60);
      predicate.clear();
      predicate(60);

      expect(queued).toHaveLength(2);
    });

    it('keeps other times working', () => {
      const predicate = createTimePredicate(({ hour }) => {
        if (hour === 1) throw new Error('bad hour');
        return hour === 2;
      });

      expect(predicate(3600)).toBe(false);
      expect(predicate(2 * 3600)).toBe(true);
      expect(queued).toHaveLength(1);
    });
  });
});

describe('rethrowLater', () => {
  it('throws the given error from a queued microtask, not synchronously', () => {
    const queued: Array<() => void> = [];
    const spy = jest
      .spyOn(globalThis, 'queueMicrotask')
      .mockImplementation((callback: VoidFunction) => void queued.push(callback));
    const failure = new Error('later');

    expect(() => rethrowLater(failure)).not.toThrow();
    expect(queued).toHaveLength(1);
    expect(() => queued[0]()).toThrow(failure);

    spy.mockRestore();
  });
});
