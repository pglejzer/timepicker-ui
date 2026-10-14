import TimepickerUI from '@/timepicker/TimepickerUI';
import type { ErrorEventData } from '@/types/types';

type ClockType = '12h' | '24h';

const createPicker = (
  clockType: ClockType,
  interval: string | string[],
): { picker: TimepickerUI; onError: jest.Mock; errorListener: jest.Mock } => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const onError = jest.fn();
  const errorListener = jest.fn();
  const picker = new TimepickerUI(input, {
    clock: { type: clockType, disabledTime: { interval } },
    ui: { animation: false },
    callbacks: { onError },
  });
  picker.on('error', errorListener);
  return { picker, onError, errorListener };
};

describe('an invalid disabledTime.interval is reported, not swallowed', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it.each<[string, ClockType, string | string[], string]>([
    ['a single 12h interval without a range separator', '12h', '10:00 AM', '10:00 AM'],
    ['a single 24h interval without a range separator', '24h', '10:00', '10:00'],
    ['a malformed edge among several 12h intervals', '12h', ['10:00 AM', '1:00 PM - 2:00 PM'], '10:00 AM'],
  ])('should emit one error naming %s', (_name, clockType, interval, badEdge) => {
    const { picker, onError, errorListener } = createPicker(clockType, interval);

    expect(() => picker.create()).not.toThrow();

    expect(errorListener).toHaveBeenCalledTimes(1);
    const payload = errorListener.mock.calls[0][0] as ErrorEventData;
    expect(payload.error).toContain(`Invalid ${clockType} format: "${badEdge}"`);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(payload);
  });

  it('should report nothing for a well-formed interval', () => {
    const { picker, onError, errorListener } = createPicker('12h', '10:00 AM - 11:00 AM');

    expect(() => picker.create()).not.toThrow();

    expect(errorListener).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(picker.isInitialized).toBe(true);
  });
});
