import { debounce } from '../../../src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only call function once after multiple rapid calls', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on each call', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the callback', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use last arguments when called multiple times', () => {
    const callback = jest.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith('third');
  });
});

