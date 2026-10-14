import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { TIMINGS } from '../../../src/constants/timings';
import type { TimepickerOptions } from '../../../src/types/options';

describe('TimepickerUI.setValue()', () => {
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    input.classList.add('timepicker');
    input.value = '';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  test('sets value without opening modal', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('14:30');

    expect(input.value).toBe('14:30');
  });

  test('getValue returns correct value after setValue without opening modal', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('15:45');

    const result = timepicker.getValue();
    expect(result.hour).toBe('15');
    expect(result.minutes).toBe('45');
    expect(result.time).toBe('15:45');
  });

  test('does not update input when updateInput=false', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    input.value = '10:00';
    timepicker.setValue('14:30', false);

    expect(input.value).toBe('10:00');
  });

  test('sets value after opening modal', () => {
    jest.useFakeTimers();
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();
    timepicker.open();
    jest.advanceTimersByTime(100);

    timepicker.setValue('16:20');

    const result = timepicker.getValue();
    expect(result.hour).toBe('16');
    expect(result.minutes).toBe('20');
    expect(input.value).toBe('16:20');
    expect((document.querySelector('.tp-ui-modal .tp-ui-hour') as HTMLInputElement).value).toBe('16');
    expect((document.querySelector('.tp-ui-modal .tp-ui-minutes') as HTMLInputElement).value).toBe('20');
  });

  test('handles 12h format with AM/PM', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '12h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('3:45 PM');

    expect(input.value).toBe('3:45 PM');

    const result = timepicker.getValue();
    expect(result.hour).toBe('03');
    expect(result.minutes).toBe('45');
    expect(result.type).toBe('PM');
  });

  test('flips the active class and aria-pressed on both AM/PM buttons to the period it sets', () => {
    const timepicker = new TimepickerUI(input, { clock: { type: '12h' }, ui: { animation: false } });
    timepicker.create();
    timepicker.open();

    const am = document.querySelector('.tp-ui-modal .tp-ui-am') as HTMLElement;
    const pm = document.querySelector('.tp-ui-modal .tp-ui-pm') as HTMLElement;
    const periodState = (): Record<'am' | 'pm', { active: boolean; pressed: string | null }> => ({
      am: { active: am.classList.contains('active'), pressed: am.getAttribute('aria-pressed') },
      pm: { active: pm.classList.contains('active'), pressed: pm.getAttribute('aria-pressed') },
    });

    timepicker.setValue('09:15 AM');

    expect(periodState()).toEqual({
      am: { active: true, pressed: 'true' },
      pm: { active: false, pressed: 'false' },
    });

    timepicker.setValue('09:15 PM');

    expect(periodState()).toEqual({
      am: { active: false, pressed: 'false' },
      pm: { active: true, pressed: 'true' },
    });

    timepicker.destroy();
  });

  test('maintains consistency after setValue and open/close', () => {
    jest.useFakeTimers();
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('13:15');

    let resultBefore = timepicker.getValue();
    expect(resultBefore.hour).toBe('13');
    expect(resultBefore.minutes).toBe('15');

    timepicker.open();
    jest.advanceTimersByTime(100);

    const resultWhileOpen = timepicker.getValue();
    expect(resultWhileOpen.hour).toBe('13');
    expect(resultWhileOpen.minutes).toBe('15');

    timepicker.close();
    jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);
    expect(document.querySelector('.tp-ui-modal')).toBeNull();

    const resultAfter = timepicker.getValue();
    expect(resultAfter.hour).toBe('13');
    expect(resultAfter.minutes).toBe('15');
    expect(input.value).toBe('13:15');
  });

  test('handles invalid format gracefully', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const originalValue = input.value;
    const onError = jest.fn();
    timepicker.on('error', onError);

    timepicker.setValue('invalid time');

    expect(input.value).toBe(originalValue);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith({ error: 'Invalid 24h format. Expected HH:MM' });
  });

  test('handles out of range values', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const originalValue = input.value;
    const onError = jest.fn();
    timepicker.on('error', onError);

    timepicker.setValue('25:30');

    expect(input.value).toBe(originalValue);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith({ error: 'Invalid 24h format. Expected HH:MM' });
  });

  test('works correctly when called before create()', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);

    timepicker.setValue('11:11');

    expect(input.value).toBe('11:11');

    const result = timepicker.getValue();
    expect(result.hour).toBe('11');
    expect(result.minutes).toBe('11');
  });

  test('handles rapid setValue calls', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('10:00');
    timepicker.setValue('11:00');
    timepicker.setValue('12:00');

    expect(input.value).toBe('12:00');

    const result = timepicker.getValue();
    expect(result.hour).toBe('12');
    expect(result.minutes).toBe('00');
  });
});

describe('TimepickerUI.setValue() with a time in the other clock format', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  const createPicker = (clock: TimepickerOptions['clock']): { picker: TimepickerUI; onError: jest.Mock } => {
    const picker = new TimepickerUI(input, { clock });
    picker.create();
    const onError = jest.fn();
    picker.on('error', onError);
    return { picker, onError };
  };

  test.each<[string, boolean, string]>([
    ['2:30 PM', false, '14:30'],
    ['02:30 PM', false, '14:30'],
    ['2:30:15 PM', false, '14:30'],
    ['2:30:15 PM', true, '14:30:15'],
    ['12:05 AM', false, '00:05'],
    ['12:05 PM', false, '12:05'],
  ])('a 24h picker converts %p (showSeconds: %p) to %p', (time, showSeconds, expected) => {
    const { picker, onError } = createPicker({ type: '24h', showSeconds });

    picker.setValue(time);

    expect(input.value).toBe(expected);
    expect(picker.getValue()).toEqual(
      expect.objectContaining({ hour: expected.slice(0, 2), minutes: expected.slice(3, 5), time: expected }),
    );
    expect(picker.getValue().type).toBeUndefined();
    expect(onError).not.toHaveBeenCalled();
  });

  test.each<[string, boolean, string]>([
    ['14:30', false, '02:30 PM'],
    ['00:15', false, '12:15 AM'],
    ['12:00', false, '12:00 PM'],
    ['14:30', true, '02:30:00 PM'],
    ['14:30:15', true, '02:30:15 PM'],
  ])('a 12h picker converts %p (showSeconds: %p) to %p', (time, showSeconds, expected) => {
    const { picker, onError } = createPicker({ type: '12h', showSeconds });

    picker.setValue(time);

    expect(input.value).toBe(expected);
    expect(picker.getValue()).toEqual(
      expect.objectContaining({
        hour: expected.slice(0, 2),
        minutes: expected.slice(3, 5),
        type: expected.slice(-2),
        time: expected,
      }),
    );
    expect(onError).not.toHaveBeenCalled();
  });
});

