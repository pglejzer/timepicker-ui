import ValidationManager from '@/managers/ValidationManager';
import TimepickerUI from '@/timepicker/TimepickerUI';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { mergeOptions } from '@/utils/options/defaults';
import { TimepickerError } from '@/utils/errors';
import type { TimepickerOptions } from '@/types/options';

const validate = (clock: Record<string, unknown>): void => {
  const host = document.createElement('div');
  host.appendChild(document.createElement('input'));
  document.body.appendChild(host);
  const options = mergeOptions({ clock } as TimepickerOptions);
  const manager = new ValidationManager(
    new CoreState(host, options, 'validation-is-time-disabled'),
    new EventEmitter<TimepickerEventMap>(),
  );
  try {
    manager.checkDisabledValuesOnStart();
  } finally {
    manager.destroy();
  }
};

afterEach(() => {
  TimepickerUI.destroyAll();
  document.body.innerHTML = '';
});

describe('checkDisabledValuesOnStart with clock.isTimeDisabled', () => {
  it('accepts a function', () => {
    expect(() => validate({ type: '24h', isTimeDisabled: () => false })).not.toThrow();
  });

  it('accepts the option being absent or falsy', () => {
    expect(() => validate({ type: '24h' })).not.toThrow();
    expect(() => validate({ type: '24h', isTimeDisabled: undefined })).not.toThrow();
  });

  it.each([['a string', 'yes'], ['an object', {}], ['a number', 5], ['true', true]])(
    'throws a TimepickerError for %s',
    (_label, value) => {
      expect(() => validate({ type: '24h', isTimeDisabled: value })).toThrow(TimepickerError);
      expect(() => validate({ type: '24h', isTimeDisabled: value })).toThrow(
        'clock.isTimeDisabled must be a function',
      );
    },
  );
});

describe('an invalid clock.isTimeDisabled through the picker', () => {
  const makeInput = (): HTMLInputElement => {
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    return input;
  };

  it('emits error on create and does not initialise', () => {
    const picker = new TimepickerUI(makeInput(), {
      clock: { type: '24h', isTimeDisabled: 'nope' as unknown as () => boolean },
      ui: { animation: false },
    });
    const onError = jest.fn();
    picker.on('error', onError);

    picker.create();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].error).toContain('clock.isTimeDisabled must be a function');
    expect(picker.isDestroyed).toBe(true);
  });

  it('emits error from setOptions and keeps the previous options', () => {
    const picker = new TimepickerUI(makeInput(), {
      clock: { type: '24h', isTimeDisabled: () => false },
      ui: { animation: false },
    });
    picker.create();
    const onError = jest.fn();
    picker.on('error', onError);

    picker.setOptions({ clock: { isTimeDisabled: 5 as unknown as () => boolean } });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].error).toContain('clock.isTimeDisabled must be a function');
    expect(picker.isDestroyed).toBe(false);
    expect(() => picker.open()).not.toThrow();
  });
});
