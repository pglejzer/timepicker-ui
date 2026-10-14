import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import type { TimepickerOptions } from '@/types/options';

type RangeOptions = NonNullable<TimepickerOptions['range']>;
type Internals = { emitter: { emit: (event: string, data: unknown) => void } };

interface LimitsHarness {
  readonly input: HTMLInputElement;
  readonly commit: (time: string) => void;
  readonly onValidation: jest.Mock;
  readonly onConfirm: jest.Mock;
}

const OPEN_MS = 500;

const okButton = (): HTMLElement => {
  const button = document.querySelector<HTMLElement>('.tp-ui-modal div.tp-ui-ok-btn[role="button"]');
  if (!button) throw new Error('OK button is not rendered in the modal');
  return button;
};

const pressEnter = (element: Element): void => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
};

const openRange = (range: RangeOptions): LimitsHarness => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false },
    range: { enabled: true, ...range },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(OPEN_MS);

  const onValidation = jest.fn();
  const onConfirm = jest.fn();
  picker.on('range:validation', onValidation);
  picker.on('range:confirm', onConfirm);

  const { emitter } = picker as unknown as Internals;
  const commit = (time: string): void => {
    const [hour, minutes] = time.split(':');
    emitter.emit('range:minute:commit', { hour, minutes });
  };

  return { input, commit, onValidation, onConfirm };
};

describe('range limits keep OK disabled for a committed range outside min/max duration', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should keep OK disabled and confirm nothing for 09:00-11:00 with maxDuration 60', () => {
    const { input, commit, onValidation, onConfirm } = openRange({ maxDuration: 60 });
    const valueBefore = input.value;

    commit('09:00');
    commit('11:00');

    expect(okButton()).toHaveAttribute('aria-disabled', 'true');
    expect(okButton()).toHaveClass('disabled');
    expect(onValidation).toHaveBeenLastCalledWith(
      expect.objectContaining({ valid: false, duration: 120, maxDuration: 60 }),
    );

    okButton().click();
    pressEnter(okButton());

    expect(onConfirm).not.toHaveBeenCalled();
    expect(input.value).toBe(valueBefore);
  });

  it('should enable OK and confirm 09:00-09:45 with maxDuration 60', () => {
    const { input, commit, onValidation, onConfirm } = openRange({ maxDuration: 60 });

    commit('09:00');
    commit('09:45');

    expect(okButton()).toHaveAttribute('aria-disabled', 'false');
    expect(okButton()).not.toHaveClass('disabled');
    expect(onValidation).toHaveBeenLastCalledWith(
      expect.objectContaining({ valid: true, duration: 45, maxDuration: 60 }),
    );

    pressEnter(okButton());

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({ from: '09:00', to: '09:45', duration: 45 });
    expect(input.value).toBe('09:00 - 09:45');
  });

  it('should keep OK disabled for 09:00-09:15 with minDuration 30 and confirm once To moves to 09:45', () => {
    const { input, commit, onValidation, onConfirm } = openRange({ minDuration: 30 });
    const valueBefore = input.value;

    commit('09:00');
    commit('09:15');

    expect(okButton()).toHaveAttribute('aria-disabled', 'true');
    expect(okButton()).toHaveClass('disabled');
    expect(onValidation).toHaveBeenLastCalledWith(
      expect.objectContaining({ valid: false, duration: 15, minDuration: 30 }),
    );
    pressEnter(okButton());
    expect(onConfirm).not.toHaveBeenCalled();
    expect(input.value).toBe(valueBefore);

    commit('09:45');
    expect(okButton()).toHaveAttribute('aria-disabled', 'false');
    pressEnter(okButton());

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({ from: '09:00', to: '09:45', duration: 45 });
    expect(input.value).toBe('09:00 - 09:45');
  });
});
