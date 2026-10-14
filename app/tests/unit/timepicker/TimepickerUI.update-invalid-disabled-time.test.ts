import TimepickerUI from '@/timepicker/TimepickerUI';
import type { ErrorEventData } from '@/types/types';

type ClockType = '12h' | '24h';

const DISABLED_HOUR = 3;
const PREVIOUS_DISABLED_TIME = { hours: [DISABLED_HOUR] };

const INVALID_INTERVALS: Array<[string, ClockType, string | string[], string]> = [
  ['a single 12h interval without a range separator', '12h', '10:00 AM', '10:00 AM'],
  ['a single 24h interval without a range separator', '24h', '10:00', '10:00'],
  ['a malformed edge among several 12h intervals', '12h', ['10:00 AM', '1:00 PM - 2:00 PM'], '10:00 AM'],
];

const createPicker = (
  clockType: ClockType,
): { picker: TimepickerUI; onError: jest.Mock; errorListener: jest.Mock } => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const onError = jest.fn();
  const errorListener = jest.fn();
  const picker = new TimepickerUI(input, {
    clock: { type: clockType, disabledTime: PREVIOUS_DISABLED_TIME },
    ui: { animation: false },
    callbacks: { onError },
  });
  picker.on('error', errorListener);
  picker.create();
  return { picker, onError, errorListener };
};

const hourTip = (hour: number): HTMLElement => {
  const tip = [...document.querySelectorAll<HTMLElement>('.tp-ui-modal .tp-ui-hour-time-12')].find(
    (candidate) => Number(candidate.textContent?.trim()) === hour,
  );
  if (!tip) throw new Error(`the hour tip ${hour} is not rendered`);
  return tip;
};

const isDisabled = (hour: number): boolean => hourTip(hour).classList.contains('tp-ui-tips-disabled');

describe('update() with an invalid disabledTime.interval reports it and keeps the previous disabledTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(INVALID_INTERVALS)(
    'should emit one error naming %s instead of throwing',
    (_name, clockType, interval, badEdge) => {
      const { picker, onError, errorListener } = createPicker(clockType);

      expect(() => picker.update({ options: { clock: { disabledTime: { interval } } } })).not.toThrow();

      expect(errorListener).toHaveBeenCalledTimes(1);
      const payload = errorListener.mock.calls[0][0] as ErrorEventData;
      expect(payload.error).toContain(`Invalid ${clockType} format: "${badEdge}"`);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(payload);
      expect(picker.isDestroyed).toBe(false);
      expect(picker.options.clock.disabledTime).toEqual(PREVIOUS_DISABLED_TIME);
    },
  );

  it.each(INVALID_INTERVALS)(
    'should still open with the previously disabled hour after rejecting %s',
    (_name, clockType, interval) => {
      const { picker } = createPicker(clockType);

      expect(() => picker.update({ options: { clock: { disabledTime: { interval } } } })).not.toThrow();
      picker.open();

      expect(document.querySelector('.tp-ui-modal')).not.toBeNull();
      expect(isDisabled(DISABLED_HOUR)).toBe(true);
      expect(isDisabled(DISABLED_HOUR + 1)).toBe(false);
    },
  );

  it('should apply a valid update made after a rejected one', () => {
    const { picker, errorListener } = createPicker('12h');
    const nextDisabledHour = DISABLED_HOUR + 2;

    expect(() =>
      picker.update({ options: { clock: { disabledTime: { interval: '10:00 AM' } } } }),
    ).not.toThrow();
    picker.update({ options: { clock: { disabledTime: { hours: [nextDisabledHour] } } } });
    picker.open();

    expect(errorListener).toHaveBeenCalledTimes(1);
    expect(isDisabled(nextDisabledHour)).toBe(true);
    expect(isDisabled(DISABLED_HOUR)).toBe(false);
  });
});
