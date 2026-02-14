import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import type { TimepickerOptions } from '../../../src/types/options';

describe('TimepickerUI degrees consistency', () => {
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('degrees match time after setValue without opening modal', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('14:30');

    const result = timepicker.getValue();

    expect(result.hour).toBe('14');
    expect(result.minutes).toBe('30');
    expect(result.degreesHours).toBe(420);
    expect(result.degreesMinutes).toBe(180);
  });

  test('degrees update when input value changes manually', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('10:00');

    let result1 = timepicker.getValue();
    expect(result1.hour).toBe('10');
    expect(result1.degreesHours).toBe(300);

    input.value = '15:45';

    let result2 = timepicker.getValue();
    expect(result2.hour).toBe('15');
    expect(result2.minutes).toBe('45');
    expect(result2.degreesHours).toBe(450);
    expect(result2.degreesMinutes).toBe(270);
  });

  test('degrees are consistent after multiple setValue calls', () => {
    const config: Partial<TimepickerOptions> = {
      clock: { type: '24h' },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.setValue('10:00');
    timepicker.setValue('12:15');
    timepicker.setValue('18:45');

    const result = timepicker.getValue();

    expect(result.hour).toBe('18');
    expect(result.minutes).toBe('45');
    expect(result.degreesHours).toBe(540);
    expect(result.degreesMinutes).toBe(270);
  });
});

