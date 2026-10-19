import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimeOfDay, TimepickerOptions } from '@/types/options';

const SETTLE_MS = 1000;

const openPicker = (value: string, clock: TimepickerOptions['clock']): TimepickerUI => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { clock, ui: { animation: false } });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(SETTLE_MS);
  return picker;
};

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;

const tips = (): HTMLElement[] => [
  ...modal().querySelectorAll<HTMLElement>('.tp-ui-value-tips, .tp-ui-value-tips-24h'),
];

const disabledTips = (): number[] =>
  tips()
    .filter((tip) => tip.classList.contains('tp-ui-tips-disabled'))
    .map((tip) => Number(tip.textContent))
    .sort((a, b) => a - b);

const showMinutes = (): void => {
  (modal().querySelector('.tp-ui-minutes') as HTMLElement).click();
  jest.advanceTimersByTime(SETTLE_MS);
};

describe('clock tips honour clock.isTimeDisabled (no disabledTime configured)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('marks hour tips disabled in the 24h hours face', () => {
    openPicker('10:30', { type: '24h', isTimeDisabled: ({ hour }) => hour < 9 || hour >= 17 });

    const disabled = disabledTips();

    expect(disabled).toEqual(expect.arrayContaining([0, 3, 8, 17, 20, 23]));
    expect(disabled).not.toContain(10);
    expect(disabled).not.toContain(12);
  });

  it('marks minute tips disabled in the minutes face', () => {
    openPicker('10:30', { type: '24h', isTimeDisabled: ({ minutes }) => minutes >= 30 });
    showMinutes();

    expect(disabledTips()).toEqual([30, 35, 40, 45, 50, 55]);
  });

  it('marks a minute disabled only when the predicate depends on the selected hour', () => {
    openPicker('10:30', { type: '24h', isTimeDisabled: ({ hour, minutes }) => hour === 10 && minutes < 15 });
    showMinutes();

    expect(disabledTips()).toEqual([0, 5, 10]);
  });

  it('marks nothing when the predicate never disables', () => {
    openPicker('10:30', { type: '24h', isTimeDisabled: () => false });

    expect(disabledTips()).toEqual([]);
    showMinutes();
    expect(disabledTips()).toEqual([]);
  });

  it('receives hour 0-23 in the 12h face', () => {
    openPicker('03:00 PM', { type: '12h', isTimeDisabled: ({ hour }) => hour >= 17 });

    expect(disabledTips()).toEqual([5, 6, 7, 8, 9, 10, 11]);
  });

  it('is a union with disabledTime lists', () => {
    openPicker('10:30', {
      type: '24h',
      disabledTime: { hours: ['3'] },
      isTimeDisabled: ({ hour }) => hour === 20,
    });

    expect(disabledTips()).toEqual(expect.arrayContaining([3, 20]));
    expect(disabledTips()).not.toContain(10);
  });

  it('calls a throwing function as enabled and rethrows later without breaking the face', () => {
    const queued: Array<() => void> = [];
    const spy = jest
      .spyOn(globalThis, 'queueMicrotask')
      .mockImplementation((callback: VoidFunction) => void queued.push(callback));
    const boom = new Error('boom');

    openPicker('10:30', {
      type: '24h',
      isTimeDisabled: ({ hour }: TimeOfDay) => {
        if (hour === 5) throw boom;
        return hour === 20;
      },
    });

    expect(disabledTips()).toEqual(expect.arrayContaining([20]));
    expect(disabledTips()).not.toContain(5);
    expect(queued.length).toBeGreaterThan(0);
    queued.forEach((callback) => expect(callback).toThrow(boom));
    spy.mockRestore();
  });
});
