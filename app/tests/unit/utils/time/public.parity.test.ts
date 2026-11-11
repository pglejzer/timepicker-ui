import TimepickerUI from '@/timepicker/TimepickerUI';
import { parseTime, createDisabledTimeCheck } from '@/utils/time/public';
import type { DisabledTimeCheckOptions } from '@/utils/time/public';

const SETTLE_MS = 2000;

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const mountClosed = (clock: {
  type: '12h' | '24h';
  showSeconds: boolean;
}): {
  picker: TimepickerUI;
  onError: jest.Mock;
} => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { clock, ui: { animation: false } });
  picker.create();
  const onError = jest.fn();
  picker.on('error', onError);
  return { picker, onError };
};

describe('parseTime follows setValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  const TEXTS = ['14:30', '2:30 PM', '12:00 AM', '9:05', '14:30:05', 'nope'];
  const CLOCKS = (['12h', '24h'] as const).flatMap((type) =>
    [false, true].map((showSeconds) => ({ type, showSeconds })),
  );

  describe.each(CLOCKS)('clock $type, showSeconds $showSeconds', (clock) => {
    it.each(TEXTS)('%p', (text) => {
      const { picker, onError } = mountClosed(clock);
      const before = picker.getValue();
      const parsed = parseTime(text, { clockType: clock.type, showSeconds: clock.showSeconds });

      picker.setValue(text);
      const after = picker.getValue();

      if (parsed === null) {
        expect(onError).toHaveBeenCalledTimes(1);
        expect(after).toEqual(before);
        return;
      }

      expect(onError).not.toHaveBeenCalled();
      expect(after.hour).toBe(parsed.hour);
      expect(after.minutes).toBe(parsed.minutes);
      expect(after.type).toBe(clock.type === '12h' ? parsed.type : undefined);
      if (clock.showSeconds) {
        expect(after.seconds).toBe(parsed.seconds ?? '00');
      } else {
        expect(after.seconds).toBeUndefined();
      }
    });
  });
});

describe('createDisabledTimeCheck follows the minute dial', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  interface Fixture {
    readonly name: string;
    readonly value: string;
    readonly clock: DisabledTimeCheckOptions;
  }

  const FIXTURES: ReadonlyArray<Fixture> = [
    {
      name: '24h hour and minute lists',
      value: '10:20',
      clock: { type: '24h', disabledTime: { hours: [1, 3], minutes: [15, 30] } },
    },
    {
      name: '12h ranges with 12h edges',
      value: '12:30 PM',
      clock: { type: '12h', disabledTime: { ranges: ['10:00 AM - 12:00 PM'] } },
    },
    {
      name: '24h isTimeDisabled',
      value: '14:45',
      clock: { type: '24h', isTimeDisabled: ({ hour, minutes }) => hour === 14 && minutes < 30 },
    },
  ];

  it.each(FIXTURES)('$name', ({ value, clock }) => {
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { clock, ui: { animation: false } });
    picker.create();
    picker.open();
    settle();

    const modal = document.querySelector('.tp-ui-modal') as HTMLElement;
    (modal.querySelector('.tp-ui-minutes') as HTMLElement).click();
    settle();

    const isDisabled = createDisabledTimeCheck(clock);
    const hour = (modal.querySelector('.tp-ui-hour') as HTMLInputElement).value;
    const { type } = picker.getValue();
    const tips = Array.from(modal.querySelectorAll<HTMLElement>('.tp-ui-minutes-time'));

    expect(tips.length).toBeGreaterThan(0);
    const mismatches = tips
      .map((tip) => {
        const minutes = tip.textContent ?? '';
        const time = clock.type === '12h' ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
        return {
          time,
          dial: tip.classList.contains('tp-ui-tips-disabled'),
          check: isDisabled(time),
        };
      })
      .filter(({ dial, check }) => dial !== check);

    expect(mismatches).toEqual([]);
    expect(tips.some((tip) => tip.classList.contains('tp-ui-tips-disabled'))).toBe(true);
  });
});
