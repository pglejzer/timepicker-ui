import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import type { EventEmitter, TimepickerEventMap } from '../../../src/utils/EventEmitter';
import type { TimepickerOptions } from '../../../src/types/options';

type ClockType = '12h' | '24h';

const INVALID_FORMAT: Record<ClockType, string> = {
  '12h': 'Invalid 12h format. Expected HH:MM AM/PM',
  '24h': 'Invalid 24h format. Expected HH:MM',
};

const VALID_TIME: Record<ClockType, string> = { '12h': '09:15 AM', '24h': '09:15' };

const NOT_A_TIME = ['25:00:00', 'abc', '13:00 PM', '10:60'];

const periodMatching = (state: string): string | undefined =>
  document.querySelector<HTMLElement>(`.tp-ui-modal .tp-ui-type-mode${state}`)?.dataset.type;

const periodState = (): { active?: string; pressed?: string } => ({
  active: periodMatching('.active'),
  pressed: periodMatching('[aria-pressed="true"]'),
});

describe('setValue edge cases', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.appendChild(input);
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('accepts a zero-padded 12h hour (bug #14)', () => {
    input.value = '02:30 PM';
    const picker = new TimepickerUI(input);
    picker.create();
    picker.setValue('03:45 PM');
    expect(input.value).toBe('03:45 PM');
  });

  it('round-trips getValue().time through setValue (bug #14)', () => {
    input.value = '09:05 AM';
    const picker = new TimepickerUI(input);
    picker.create();
    picker.setValue(picker.getValue().time.replace('AM', 'PM'));
    expect(input.value).toBe('09:05 PM');
  });

  it('keeps the caller text when the shape already matches', () => {
    input.value = '02:30 PM';
    const picker = new TimepickerUI(input);
    picker.create();
    picker.setValue('3:45 PM');
    expect(input.value).toBe('3:45 PM');
  });

  it('moves the clock face to the new value while open (S16)', () => {
    input.value = '10:00';
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    picker.create();
    picker.open();
    picker.setValue('15:00');
    const active = document.querySelector(
      '.tp-ui-modal .tp-ui-value-tips.active, .tp-ui-modal .tp-ui-value-tips-24h.active',
    );
    expect(active?.textContent).toBe('15');
  });

  const createPicker = (value: string, options: TimepickerOptions = {}): TimepickerUI => {
    input.value = value;
    const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
    picker.create();
    return picker;
  };

  const createOpenPicker = (value: string, options: TimepickerOptions): TimepickerUI => {
    const picker = createPicker(value, options);
    picker.open();
    return picker;
  };

  describe('with a time in the other clock format', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      TimepickerUI.destroyAll();
      jest.useRealTimers();
    });

    it('should show 02:30 with PM active in an open 12h picker given 14:30', () => {
      const picker = createOpenPicker('09:00 AM', { clock: { type: '12h' } });

      picker.setValue('14:30');

      expect(picker.hour?.value).toBe('02');
      expect(picker.minutes?.value).toBe('30');
      expect(periodState()).toEqual({ active: 'PM', pressed: 'PM' });
      expect(input.value).toBe('02:30 PM');
    });

    it('should show hour 14 in an open 24h picker given 2:30 PM', () => {
      const picker = createOpenPicker('09:00', { clock: { type: '24h' } });

      picker.setValue('2:30 PM');

      expect(picker.hour?.value).toBe('14');
      expect(picker.minutes?.value).toBe('30');
      expect(input.value).toBe('14:30');
    });

    it('should update the open header but leave the input with updateInput false', () => {
      const picker = createOpenPicker('09:00 AM', { clock: { type: '12h' } });

      picker.setValue('14:30', false);

      expect(input.value).toBe('09:00 AM');
      expect(picker.hour?.value).toBe('02');
      expect(picker.minutes?.value).toBe('30');
      expect(periodState()).toEqual({ active: 'PM', pressed: 'PM' });
    });
  });

  it.each<[ClockType, string, string]>([
    ['12h', '3:45 PM', '3:45 PM'],
    ['24h', '9:05', '9:05'],
    ['12h', '9:05', '09:05 AM'],
    ['24h', '3:45 PM', '15:45'],
  ])(
    'a %s picker keeps its own format as typed and normalises the other one: %p becomes %p',
    (clockType, time, expected) => {
      const picker = createPicker('', { clock: { type: clockType } });

      picker.setValue(time);

      expect(input.value).toBe(expected);
    },
  );

  describe('with a string that is not a time', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      TimepickerUI.destroyAll();
      jest.useRealTimers();
    });

    const cases = (['12h', '24h'] as const).flatMap((clockType) =>
      NOT_A_TIME.map((time): [ClockType, string] => [clockType, time]),
    );

    it.each(cases)('an open %s picker should report %p once and change nothing', (clockType, time) => {
      const onError = jest.fn();
      const picker = createOpenPicker(VALID_TIME[clockType], {
        clock: { type: clockType },
        callbacks: { onError },
      });
      const errorListener = jest.fn();
      picker.on('error', errorListener);
      const readHeader = (): Record<string, unknown> => ({
        hour: picker.hour?.value,
        minutes: picker.minutes?.value,
        period: periodState(),
      });
      const valueBefore = picker.getValue();
      const headerBefore = readHeader();

      picker.setValue(time);

      const expected = { error: INVALID_FORMAT[clockType] };
      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(expected);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(expected);
      expect(input.value).toBe(VALID_TIME[clockType]);
      expect(picker.getValue()).toEqual(valueBefore);
      expect(readHeader()).toEqual(headerBefore);
    });

    it('should report it through callbacks.onError when setValue() creates the picker', () => {
      const onError = jest.fn();
      const picker = new TimepickerUI(input, { callbacks: { onError } });

      picker.setValue('abc');

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ error: INVALID_FORMAT['12h'] });
      expect(input.value).toBe('');
    });
  });

  describe('with nothing to set', () => {
    it.each<[string, unknown]>([
      ['an empty string', ''],
      ['whitespace', '   '],
      ['null', null],
      ['a number', 123],
    ])('should ignore %s without an error or a change', (_label, value) => {
      const onError = jest.fn();
      const picker = createPicker('09:15 AM', { callbacks: { onError } });
      const errorListener = jest.fn();
      picker.on('error', errorListener);
      const valueBefore = picker.getValue();

      picker.setValue(value as string);

      expect(errorListener).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(input.value).toBe('09:15 AM');
      expect(picker.getValue()).toEqual(valueBefore);
    });

    it('should emit nothing once the picker is destroyed', () => {
      const onError = jest.fn();
      const picker = createPicker('09:15 AM', { callbacks: { onError } });
      const { emitter } = picker as unknown as { emitter: EventEmitter<TimepickerEventMap> };
      picker.destroy();
      const valueAfterDestroy = input.value;
      const emitSpy = jest.spyOn(emitter, 'emit');

      picker.setValue('abc');
      picker.setValue('14:30');

      expect(emitSpy).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(input.value).toBe(valueAfterDestroy);
    });
  });
});
