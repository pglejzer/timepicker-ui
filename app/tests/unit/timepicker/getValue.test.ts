import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import type { TimepickerOptions } from '../../../src/types/options';

describe('TimepickerUI.getValue()', () => {
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    input.classList.add('startClock');
    input.value = '11:45';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('returns input value after create() without opening widget', () => {
    const config: Partial<TimepickerOptions> = {
      clock: {
        type: '24h',
        incrementMinutes: 5,
        autoSwitchToMinutes: true,
      },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const result = timepicker.getValue();

    expect(result.hour).toBe('11');
    expect(result.minutes).toBe('45');
    expect(result.time).toBe('11:45');
  });

  test('returns correct value after open() and close()', () => {
    const config: Partial<TimepickerOptions> = {
      clock: {
        type: '24h',
        incrementMinutes: 5,
        autoSwitchToMinutes: true,
      },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.open();

    setTimeout(() => {
      timepicker.close();

      const result = timepicker.getValue();

      expect(result.hour).toBe('11');
      expect(result.minutes).toBe('45');
      expect(result.time).toBe('11:45');
    }, 100);
  });

  test('returns correct value when called from external button', () => {
    const config: Partial<TimepickerOptions> = {
      clock: {
        type: '24h',
        incrementMinutes: 5,
        autoSwitchToMinutes: true,
      },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    const button = document.createElement('button');
    button.classList.add('duration-30m');
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      const value = timepicker.getValue();
      expect(value.hour).toBe('11');
      expect(value.minutes).toBe('45');
    });

    button.click();

    const result = timepicker.getValue();
    expect(result.hour).toBe('11');
    expect(result.minutes).toBe('45');
  });

  test('returns updated value after manual input change', () => {
    const config: Partial<TimepickerOptions> = {
      clock: {
        type: '24h',
        incrementMinutes: 5,
        autoSwitchToMinutes: true,
      },
    };

    const timepicker = new TimepickerUI(input, config);
    timepicker.create();

    timepicker.open();

    setTimeout(() => {
      timepicker.close();

      input.value = '13:30';

      const result = timepicker.getValue();
      expect(result.hour).toBe('13');
      expect(result.minutes).toBe('30');
    }, 100);
  });
});

