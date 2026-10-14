import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';

describe('seconds validation', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  const createPicker = (
    value: string,
    options: TimepickerOptions,
  ): { picker: TimepickerUI; input: HTMLInputElement } => {
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
    picker.create();
    return { picker, input };
  };

  it.each([[60], ['75']])('rejects disabledTime.seconds containing %p', (second) => {
    const { picker } = createPicker('', {
      clock: { showSeconds: true, disabledTime: { seconds: [second] } },
    });
    expect(picker.isDestroyed).toBe(true);
  });

  it('accepts disabled seconds from 0 to 59 as numbers or strings', () => {
    const { picker } = createPicker('', {
      clock: { showSeconds: true, disabledTime: { seconds: [0, '59'] } },
    });
    expect(picker.isDestroyed).toBe(false);
  });

  it('flags an out-of-range second in the input value', () => {
    const onError = jest.fn();
    const { picker, input } = createPicker('10:00:75', {
      clock: { type: '24h', showSeconds: true },
      callbacks: { onError },
    });
    picker.open();
    expect(input.classList.contains('tp-ui-invalid-format')).toBe(true);
    const payload = onError.mock.calls[0]?.[0];
    expect(payload?.error).toEqual(expect.any(String));
    expect(String(payload?.inputSecond)).toBe('75');
  });

  it.each<[string, TimepickerOptions['clock']]>([
    ['10:00', { type: '24h', showSeconds: true }],
    ['02:30:15 PM', { type: '12h', showSeconds: true }],
    ['14:30:15', { type: '24h', showSeconds: false }],
  ])('accepts %s without an error', (value, clock) => {
    const onError = jest.fn();
    const { picker, input } = createPicker(value, { clock, callbacks: { onError } });
    picker.open();
    expect(input.classList.contains('tp-ui-invalid-format')).toBe(false);
    expect(onError).not.toHaveBeenCalled();
  });
});
