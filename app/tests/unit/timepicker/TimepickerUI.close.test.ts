import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';

const CLOSE_CYCLE_MS = TIMINGS.MODAL_EXIT;

describe('close(update) commits the current selection only when asked to', () => {
  let input: HTMLInputElement;
  let picker: TimepickerUI;
  let onConfirm: jest.Mock;

  const openAndRaiseHour = (): void => {
    picker.create();
    picker.open();
    const hour = document.querySelector('.tp-ui-modal .tp-ui-hour') as HTMLInputElement;
    hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    expect(hour.value).toBe('11');
  };

  beforeEach(() => {
    jest.useFakeTimers();
    input = document.createElement('input');
    input.value = '10:15';
    document.body.appendChild(input);
    picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    onConfirm = jest.fn();
    picker.on('confirm', onConfirm);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should write the changed value and confirm once on close(true), like clicking OK', () => {
    openAndRaiseHour();

    picker.close(true);
    jest.advanceTimersByTime(CLOSE_CYCLE_MS);

    expect(input.value).toBe('11:15');
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ hour: '11', minutes: '15' }));
    expect(document.querySelector('.tp-ui-modal')).toBeNull();
  });

  it('should run the close callback once after close(true, callback)', () => {
    openAndRaiseHour();
    const done = jest.fn();

    picker.close(true, done);
    jest.advanceTimersByTime(CLOSE_CYCLE_MS);

    expect(done).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('11:15');
  });

  it.each<[string, (target: TimepickerUI) => void]>([
    ['close()', (target: TimepickerUI): void => target.close()],
    ['close(false)', (target: TimepickerUI): void => target.close(false)],
  ])('should leave the input unchanged and not confirm on %s', (_name, close) => {
    openAndRaiseHour();

    close(picker);
    jest.advanceTimersByTime(CLOSE_CYCLE_MS);

    expect(input.value).toBe('10:15');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(document.querySelector('.tp-ui-modal')).toBeNull();
  });
});
