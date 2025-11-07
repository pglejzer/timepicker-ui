import { debounce } from '../../../src/utils/debounce';

describe('utils/debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 300);

    debounced();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous timeout on consecutive calls', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 300);

    debounced();
    jest.advanceTimersByTime(100);
    debounced();
    jest.advanceTimersByTime(100);
    debounced();

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to callback', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 300);

    debounced('arg1', 'arg2', 123);
    jest.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should use latest arguments on consecutive calls', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 300);

    debounced('first');
    jest.advanceTimersByTime(100);
    debounced('second');
    jest.advanceTimersByTime(100);
    debounced('third');
    jest.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('third');
  });

  it('should handle multiple invocations after timeout', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 300);

    debounced('first');
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('first');

    debounced('second');
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });

  it('should work with different timeout values', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 500);

    debounced();
    jest.advanceTimersByTime(400);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle zero timeout', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 0);

    debounced();
    jest.advanceTimersByTime(0);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should preserve return type', () => {
    const callback = (x: number): number => x * 2;
    const debounced = debounce(callback, 300);

    debounced(5);
    jest.advanceTimersByTime(300);
  });
});

