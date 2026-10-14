import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';
import { TIMINGS } from '@/constants/timings';

const CLOSE_CYCLE_MS = TIMINGS.MODAL_EXIT;

const createPicker = (callbacks: TimepickerOptions['callbacks'] = {}): TimepickerUI => {
  const input = document.createElement('input');
  input.value = '10:15';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false }, callbacks });
  picker.create();
  return picker;
};

const openAndConfirm = (picker: TimepickerUI): void => {
  picker.open();
  const ok = document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement;
  expect(ok).not.toBeNull();
  ok.click();
  jest.advanceTimersByTime(CLOSE_CYCLE_MS);
};

describe('callbacks passed through update() replace the ones given at create', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each([false, true])('should call only the updated onConfirm (update with create: %p)', (create) => {
    const initial = jest.fn();
    const updated = jest.fn();
    const picker = createPicker({ onConfirm: initial });

    picker.update({ options: { callbacks: { onConfirm: updated } }, create });
    openAndConfirm(picker);

    expect(updated).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledWith(expect.objectContaining({ hour: '10', minutes: '15' }));
    expect(initial).not.toHaveBeenCalled();
  });

  it('should call the updated onConfirm once per confirm when the same update is applied twice', () => {
    const initial = jest.fn();
    const updated = jest.fn();
    const picker = createPicker({ onConfirm: initial });

    picker.update({ options: { callbacks: { onConfirm: updated } } });
    picker.update({ options: { callbacks: { onConfirm: updated } } });
    openAndConfirm(picker);

    expect(updated).toHaveBeenCalledTimes(1);

    openAndConfirm(picker);

    expect(updated).toHaveBeenCalledTimes(2);
    expect(initial).not.toHaveBeenCalled();
  });

  it('should connect a callback that was not given at create', () => {
    const onOpen = jest.fn();
    const picker = createPicker();

    picker.update({ options: { callbacks: { onOpen } } });
    picker.open();

    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
