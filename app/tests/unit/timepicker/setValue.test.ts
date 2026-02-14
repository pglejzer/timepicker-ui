import TimepickerUI from '../../../src/timepicker/TimepickerUI';
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
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();
    timepicker.open();

    setTimeout(() => {
      timepicker.setValue('16:20');

      const result = timepicker.getValue();
      expect(result.hour).toBe('16');
      expect(result.minutes).toBe('20');
      expect(input.value).toBe('16:20');

      timepicker.close();
    }, 100);
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

  test('maintains consistency after setValue and open/close', () => {
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

    setTimeout(() => {
      timepicker.close();

      let resultAfter = timepicker.getValue();
      expect(resultAfter.hour).toBe('13');
      expect(resultAfter.minutes).toBe('15');
      expect(input.value).toBe('13:15');
    }, 100);
  });

  test('handles invalid format gracefully', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const originalValue = input.value;

    timepicker.setValue('invalid time');

    expect(input.value).toBe(originalValue);
  });

  test('handles out of range values', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const originalValue = input.value;

    timepicker.setValue('25:30');

    expect(input.value).toBe(originalValue);
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

